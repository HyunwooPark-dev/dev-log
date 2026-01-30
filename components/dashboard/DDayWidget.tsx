"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "lucide-react"

interface DDayWidgetProps {
  title: string
  targetDate: Date
}

export function DDayWidget({ title, targetDate }: DDayWidgetProps) {
  const today = new Date()
  const diffTime = targetDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          D-Day
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold mt-1">
          {diffDays > 0 ? `D-${diffDays}` : diffDays === 0 ? "D-Day!" : `D+${Math.abs(diffDays)}`}
        </p>
      </CardContent>
    </Card>
  )
}
