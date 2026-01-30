import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

// GET /api/logs/[id] - Get a specific log
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params

    const log = await prisma.log.findUnique({
      where: { id },
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

    if (!log) {
      return NextResponse.json({ error: "Log not found" }, { status: 404 })
    }

    // Check access permission
    if (log.userId !== session.user.id && !log.isPublic) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    return NextResponse.json(log)
  } catch (error) {
    console.error("Failed to fetch log:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PATCH /api/logs/[id] - Update a log
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    const body = await request.json()
    const { content, date, isPublic, tags } = body

    // Check ownership
    const existingLog = await prisma.log.findUnique({
      where: { id },
      select: { userId: true },
    })

    if (!existingLog) {
      return NextResponse.json({ error: "Log not found" }, { status: 404 })
    }

    if (existingLog.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Update tags if provided
    const tagUpdate = tags
      ? {
          set: [],
          connectOrCreate: tags.map((name: string) => ({
            where: { name: name.toLowerCase() },
            create: { name: name.toLowerCase() },
          })),
        }
      : undefined

    const log = await prisma.log.update({
      where: { id },
      data: {
        ...(content !== undefined && { content }),
        ...(date !== undefined && { date: new Date(date) }),
        ...(isPublic !== undefined && { isPublic }),
        ...(tagUpdate && { tags: tagUpdate }),
      },
      include: {
        tags: true,
        _count: {
          select: { likes: true },
        },
      },
    })

    return NextResponse.json(log)
  } catch (error) {
    console.error("Failed to update log:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/logs/[id] - Delete a log
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params

    // Check ownership
    const existingLog = await prisma.log.findUnique({
      where: { id },
      select: { userId: true },
    })

    if (!existingLog) {
      return NextResponse.json({ error: "Log not found" }, { status: 404 })
    }

    if (existingLog.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await prisma.log.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete log:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
