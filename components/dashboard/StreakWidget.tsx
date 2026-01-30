"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Flame, Trophy } from "lucide-react"

export function StreakWidget() {
  // TODO: Replace with React Query hook
  const currentStreak = 12
  const longestStreak = 28

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">연속 기록</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="h-8 w-8 text-orange-500" />
            <div>
              <p className="text-3xl font-bold">{currentStreak}일</p>
              <p className="text-xs text-muted-foreground">현재 스트릭</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <div className="text-right">
              <p className="text-lg font-semibold">{longestStreak}일</p>
              <p className="text-xs">최장 기록</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
