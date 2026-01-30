import { LogForm } from "@/components/logs/LogForm"
import { LogList } from "@/components/logs/LogList"

export default function Home() {
  return (
    <main className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <section>
          <h1 className="text-3xl font-bold mb-4">오늘의 학습 로그</h1>
          <p className="text-muted-foreground mb-6">
            오늘 배운 것을 짧게 기록해보세요.
          </p>
          <LogForm />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">최근 로그</h2>
          <LogList />
        </section>
      </div>
    </main>
  )
}
