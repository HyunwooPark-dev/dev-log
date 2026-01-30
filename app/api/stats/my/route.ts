import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    // Get total log count
    const totalLogs = await prisma.log.count({
      where: { userId },
    })

    // Get this week's logs
    const startOfWeek = new Date()
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
    startOfWeek.setHours(0, 0, 0, 0)

    const thisWeekLogs = await prisma.log.count({
      where: {
        userId,
        date: { gte: startOfWeek },
      },
    })

    // Calculate streak
    const logs = await prisma.log.findMany({
      where: { userId },
      select: { date: true },
      orderBy: { date: "desc" },
    })

    let currentStreak = 0
    let longestStreak = 0
    let tempStreak = 0
    let lastDate: Date | null = null

    const uniqueDates = new Set(
      logs.map((log) => log.date.toISOString().split("T")[0])
    )
    const sortedDates = Array.from(uniqueDates).sort().reverse()

    for (let i = 0; i < sortedDates.length; i++) {
      const currentDate = new Date(sortedDates[i])

      if (i === 0) {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const diffDays = Math.floor(
          (today.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
        )
        if (diffDays <= 1) {
          tempStreak = 1
          lastDate = currentDate
        }
      } else if (lastDate) {
        const diffDays = Math.floor(
          (lastDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
        )
        if (diffDays === 1) {
          tempStreak++
          lastDate = currentDate
        } else {
          break
        }
      }
    }
    currentStreak = tempStreak

    // Calculate longest streak
    tempStreak = 0
    lastDate = null
    for (const dateStr of sortedDates) {
      const currentDate = new Date(dateStr)
      if (!lastDate) {
        tempStreak = 1
        lastDate = currentDate
      } else {
        const diffDays = Math.floor(
          (lastDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
        )
        if (diffDays === 1) {
          tempStreak++
          lastDate = currentDate
        } else {
          longestStreak = Math.max(longestStreak, tempStreak)
          tempStreak = 1
          lastDate = currentDate
        }
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak)

    // Get tag statistics
    const tagStats = await prisma.tag.findMany({
      where: {
        logs: {
          some: { userId },
        },
      },
      select: {
        name: true,
        _count: {
          select: { logs: true },
        },
      },
      orderBy: {
        logs: { _count: "desc" },
      },
      take: 10,
    })

    const totalTagUsage = tagStats.reduce((sum, t) => sum + t._count.logs, 0)
    const formattedTagStats = tagStats.map((t) => ({
      tag: t.name,
      count: t._count.logs,
      percentage: totalTagUsage > 0 ? (t._count.logs / totalTagUsage) * 100 : 0,
    }))

    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const recentLogs = await prisma.log.groupBy({
      by: ["date"],
      where: {
        userId,
        date: { gte: thirtyDaysAgo },
      },
      _count: true,
    })

    const recentActivity = recentLogs.map((item) => ({
      date: item.date.toISOString().split("T")[0],
      count: item._count,
    }))

    return NextResponse.json({
      totalLogs,
      currentStreak,
      longestStreak,
      thisWeekLogs,
      weeklyGoal: 5, // TODO: Get from user settings
      tagStats: formattedTagStats,
      recentActivity,
    })
  } catch (error) {
    console.error("Failed to fetch stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
