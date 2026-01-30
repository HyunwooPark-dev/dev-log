import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateEmbedding } from "@/lib/openai"
import { auth } from "@/lib/auth"

// POST /api/ai/embed - Generate and store embedding for a log
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

    // Check ownership
    const log = await prisma.log.findUnique({
      where: { id: logId },
      select: { userId: true, content: true },
    })

    if (!log) {
      return NextResponse.json({ error: "Log not found" }, { status: 404 })
    }

    if (log.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Generate embedding
    const embedding = await generateEmbedding(log.content)

    // Store embedding using raw SQL for vector type
    await prisma.$executeRaw`
      INSERT INTO "Embedding" (id, vector, "logId")
      VALUES (${logId + "-emb"}, ${embedding}::vector, ${logId})
      ON CONFLICT ("logId") DO UPDATE SET vector = ${embedding}::vector
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to generate embedding:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
