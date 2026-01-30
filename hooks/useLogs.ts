import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query"
import type { Log, CreateLogInput, UpdateLogInput, LogFilter, PaginatedResponse } from "@/types"

// API functions
async function fetchLogs(params: {
  cursor?: string
  limit?: number
  filter?: LogFilter
}): Promise<PaginatedResponse<Log>> {
  const searchParams = new URLSearchParams()
  if (params.cursor) searchParams.set("cursor", params.cursor)
  if (params.limit) searchParams.set("limit", params.limit.toString())
  if (params.filter?.tags?.length) {
    searchParams.set("tags", params.filter.tags.join(","))
  }
  if (params.filter?.sortBy) searchParams.set("sortBy", params.filter.sortBy)
  if (params.filter?.sortOrder) searchParams.set("sortOrder", params.filter.sortOrder)

  const response = await fetch(`/api/logs?${searchParams.toString()}`)
  if (!response.ok) throw new Error("Failed to fetch logs")
  return response.json()
}

async function fetchLog(id: string): Promise<Log> {
  const response = await fetch(`/api/logs/${id}`)
  if (!response.ok) throw new Error("Failed to fetch log")
  return response.json()
}

async function createLog(data: CreateLogInput): Promise<Log> {
  const response = await fetch("/api/logs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Failed to create log")
  return response.json()
}

async function updateLog(id: string, data: UpdateLogInput): Promise<Log> {
  const response = await fetch(`/api/logs/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Failed to update log")
  return response.json()
}

async function deleteLog(id: string): Promise<void> {
  const response = await fetch(`/api/logs/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) throw new Error("Failed to delete log")
}

// Hooks
export function useMyLogs(filter?: LogFilter) {
  return useInfiniteQuery({
    queryKey: ["logs", "my", filter],
    queryFn: ({ pageParam }) =>
      fetchLogs({ cursor: pageParam, limit: 10, filter }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
  })
}

export function useLogDetail(id: string) {
  return useQuery({
    queryKey: ["logs", id],
    queryFn: () => fetchLog(id),
    enabled: !!id,
  })
}

export function useCreateLog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["logs"] })
      queryClient.invalidateQueries({ queryKey: ["stats", "my"] })
    },
  })
}

export function useUpdateLog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLogInput }) =>
      updateLog(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["logs"] })
      queryClient.invalidateQueries({ queryKey: ["logs", id] })
    },
  })
}

export function useDeleteLog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["logs"] })
      queryClient.invalidateQueries({ queryKey: ["stats", "my"] })
    },
  })
}
