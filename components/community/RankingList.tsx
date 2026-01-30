"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Flame, Medal } from "lucide-react"

// Placeholder data
const rankings = [
  { userId: "1", userName: "김개발", userImage: null, streak: 45, totalLogs: 156, rank: 1 },
  { userId: "2", userName: "이코딩", userImage: null, streak: 32, totalLogs: 98, rank: 2 },
  { userId: "3", userName: "박학습", userImage: null, streak: 28, totalLogs: 87, rank: 3 },
  { userId: "4", userName: "최프론트", userImage: null, streak: 21, totalLogs: 76, rank: 4 },
  { userId: "5", userName: "정백엔드", userImage: null, streak: 18, totalLogs: 65, rank: 5 },
]

const medalColors: Record<number, string> = {
  1: "text-yellow-500",
  2: "text-gray-400",
  3: "text-amber-600",
}

export function RankingList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Medal className="h-5 w-5" />
          꾸준함 랭킹
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {rankings.map((user) => (
            <div key={user.userId} className="flex items-center gap-3">
              <span
                className={`text-lg font-bold w-6 ${
                  medalColors[user.rank] || "text-muted-foreground"
                }`}
              >
                {user.rank}
              </span>
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.userImage || undefined} />
                <AvatarFallback>{user.userName?.[0] || "?"}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium">{user.userName}</p>
                <p className="text-xs text-muted-foreground">
                  총 {user.totalLogs}개 로그
                </p>
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
  )
}
