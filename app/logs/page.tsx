import { LogList } from "@/components/logs/LogList"

export default function LogsPage() {
  return (
    <main className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">내 학습 로그</h1>

        {/* TODO: 필터 컴포넌트 추가 */}
        <div className="mb-6">
          {/* FilterBar component will go here */}
        </div>

        <LogList showPagination />
      </div>
    </main>
  )
}
