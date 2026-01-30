import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { CommunityStats, Log, PaginatedResponse } from "@/types"

async function fetchCommunityStats(): Promise<CommunityStats> {
  const response = await fetch("/api/stats/community")
  if (!response.ok) throw new Error("Failed to fetch community stats")
  return response.json()
}

async function fetchCommunityLogs(params: {
  cursor?: string
  limit?: number
}): Promise<PaginatedResponse<Log>> {
  const searchParams = new URLSearchParams()
  if (params.cursor) searchParams.set("cursor", params.cursor)
  if (params.limit) searchParams.set("limit", params.limit.toString())

  const response = await fetch(`/api/community/logs?${searchParams.toString()}`)
  if (!response.ok) throw new Error("Failed to fetch community logs")
  return response.json()
}

async function toggleLike(logId: string): Promise<{ liked: boolean }> {
  const response = await fetch("/api/community/like", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ logId }),
  })
  if (!response.ok) throw new Error("Failed to toggle like")
  return response.json()
}

export function useCommunityStats() {
  return useQuery({
    queryKey: ["stats", "community"],
    queryFn: fetchCommunityStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useCommunityLogs() {
  return useInfiniteQuery({
    queryKey: ["logs", "community"],
    queryFn: ({ pageParam }) =>
      fetchCommunityLogs({ cursor: pageParam, limit: 10 }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
  })
}

export function useToggleLike() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: toggleLike,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["logs"] })
    },
  })
}
