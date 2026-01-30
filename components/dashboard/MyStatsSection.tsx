"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StreakWidget } from "./StreakWidget"
import { WeeklyGoalWidget } from "./WeeklyGoalWidget"
import { TagStatsChart } from "./TagStatsChart"
import { ActivityChart } from "./ActivityChart"

export function MyStatsSection() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StreakWidget />
        <WeeklyGoalWidget />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>태그별 학습 통계</CardTitle>
        </CardHeader>
        <CardContent>
          <TagStatsChart />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>최근 30일 활동</CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityChart />
        </CardContent>
      </Card>
    </div>
  )
}
