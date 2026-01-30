"use client"

import { LogCard } from "@/components/logs/LogCard"
import { Skeleton } from "@/components/ui/skeleton"
import type { Log } from "@/types"

// Placeholder data
const publicLogs: Log[] = [
  {
    id: "p1",
    content: "React 19의 새로운 use 훅에 대해 배웠다. Promise와 Context를 더 쉽게 다룰 수 있게 되었다. Suspense와 함께 사용하면 데이터 페칭이 훨씬 간단해진다.",
    date: new Date(),
    isPublic: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: "1",
    user: { id: "1", email: "kim@example.com", name: "김개발", image: null, createdAt: new Date(), updatedAt: new Date() },
    tags: [
      { id: "1", name: "react" },
      { id: "2", name: "react19" },
    ],
    _count: { likes: 12 },
  },
  {
    id: "p2",
    content: "Drizzle ORM을 사용해봤는데 Prisma보다 타입 추론이 더 좋은 것 같다. SQL에 가까운 문법이 장점이자 단점.",
    date: new Date(Date.now() - 3600000),
    isPublic: true,
    createdAt: new Date(Date.now() - 3600000),
    updatedAt: new Date(Date.now() - 3600000),
    userId: "2",
    user: { id: "2", email: "lee@example.com", name: "이코딩", image: null, createdAt: new Date(), updatedAt: new Date() },
    tags: [
      { id: "3", name: "drizzle" },
      { id: "4", name: "orm" },
    ],
    _count: { likes: 8 },
  },
  {
    id: "p3",
    content: "Bun 1.0이 나왔다! Node.js보다 훨씬 빠르다고 하는데 실제로 테스트해보니 체감이 확실히 된다. 번들러와 테스트 러너까지 내장되어 있어서 편리함.",
    date: new Date(Date.now() - 7200000),
    isPublic: true,
    createdAt: new Date(Date.now() - 7200000),
    updatedAt: new Date(Date.now() - 7200000),
    userId: "3",
    user: { id: "3", email: "park@example.com", name: "박학습", image: null, createdAt: new Date(), updatedAt: new Date() },
    tags: [
      { id: "5", name: "bun" },
      { id: "6", name: "javascript" },
    ],
    _count: { likes: 15 },
  },
]

export function PublicLogFeed() {
  // TODO: Replace with React Query hook
  const logs = publicLogs
  const isLoading = false

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        ))}
      </div>
    )
  }

  if (logs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">공개된 로그가 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {logs.map((log) => (
        <LogCard key={log.id} log={log} showAuthor />
      ))}
    </div>
  )
}
