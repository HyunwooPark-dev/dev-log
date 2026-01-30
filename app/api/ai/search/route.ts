import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateEmbedding } from "@/lib/openai"
import { searchSimilarLogs } from "@/lib/supabase"
import { auth } from "@/lib/auth"

// POST /api/ai/search - Search logs using vector similarity
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { query } = body

    if (!query?.trim()) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    // Generate embedding for the query
    const queryEmbedding = await generateEmbedding(query)

    // Search for similar logs
    const similarLogs = await searchSimilarLogs(
      queryEmbedding,
      session.user.id,
      10,
      0.5
    )

    // Fetch full log data
    const logIds = similarLogs.map((log: { id: string }) => log.id)
    const logs = await prisma.log.findMany({
      where: {
        id: { in: logIds },
      },
      include: {
        tags: true,
        _count: {
          select: { likes: true },
        },
      },
    })

    // Sort by similarity score
    const logsWithSimilarity = logs.map((log) => {
      const similarLog = similarLogs.find((s: { id: string }) => s.id === log.id)
      return {
        ...log,
        similarity: similarLog?.similarity || 0,
      }
    }).sort((a, b) => b.similarity - a.similarity)

    return NextResponse.json({
      logs: logsWithSimilarity,
      totalCount: logsWithSimilarity.length,
      query,
    })
  } catch (error) {
    console.error("Failed to search logs:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
