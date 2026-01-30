import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

// POST /api/community/like - Toggle like on a log
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { logId } = body

    if (!logId) {
      return NextResponse.json({ error: "Log ID is required" }, { status: 400 })
    }

    // Check if log exists and is public
    const log = await prisma.log.findUnique({
      where: { id: logId },
      select: { isPublic: true },
    })

    if (!log) {
      return NextResponse.json({ error: "Log not found" }, { status: 404 })
    }

    if (!log.isPublic) {
      return NextResponse.json({ error: "Cannot like private log" }, { status: 403 })
    }

    // Check if already liked
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_logId: {
          userId: session.user.id,
          logId,
        },
      },
    })

    if (existingLike) {
      // Unlike
      await prisma.like.delete({
        where: { id: existingLike.id },
      })
      return NextResponse.json({ liked: false })
    } else {
      // Like
      await prisma.like.create({
        data: {
          userId: session.user.id,
          logId,
        },
      })
      return NextResponse.json({ liked: true })
    }
  } catch (error) {
    console.error("Failed to toggle like:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
