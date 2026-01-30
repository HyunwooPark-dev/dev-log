import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SettingsPage() {
  return (
    <main className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">설정</h1>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>프로필 설정</CardTitle>
              <CardDescription>
                프로필 정보를 수정합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* TODO: Profile settings form */}
              <p className="text-muted-foreground">프로필 설정 폼이 여기에 표시됩니다.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>주간 목표</CardTitle>
              <CardDescription>
                주간 학습 로그 목표를 설정합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* TODO: Weekly goal settings */}
              <p className="text-muted-foreground">주간 목표 설정이 여기에 표시됩니다.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>알림 설정</CardTitle>
              <CardDescription>
                알림 수신 여부를 설정합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* TODO: Notification settings */}
              <p className="text-muted-foreground">알림 설정이 여기에 표시됩니다.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
