import { LogCard } from "@/components/logs/LogCard"

interface LogDetailPageProps {
  params: {
    id: string
  }
}

export default function LogDetailPage({ params }: LogDetailPageProps) {
  const { id } = params

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* TODO: Fetch log data and display */}
        <LogCard
          log={{
            id,
            content: "로그 내용을 불러오는 중...",
            date: new Date(),
            isPublic: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            userId: "",
            tags: [],
          }}
          showFullContent
        />
      </div>
    </main>
  )
}
