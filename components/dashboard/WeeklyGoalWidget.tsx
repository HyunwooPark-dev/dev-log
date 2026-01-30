"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target } from "lucide-react"

export function WeeklyGoalWidget() {
  // TODO: Replace with React Query hook
  const thisWeekLogs = 4
  const weeklyGoal = 5
  const progress = Math.min((thisWeekLogs / weeklyGoal) * 100, 100)

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">주간 목표</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <Target className="h-8 w-8 text-blue-500" />
          <div className="flex-1">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">{thisWeekLogs}</span>
              <span className="text-muted-foreground">/ {weeklyGoal}개</span>
            </div>
            <div className="mt-2 h-2 w-full rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-blue-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {weeklyGoal - thisWeekLogs > 0
                ? `목표까지 ${weeklyGoal - thisWeekLogs}개 남음`
                : "목표 달성!"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
