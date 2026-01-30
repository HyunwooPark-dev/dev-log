import { SearchResults } from "@/components/search/SearchResults"

export default function SearchPage() {
  return (
    <main className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">AI 검색</h1>

        <p className="text-muted-foreground mb-6">
          자연어로 학습 로그를 검색해보세요. AI가 의미적으로 유사한 로그를 찾아드립니다.
        </p>

        <SearchResults />
      </div>
    </main>
  )
}
