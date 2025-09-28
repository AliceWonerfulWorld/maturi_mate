'use client';

import { useState, useMemo, memo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Calendar, Clock, Users, Star, MessageCircle, ArrowLeft, Send, Home, Search, Filter, ArrowUpDown } from 'lucide-react';
import { dummyFestivals, dummyFestivalReviews, dummyTasks } from '@/lib/dummy-data';
import { Festival, FestivalReview, Task } from '@/types';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function FestivalDetailPage() {
  const params = useParams();
  const festivalId = params.festivalId as string;
  
  const [reviewForm, setReviewForm] = useState({
    authorName: '',
    comment: '',
    rating: 5
  });

  const [reviewSearchTerm, setReviewSearchTerm] = useState('');
  const [reviewSortBy, setReviewSortBy] = useState<'newest' | 'oldest' | 'rating'>('newest');
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);

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

  // 祭りのレビューを取得（フィルタ・検索・並び替え適用）
  const filteredReviews = useMemo(() => {
    let filtered = dummyFestivalReviews.filter(review => review.festivalId === festivalId);
    
    // 検索フィルタ
    if (reviewSearchTerm) {
      filtered = filtered.filter(review => 
        review.authorName.toLowerCase().includes(reviewSearchTerm.toLowerCase()) ||
        review.comment.toLowerCase().includes(reviewSearchTerm.toLowerCase())
      );
    }
    
    // 星評価フィルタ
    if (ratingFilter !== null) {
      filtered = filtered.filter(review => review.rating === ratingFilter);
    }
    
    // 並び替え
    switch (reviewSortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
    }
    
    return filtered;
  }, [festivalId, reviewSearchTerm, reviewSortBy, ratingFilter]);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // ダミーデータとして新しいレビューを追加
    const newReview: FestivalReview = {
      id: `review${Date.now()}`,
      festivalId,
      authorName: reviewForm.authorName,
      comment: reviewForm.comment,
      rating: reviewForm.rating,
      createdAt: new Date().toISOString().split('T')[0]
    };

    console.log('新しいレビューを投稿:', newReview);
    
    // フォームをリセット
    setReviewForm({
      authorName: '',
      comment: '',
      rating: 5
    });
    
    alert('レビューを投稿しました！');
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
            <h1 className="text-lg font-bold bg-gradient-to-r from-slate-700 to-gray-800 bg-clip-text text-transparent mb-1">
              {festival.name}
            </h1>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-md mx-auto px-4 py-6 space-y-6 pb-24">
        {/* 祭り基本情報 */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-800">{festival.name}</CardTitle>
            <CardDescription className="text-gray-600">{festival.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center text-sm text-gray-600 bg-slate-50/50 rounded-lg p-2">
                <Calendar className="h-4 w-4 mr-2 text-slate-500" />
                <span>{festival.date}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 bg-gray-50/50 rounded-lg p-2">
                <Clock className="h-4 w-4 mr-2 text-gray-500" />
                <span>{festival.time}</span>
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-600 bg-slate-50/50 rounded-lg p-3">
              <MapPin className="h-5 w-5 mr-2 text-slate-500" />
              <span className="font-medium">{festival.location}</span>
            </div>
          </CardContent>
        </Card>

        {/* 関連タスク */}
        {relatedTasks.length > 0 && (
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-gray-800 flex items-center">
                <Users className="h-5 w-5 mr-2 text-slate-600" />
                関連タスク
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {relatedTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </CardContent>
          </Card>
        )}

        {/* 口コミ一覧 */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-800 flex items-center">
              <MessageCircle className="h-5 w-5 mr-2 text-slate-600" />
              口コミ ({filteredReviews.length})
            </CardTitle>
            
            {/* 検索・フィルタ・並び替え */}
            <div className="space-y-3 mt-4">
              {/* 検索バー */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="口コミを検索..."
                  value={reviewSearchTerm}
                  onChange={(e) => setReviewSearchTerm(e.target.value)}
                  className="pl-10 bg-white/80 border-gray-200 focus:border-slate-500 focus:ring-slate-500"
                />
              </div>
              
              {/* フィルタ・並び替え */}
              <div className="flex gap-2 overflow-x-auto">
                {/* 星評価フィルタ */}
                <div className="flex gap-1">
                  <Button
                    variant={ratingFilter === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setRatingFilter(null)}
                    className={`text-xs px-2 py-1 ${
                      ratingFilter === null 
                        ? "bg-slate-500 text-white" 
                        : "bg-white/80 border-gray-200 text-gray-600"
                    }`}
                  >
                    すべて
                  </Button>
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <Button
                      key={rating}
                      variant={ratingFilter === rating ? "default" : "outline"}
                      size="sm"
                      onClick={() => setRatingFilter(ratingFilter === rating ? null : rating)}
                      className={`text-xs px-2 py-1 ${
                        ratingFilter === rating 
                          ? "bg-slate-500 text-white" 
                          : "bg-white/80 border-gray-200 text-gray-600"
                      }`}
                    >
                      {rating}★
                    </Button>
                  ))}
                </div>
                
                {/* 並び替え */}
                <div className="flex gap-1 ml-2">
                  <Button
                    variant={reviewSortBy === 'newest' ? "default" : "outline"}
                    size="sm"
                    onClick={() => setReviewSortBy('newest')}
                    className={`text-xs px-2 py-1 ${
                      reviewSortBy === 'newest' 
                        ? "bg-slate-500 text-white" 
                        : "bg-white/80 border-gray-200 text-gray-600"
                    }`}
                  >
                    最新
                  </Button>
                  <Button
                    variant={reviewSortBy === 'rating' ? "default" : "outline"}
                    size="sm"
                    onClick={() => setReviewSortBy('rating')}
                    className={`text-xs px-2 py-1 ${
                      reviewSortBy === 'rating' 
                        ? "bg-slate-500 text-white" 
                        : "bg-white/80 border-gray-200 text-gray-600"
                    }`}
                  >
                    高評価
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredReviews.length > 0 ? (
              filteredReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-sm">
                  {reviewSearchTerm || ratingFilter !== null 
                    ? "条件に合う口コミが見つかりません" 
                    : "まだ口コミがありません"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 口コミ投稿フォーム */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-800">口コミを投稿</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">投稿者名</label>
                <Input
                  type="text"
                  placeholder="お名前を入力"
                  value={reviewForm.authorName}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, authorName: e.target.value }))}
                  className="bg-white/80 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">評価</label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                      className={`transition-colors ${
                        star <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      <Star className="h-6 w-6 fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">コメント</label>
                <Textarea
                  placeholder="祭りの感想を入力してください..."
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                  className="bg-white/80 border-gray-200 focus:border-slate-500 focus:ring-slate-500 min-h-[80px] resize-none"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-slate-600 to-gray-700 hover:from-slate-700 hover:to-gray-800 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Send className="h-4 w-4 mr-2" />
                口コミを投稿
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* ナビゲーション */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-white/20 shadow-lg">
          <div className="max-w-md mx-auto flex justify-around py-3">
            <Link href="/participant" className="flex flex-col items-center py-2 px-3 rounded-full text-gray-500 hover:bg-gray-100/50 transition-all duration-300" prefetch={false}>
              <Calendar className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">タスク</span>
            </Link>
            <Link href="/participant/festivals" className="flex flex-col items-center py-2 px-3 rounded-full bg-gradient-to-r from-slate-600 to-gray-700 text-white shadow-lg" prefetch={false}>
              <Home className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">祭り</span>
            </Link>
            <Link href="/participant/profile" className="flex flex-col items-center py-2 px-3 rounded-full text-gray-500 hover:bg-gray-100/50 transition-all duration-300" prefetch={false}>
              <Users className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">プロフィール</span>
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}

const TaskCard = memo(function TaskCard({ task }: { task: Task }) {
  return (
    <Link href={`/participant/task/${task.id}`} prefetch={false}>
      <Card className="group hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm border border-blue-100 cursor-pointer">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
              {task.title}
            </h4>
            <Badge 
              variant={task.status === 'open' ? 'default' : 'secondary'}
              className={`${
                task.status === 'open' 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md' 
                  : 'bg-gray-200 text-gray-600'
              } rounded-full px-2 py-1 text-xs font-medium`}
            >
              {task.status === 'open' ? '募集中' : '終了'}
            </Badge>
          </div>
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{task.description}</p>
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="h-3 w-3 mr-1" />
            <span className="mr-3">{task.date}</span>
            <Clock className="h-3 w-3 mr-1" />
            <span>{task.time}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
});

const ReviewCard = memo(function ReviewCard({ review }: { review: FestivalReview }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-purple-100">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-gray-800">{review.authorName}</h4>
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-4 w-4 ${
                star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
      <p className="text-gray-600 text-sm mb-2">{review.comment}</p>
      <p className="text-xs text-gray-400">{review.createdAt}</p>
    </div>
  );
});
