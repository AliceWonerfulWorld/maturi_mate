'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, UserCheck, Calendar, Plus } from 'lucide-react';
import Link from 'next/link';

export default function RoleSelectorPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto px-4">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Matsuri Mate</h1>
          <p className="text-gray-600">まつりの準備運営における人手不足を解消するジョブマッチングアプリ</p>
        </div>

        {/* ロール選択 */}
        <div className="space-y-4">
          {/* 参加者（若者） */}
          <Link href="/participant">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">参加者（若者）</CardTitle>
                    <CardDescription>まつりのタスクに参加したい方</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    タスク一覧・検索
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    プロフィール管理
                  </div>
                  <div className="flex items-center">
                    <UserCheck className="h-4 w-4 mr-2" />
                    口コミ投稿
                  </div>
                </div>
                <Button className="w-full mt-4">
                  参加者としてログイン
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* 運営者 */}
          <Link href="/organizer">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <UserCheck className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">運営者</CardTitle>
                    <CardDescription>まつりのタスクを募集したい方</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Plus className="h-4 w-4 mr-2" />
                    タスク登録
                  </div>
                  <div className="flex items-center">
                    <UserCheck className="h-4 w-4 mr-2" />
                    タスク管理
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    応募者確認・承認
                  </div>
                </div>
                <Button className="w-full mt-4" variant="outline">
                  運営者としてログイン
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* フッター */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>どちらの立場でご利用になりますか？</p>
        </div>
      </div>
    </div>
  );
}