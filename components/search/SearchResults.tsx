"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { LogCard } from "@/components/logs/LogCard"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Sparkles } from "lucide-react"
import type { Log } from "@/types"

export function SearchResults() {
  const [query, setQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [results, setResults] = useState<Log[]>([])
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsSearching(true)
    setHasSearched(true)

    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/ai/search?q=${encodeURIComponent(query)}`)
      // const data = await response.json()
      // setResults(data.logs)

      // Simulate search delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setResults([])
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="예: React 상태 관리에 대해 배운 것들"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit" disabled={isSearching || !query.trim()}>
          <Sparkles className="h-4 w-4 mr-2" />
          AI 검색
        </Button>
      </form>

      {isSearching && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Sparkles className="h-4 w-4 animate-pulse" />
            AI가 관련 로그를 찾고 있습니다...
          </p>
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          ))}
        </div>
      )}

      {!isSearching && hasSearched && results.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            "{query}"에 대한 검색 결과가 없습니다.
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            다른 키워드로 검색해보세요.
          </p>
        </div>
      )}

      {!isSearching && results.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {results.length}개의 관련 로그를 찾았습니다.
          </p>
          {results.map((log) => (
            <LogCard key={log.id} log={log} />
          ))}
        </div>
      )}
    </div>
  )
}
