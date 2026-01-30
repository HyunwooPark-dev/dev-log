import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateEmbedding } from "@/lib/openai"
import { auth } from "@/lib/auth"

// GET /api/logs - Get user's logs with pagination
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const cursor = searchParams.get("cursor")
    const limit = parseInt(searchParams.get("limit") || "10")
    const tags = searchParams.get("tags")?.split(",").filter(Boolean)
    const sortBy = searchParams.get("sortBy") || "date"
    const sortOrder = searchParams.get("sortOrder") || "desc"

    const where = {
      userId: session.user.id,
      ...(tags?.length && {
        tags: {
          some: {
            name: { in: tags },
          },
        },
      }),
    }

    const logs = await prisma.log.findMany({
      where,
      take: limit + 1,
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      orderBy: sortBy === "date" ? { date: sortOrder as "asc" | "desc" } : { likes: { _count: sortOrder as "asc" | "desc" } },
      include: {
        tags: true,
        _count: {
          select: { likes: true },
        },
      },
    })

    const hasMore = logs.length > limit
    const data = hasMore ? logs.slice(0, -1) : logs

    return NextResponse.json({
      data,
      nextCursor: hasMore ? data[data.length - 1].id : undefined,
      hasMore,
      totalCount: await prisma.log.count({ where }),
    })
  } catch (error) {
    console.error("Failed to fetch logs:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/logs - Create a new log
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { content, date, isPublic, tags } = body

    if (!content?.trim()) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    // Create or connect tags
    const tagConnections = tags?.length
      ? {
          connectOrCreate: tags.map((name: string) => ({
            where: { name: name.toLowerCase() },
            create: { name: name.toLowerCase() },
          })),
        }
      : undefined

    const log = await prisma.log.create({
      data: {
        content,
        date: date ? new Date(date) : new Date(),
        isPublic: isPublic || false,
        userId: session.user.id,
        tags: tagConnections,
      },
      include: {
        tags: true,
        _count: {
          select: { likes: true },
        },
      },
    })

    // Generate embedding asynchronously (don't block response)
    generateEmbedding(content)
      .then(async (embedding) => {
        await prisma.$executeRaw`
          INSERT INTO "Embedding" (id, vector, "logId")
          VALUES (${log.id + "-emb"}, ${embedding}::vector, ${log.id})
        `
      })
      .catch((error) => {
        console.error("Failed to generate embedding:", error)
      })

    return NextResponse.json(log, { status: 201 })
  } catch (error) {
    console.error("Failed to create log:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
