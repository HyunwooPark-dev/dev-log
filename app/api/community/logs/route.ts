import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/community/logs - Get public logs feed
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const cursor = searchParams.get("cursor")
    const limit = parseInt(searchParams.get("limit") || "10")

    const logs = await prisma.log.findMany({
      where: { isPublic: true },
      take: limit + 1,
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      orderBy: { date: "desc" },
      include: {
        tags: true,
        user: {
          select: { id: true, name: true, image: true },
        },
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
      totalCount: await prisma.log.count({ where: { isPublic: true } }),
    })
  } catch (error) {
    console.error("Failed to fetch community logs:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
