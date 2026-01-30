import { MyStatsSection } from "@/components/dashboard/MyStatsSection"
import { CommunitySection } from "@/components/dashboard/CommunitySection"

export default function DashboardPage() {
  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">대시보드</h1>

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        {/* 내 통계 섹션 (70%) */}
        <div className="lg:col-span-7">
          <MyStatsSection />
        </div>

        {/* 커뮤니티 섹션 (30%) */}
        <div className="lg:col-span-3">
          <CommunitySection />
        </div>
      </div>
    </main>
  )
}
