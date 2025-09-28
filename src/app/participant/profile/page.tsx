'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Calendar, Award, Star, MessageCircle, ArrowLeft, Home, ThumbsUp, Users } from 'lucide-react';
import { dummyUser, dummyFestivalReviews, dummyFestivals } from '@/lib/dummy-data';
import Link from 'next/link';
import { useMemo } from 'react';

export default function ParticipantProfilePage() {
  const user = dummyUser;

  // ユーザーの口コミ履歴を取得
  const userReviews = useMemo(() => {
    return dummyFestivalReviews.filter(review => review.authorName === user.name);
  }, [user.name]);

  // 口コミの統計情報
  const reviewStats = useMemo(() => {
    if (userReviews.length === 0) return { totalReviews: 0, averageRating: 0, totalFestivals: 0 };
    
    const totalReviews = userReviews.length;
    const averageRating = userReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
    const uniqueFestivals = new Set(userReviews.map(review => review.festivalId)).size;
    
    return {
      totalReviews,
      averageRating: Math.round(averageRating * 10) / 10,
      totalFestivals: uniqueFestivals
    };
  }, [userReviews]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-50">
      {/* 背景装飾 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-slate-300 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gray-300 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse delay-1000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-stone-300 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse delay-500"></div>
      </div>

      {/* ヘッダー */}
      <header className="relative z-10 bg-white/80 backdrop-blur-sm shadow-lg border-b border-white/20">
        <div className="max-w-md mx-auto px-3 py-3">
          <div className="flex items-center justify-between mb-1">
            <Link href="/participant" prefetch={false}>
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-slate-600 hover:bg-slate-100/50 rounded-full p-2 opacity-80 hover:opacity-100 transition-all duration-200">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex-1"></div>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-slate-600 to-gray-700 rounded-full mb-1 shadow-lg">
              <User className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-slate-700 to-gray-800 bg-clip-text text-transparent mb-1">
              プロフィール
            </h1>
            <p className="text-xs text-gray-600 bg-white/50 backdrop-blur-sm px-2 py-0.5 rounded-full inline-block">
              参加者モード
            </p>
          </div>
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
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <Calendar className="h-5 w-5 mx-auto text-slate-600 mb-2" />
              <div className="text-xl font-bold text-gray-800">12</div>
              <div className="text-xs text-gray-600">参加回数</div>
            </CardContent>
          </Card>
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <MessageCircle className="h-5 w-5 mx-auto text-purple-600 mb-2" />
              <div className="text-xl font-bold text-gray-800">{reviewStats.totalReviews}</div>
              <div className="text-xs text-gray-600">口コミ投稿</div>
            </CardContent>
          </Card>
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <Star className="h-5 w-5 mx-auto text-yellow-500 mb-2" />
              <div className="text-xl font-bold text-gray-800">{reviewStats.averageRating}</div>
              <div className="text-xs text-gray-600">平均評価</div>
            </CardContent>
          </Card>
        </div>

        {/* 口コミ履歴 */}
        {userReviews.length > 0 && (
          <Card className="mb-6 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center text-lg font-bold text-gray-800">
                <MessageCircle className="h-5 w-5 mr-2 text-purple-600" />
                投稿した口コミ ({userReviews.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {userReviews.map((review) => {
                const festival = dummyFestivals.find(f => f.id === review.festivalId);
                return (
                  <div key={review.id} className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-gray-100">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-800 text-sm">
                          {festival?.name || '祭り'}
                        </h4>
                        <p className="text-xs text-gray-500">{review.createdAt}</p>
                      </div>
                      <div className="flex items-center">
                        {Array.from({ length: review.rating }, (_, i) => (
                          <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />
                        ))}
                        {Array.from({ length: 5 - review.rating }, (_, i) => (
                          <Star key={i} className="h-3 w-3 text-gray-300" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">{review.comment}</p>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* 運営者からの評価 */}
        <Card className="mb-6 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center text-lg font-bold text-gray-800">
              <ThumbsUp className="h-5 w-5 mr-2 text-green-600" />
              運営者からの評価
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-gray-100">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm">中央区まつり実行委員会</h4>
                    <p className="text-xs text-gray-500">2024-08-15</p>
                  </div>
                  <Badge className="bg-green-500 text-white text-xs">優秀</Badge>
                </div>
                <p className="text-sm text-gray-700">
                  「とても積極的で、他の参加者とも協力して作業を進めてくれました。また機会があれば一緒に活動したいです。」
                </p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-gray-100">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm">花火大会実行委員会</h4>
                    <p className="text-xs text-gray-500">2024-08-20</p>
                  </div>
                  <Badge className="bg-blue-500 text-white text-xs">良好</Badge>
                </div>
                <p className="text-sm text-gray-700">
                  「時間通りに集合し、最後まで責任を持って作業を完了してくれました。」
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 最近の活動 */}
        <Card className="mb-24 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center text-lg font-bold text-gray-800">
              <Award className="h-5 w-5 mr-2 text-amber-600" />
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

        {/* ナビゲーション */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-white/20 shadow-lg">
          <div className="max-w-md mx-auto flex justify-around py-3">
            <Link href="/participant" className="flex flex-col items-center py-2 px-3 rounded-full text-gray-500 hover:bg-gray-100/50 transition-all duration-300" prefetch={false}>
              <Calendar className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">タスク</span>
            </Link>
            <Link href="/participant/festivals" className="flex flex-col items-center py-2 px-3 rounded-full text-gray-500 hover:bg-gray-100/50 transition-all duration-300" prefetch={false}>
              <Users className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">祭り</span>
            </Link>
            <Link href="/participant/profile" className="flex flex-col items-center py-2 px-3 rounded-full bg-gradient-to-r from-slate-600 to-gray-700 text-white shadow-lg" prefetch={false}>
              <User className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">プロフィール</span>
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}
