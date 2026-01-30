import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateArticle } from "@/lib/openai"
import { auth } from "@/lib/auth"

// POST /api/ai/generate - Generate article from logs
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { logIds, title, style } = body

    if (!logIds?.length) {
      return NextResponse.json({ error: "Log IDs are required" }, { status: 400 })
    }

    // Fetch logs
    const logs = await prisma.log.findMany({
      where: {
        id: { in: logIds },
        userId: session.user.id,
      },
      include: { tags: true },
    })

    if (logs.length === 0) {
      return NextResponse.json({ error: "No logs found" }, { status: 404 })
    }

    // Generate article
    const logsForGeneration = logs.map((log) => ({
      content: log.content,
      tags: log.tags.map((t) => t.name),
    }))

    const result = await generateArticle(logsForGeneration, { title, style })

    // Save article
    const article = await prisma.article.create({
      data: {
        title: result.title,
        content: result.content,
        sourceLogIds: logIds,
        userId: session.user.id,
      },
    })

    return NextResponse.json({
      ...article,
      generatedTitle: result.title,
      generatedContent: result.content,
    })
  } catch (error) {
    console.error("Failed to generate article:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
