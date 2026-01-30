"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Flame, TrendingUp } from "lucide-react"

// Placeholder data
const topUsers = [
  { id: "1", name: "김개발", streak: 45, image: null },
  { id: "2", name: "이코딩", streak: 32, image: null },
  { id: "3", name: "박학습", streak: 28, image: null },
]

const trendingTags = [
  { name: "react", count: 156 },
  { name: "typescript", count: 134 },
  { name: "nextjs", count: 98 },
  { name: "prisma", count: 67 },
  { name: "tailwind", count: 54 },
]

export function CommunitySection() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" />
            꾸준함 랭킹
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topUsers.map((user, index) => (
              <div key={user.id} className="flex items-center gap-3">
                <span className="text-sm font-bold text-muted-foreground w-5">
                  {index + 1}
                </span>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.image || undefined} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">{user.name}</p>
                </div>
                <Badge variant="secondary" className="gap-1">
                  <Flame className="h-3 w-3 text-orange-500" />
                  {user.streak}일
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            트렌드 태그
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {trendingTags.map((tag) => (
              <Badge key={tag.name} variant="outline" className="cursor-pointer hover:bg-accent">
                #{tag.name}
                <span className="ml-1 text-muted-foreground">{tag.count}</span>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
