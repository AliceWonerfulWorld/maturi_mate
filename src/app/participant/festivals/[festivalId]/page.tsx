'use client';

import { useState, useMemo, memo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Clock, Users, Star, MessageCircle, ArrowLeft, Home } from 'lucide-react';
import { dummyFestivals, dummyFestivalReviews, dummyTasks } from '@/lib/dummy-data';
import { Festival, FestivalReview, Task } from '@/types';
import { ReviewSection } from '@/components/ReviewSection';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function FestivalDetailPage() {
  const params = useParams();
  const festivalId = params.festivalId as string;

  // 祭り情報を取得
  const festival = useMemo(() => {
    return dummyFestivals.find(f => f.id === festivalId);
  }, [festivalId]);

  // 祭りに関連するタスクを取得
  const relatedTasks = useMemo(() => {
    return dummyTasks.filter(task => {
      // 簡単な関連付け（実際のアプリではより複雑なロジック）
      return task.location === festival?.location || 
             task.title.toLowerCase().includes(festival?.name.toLowerCase().split(' ')[0] || '');
    });
  }, [festival]);

  // 祭りのレビューを取得
  const festivalReviews = useMemo(() => {
    return dummyFestivalReviews.filter(review => review.festivalId === festivalId);
  }, [festivalId]);

  // 口コミ投稿ハンドラー（共通コンポーネント用）
  const handleReviewSubmit = (reviewData: Omit<FestivalReview, 'id' | 'createdAt'>) => {
    const newReview: FestivalReview = {
      ...reviewData,
      id: `review${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };

    console.log('新しいレビューを投稿:', newReview);
    // 実際のアプリではここでAPIを呼び出してレビューを保存
  };

  if (!festival) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-50 flex items-center justify-center">
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">祭りが見つかりません</p>
            <Link href="/participant" className="text-amber-600 hover:text-amber-700 mt-2 inline-block">
              ホームに戻る
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-stone-100">
      {/* 背景装飾 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-slate-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gray-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-1000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-slate-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
      </div>

      {/* ヘッダー */}
      <header className="relative z-10 bg-white/80 backdrop-blur-sm shadow-lg border-b border-white/20">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <Link href="/participant/festivals" prefetch={false}>
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-slate-600 hover:bg-slate-100/50 rounded-full p-2 opacity-80 hover:opacity-100 transition-all duration-200">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex-1"></div>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-slate-600 to-gray-700 rounded-full mb-2 shadow-lg">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 mb-1">{festival.name}</h1>
            <p className="text-sm text-gray-600">{festival.location}</p>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-md mx-auto px-4 py-6 pb-32">
        {/* 祭り詳細情報 */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl mb-6">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-800 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-slate-600" />
              祭り詳細
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-slate-500 to-gray-600 rounded-full flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">開催日時</p>
                  <p className="text-sm text-gray-600">{festival.date} {festival.time}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-slate-500 to-gray-600 rounded-full flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">開催場所</p>
                  <p className="text-sm text-gray-600">{festival.location}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">詳細</p>
              <p className="text-sm text-gray-600 leading-relaxed">{festival.description}</p>
            </div>
          </CardContent>
        </Card>

        {/* 関連タスク */}
        {relatedTasks.length > 0 && (
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl mb-6">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-gray-800 flex items-center">
                <Users className="h-5 w-5 mr-2 text-slate-600" />
                関連タスク ({relatedTasks.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {relatedTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </CardContent>
          </Card>
        )}

        {/* 口コミ・レビューセクション（共通コンポーネント） */}
        <ReviewSection
          reviews={festivalReviews}
          onSubmitReview={handleReviewSubmit}
          showReviewForm={true}
          title="口コミ・レビュー"
          emptyMessage="まだ口コミがありません"
        />

        {/* ナビゲーション */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-white/20 shadow-lg z-50">
          <div className="max-w-md mx-auto flex justify-around py-3">
            <Link href="/participant" className="flex flex-col items-center py-2 px-3 rounded-full text-gray-500 hover:bg-gray-100/50 transition-all duration-300" prefetch={false}>
              <Users className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">タスク</span>
            </Link>
            <Link href="/participant/festivals" className="flex flex-col items-center py-2 px-3 rounded-full bg-gradient-to-r from-slate-600 to-gray-700 text-white shadow-lg" prefetch={false}>
              <Calendar className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">祭り</span>
            </Link>
            <Link href="/participant/profile" className="flex flex-col items-center py-2 px-3 rounded-full text-gray-500 hover:bg-gray-100/50 transition-all duration-300" prefetch={false}>
              <MessageCircle className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">プロフィール</span>
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}

// タスクカードコンポーネント
const TaskCard = memo(function TaskCard({ task }: { task: Task }) {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-slate-800 text-sm mb-1">{task.title}</h3>
            <p className="text-xs text-gray-600 line-clamp-2">{task.description}</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center text-xs text-gray-600">
            <Calendar className="h-3 w-3 mr-1" />
            {task.date} {task.time}
          </div>
          <div className="flex items-center text-xs text-gray-600">
            <MapPin className="h-3 w-3 mr-1" />
            {task.location}
          </div>
          <div className="flex items-center text-xs text-gray-600">
            <Users className="h-3 w-3 mr-1" />
            {task.currentParticipants}/{task.capacity}人
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-3">
          <Badge variant="outline" className="text-xs bg-slate-50 text-slate-600 border-slate-200">
            {task.reward}
          </Badge>
          <Link href={`/participant/task/${task.id}`} prefetch={false}>
            <Button size="sm" className="bg-gradient-to-r from-slate-600 to-gray-700 hover:from-slate-700 hover:to-gray-800 text-white text-xs px-3 py-1 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
              詳細を見る
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
});