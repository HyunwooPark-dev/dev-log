import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Get total public stats
    const totalPublicLogs = await prisma.log.count({
      where: { isPublic: true },
    })

    const totalUsers = await prisma.user.count()

    // Calculate rankings based on streak and total logs
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        image: true,
        logs: {
          select: { date: true },
          orderBy: { date: "desc" },
        },
      },
      take: 100, // Get top 100 users for ranking calculation
    })

    const userStreaks = users.map((user) => {
      // Calculate streak for each user
      const uniqueDates = new Set(
        user.logs.map((log) => log.date.toISOString().split("T")[0])
      )
      const sortedDates = Array.from(uniqueDates).sort().reverse()

      let streak = 0
      let lastDate: Date | null = null

      for (let i = 0; i < sortedDates.length; i++) {
        const currentDate = new Date(sortedDates[i])

        if (i === 0) {
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          const diffDays = Math.floor(
            (today.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
          )
          if (diffDays <= 1) {
            streak = 1
            lastDate = currentDate
          }
        } else if (lastDate) {
          const diffDays = Math.floor(
            (lastDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
          )
          if (diffDays === 1) {
            streak++
            lastDate = currentDate
          } else {
            break
          }
        }
      }

      return {
        userId: user.id,
        userName: user.name,
        userImage: user.image,
        streak,
        totalLogs: user.logs.length,
      }
    })

    // Sort by streak (descending), then by total logs
    const ranking = userStreaks
      .sort((a, b) => {
        if (b.streak !== a.streak) return b.streak - a.streak
        return b.totalLogs - a.totalLogs
      })
      .slice(0, 10)
      .map((user, index) => ({
        ...user,
        rank: index + 1,
      }))

    // Get trending tags (most used in last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const fourteenDaysAgo = new Date()
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14)

    const recentTags = await prisma.tag.findMany({
      where: {
        logs: {
          some: {
            isPublic: true,
            date: { gte: sevenDaysAgo },
          },
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

    // Calculate trend (compare with previous week)
    const trendingTags = await Promise.all(
      recentTags.map(async (tag) => {
        const currentWeekCount = await prisma.log.count({
          where: {
            isPublic: true,
            date: { gte: sevenDaysAgo },
            tags: { some: { name: tag.name } },
          },
        })

        const lastWeekCount = await prisma.log.count({
          where: {
            isPublic: true,
            date: { gte: fourteenDaysAgo, lt: sevenDaysAgo },
            tags: { some: { name: tag.name } },
          },
        })

        let trend: "up" | "down" | "stable" = "stable"
        if (currentWeekCount > lastWeekCount * 1.1) trend = "up"
        else if (currentWeekCount < lastWeekCount * 0.9) trend = "down"

        return {
          tag: tag.name,
          count: tag._count.logs,
          trend,
        }
      })
    )

    return NextResponse.json({
      ranking,
      trendingTags,
      totalUsers,
      totalPublicLogs,
    })
  } catch (error) {
    console.error("Failed to fetch community stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
