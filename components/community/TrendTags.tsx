"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

// Placeholder data
const trendingTags = [
  { tag: "react", count: 234, trend: "up" as const },
  { tag: "typescript", count: 198, trend: "up" as const },
  { tag: "nextjs", count: 156, trend: "stable" as const },
  { tag: "prisma", count: 98, trend: "up" as const },
  { tag: "tailwind", count: 87, trend: "down" as const },
  { tag: "docker", count: 76, trend: "up" as const },
  { tag: "graphql", count: 65, trend: "stable" as const },
  { tag: "rust", count: 54, trend: "up" as const },
]

const trendIcons = {
  up: <TrendingUp className="h-3 w-3 text-green-500" />,
  down: <TrendingDown className="h-3 w-3 text-red-500" />,
  stable: <Minus className="h-3 w-3 text-muted-foreground" />,
}

export function TrendTags() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-500" />
          트렌드 태그
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {trendingTags.map((item) => (
            <Badge
              key={item.tag}
              variant="outline"
              className="cursor-pointer hover:bg-accent gap-1"
            >
              #{item.tag}
              <span className="text-muted-foreground">{item.count}</span>
              {trendIcons[item.trend]}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
