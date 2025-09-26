'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Calendar, Award, Star, MessageCircle } from 'lucide-react';
import { dummyUser } from '@/lib/dummy-data';
import Link from 'next/link';

export default function ProfilePage() {
  const user = dummyUser;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-lg font-semibold text-center">プロフィール</h1>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* ユーザー情報 */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-xl">{user.name}</CardTitle>
                <CardDescription>{user.age}歳</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">{user.profile}</p>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">レベル {user.level}</Badge>
              {user.badges.map(badge => (
                <Badge key={badge} variant="outline">{badge}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 統計情報 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <Calendar className="h-6 w-6 mx-auto text-blue-600 mb-2" />
              <div className="text-2xl font-bold">12</div>
              <div className="text-sm text-gray-600">参加回数</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Star className="h-6 w-6 mx-auto text-yellow-600 mb-2" />
              <div className="text-2xl font-bold">4.8</div>
              <div className="text-sm text-gray-600">平均評価</div>
            </CardContent>
          </Card>
        </div>

        {/* 最近の活動 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2" />
              最近の活動
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">夏祭り 屋台設営</p>
                  <p className="text-xs text-gray-500">2024-08-15</p>
                </div>
                <Badge variant="outline">完了</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">花火大会 会場整理</p>
                  <p className="text-xs text-gray-500">2024-08-20</p>
                </div>
                <Badge variant="outline">完了</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 口コミ投稿ボタン */}
        <Link href="/feedback">
          <Button className="w-full mb-6">
            <MessageCircle className="h-4 w-4 mr-2" />
            口コミを投稿する
          </Button>
        </Link>

        {/* ナビゲーション */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t">
          <div className="max-w-md mx-auto flex justify-around py-2">
            <Link href="/" className="flex flex-col items-center py-2 text-gray-400">
              <Calendar className="h-5 w-5" />
              <span className="text-xs mt-1">ホーム</span>
            </Link>
            <Link href="/profile" className="flex flex-col items-center py-2 text-blue-600">
              <User className="h-5 w-5" />
              <span className="text-xs mt-1">プロフィール</span>
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}
