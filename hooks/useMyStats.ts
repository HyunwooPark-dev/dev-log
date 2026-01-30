import { useQuery } from "@tanstack/react-query"
import type { MyStats } from "@/types"

async function fetchMyStats(): Promise<MyStats> {
  const response = await fetch("/api/stats/my")
  if (!response.ok) throw new Error("Failed to fetch stats")
  return response.json()
}

export function useMyStats() {
  return useQuery({
    queryKey: ["stats", "my"],
    queryFn: fetchMyStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
