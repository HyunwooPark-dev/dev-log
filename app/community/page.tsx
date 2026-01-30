import { RankingList } from "@/components/community/RankingList"
import { TrendTags } from "@/components/community/TrendTags"
import { PublicLogFeed } from "@/components/community/PublicLogFeed"

export default function CommunityPage() {
  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">커뮤니티</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 사이드바 - 랭킹 & 트렌드 */}
        <div className="lg:col-span-1 space-y-6">
          <RankingList />
          <TrendTags />
        </div>

        {/* 메인 - 공개 로그 피드 */}
        <div className="lg:col-span-3">
          <PublicLogFeed />
        </div>
      </div>
    </main>
  )
}
