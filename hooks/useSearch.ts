import { useMutation } from "@tanstack/react-query"
import type { SearchResult } from "@/types"

async function searchLogs(query: string): Promise<SearchResult> {
  const response = await fetch("/api/ai/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  })
  if (!response.ok) throw new Error("Failed to search")
  return response.json()
}

export function useSearch() {
  return useMutation({
    mutationFn: searchLogs,
  })
}
