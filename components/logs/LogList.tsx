"use client"

import { LogCard } from "./LogCard"
import { Skeleton } from "@/components/ui/skeleton"
import type { Log } from "@/types"

interface LogListProps {
  showPagination?: boolean
}

// Placeholder data for development
const placeholderLogs: Log[] = [
  {
    id: "1",
    content: "오늘은 React Query의 useInfiniteQuery에 대해 배웠다. 무한 스크롤 구현에 유용하게 사용할 수 있을 것 같다. fetchNextPage와 hasNextPage를 활용하면 쉽게 구현 가능.",
    date: new Date(),
    isPublic: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: "1",
    tags: [
      { id: "1", name: "react-query" },
      { id: "2", name: "react" },
    ],
    _count: { likes: 5 },
  },
  {
    id: "2",
    content: "Prisma에서 relation을 다루는 방법을 공부했다. include와 select를 적절히 사용하면 N+1 문제를 피할 수 있다.",
    date: new Date(Date.now() - 86400000),
    isPublic: false,
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 86400000),
    userId: "1",
    tags: [
      { id: "3", name: "prisma" },
      { id: "4", name: "database" },
    ],
    _count: { likes: 3 },
  },
]

export function LogList({ showPagination = false }: LogListProps) {
  // TODO: Replace with React Query hook
  const logs = placeholderLogs
  const isLoading = false

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        ))}
      </div>
    )
  }

  if (logs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">아직 작성한 로그가 없습니다.</p>
        <p className="text-sm text-muted-foreground mt-1">
          첫 번째 학습 로그를 작성해보세요!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {logs.map((log) => (
        <LogCard key={log.id} log={log} />
      ))}
      {showPagination && (
        <div className="flex justify-center pt-4">
          {/* TODO: Pagination or Load More button */}
        </div>
      )}
    </div>
  )
}
