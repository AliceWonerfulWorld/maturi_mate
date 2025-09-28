'use client';

import { useState, useMemo, memo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Star, Search, MessageCircle, ThumbsUp, User } from 'lucide-react';
import { FestivalReview } from '@/types';

interface ReviewSectionProps {
  reviews: FestivalReview[];
  onSubmitReview?: (review: Omit<FestivalReview, 'id' | 'createdAt'>) => void;
  showReviewForm?: boolean;
  title?: string;
  emptyMessage?: string;
}

export const ReviewSection = memo(function ReviewSection({
  reviews,
  onSubmitReview,
  showReviewForm = true,
  title = "口コミ・レビュー",
  emptyMessage = "まだ口コミがありません"
}: ReviewSectionProps) {
  const [reviewSearchTerm, setReviewSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [reviewSortBy, setReviewSortBy] = useState<'newest' | 'rating'>('newest');
  const [reviewForm, setReviewForm] = useState({
    authorName: '',
    comment: '',
    rating: 5
  });

  // 口コミのフィルタリング・並び替え
  const filteredReviews = useMemo(() => {
    let filtered = reviews.filter(review => {
      if (reviewSearchTerm) {
        return review.authorName.toLowerCase().includes(reviewSearchTerm.toLowerCase()) ||
               review.comment.toLowerCase().includes(reviewSearchTerm.toLowerCase());
      }
      return true;
    });
    
    // 星評価フィルタ
    if (ratingFilter !== null) {
      filtered = filtered.filter(review => review.rating === ratingFilter);
    }
    
    // 並び替え
    switch (reviewSortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
    }
    
    return filtered;
  }, [reviews, reviewSearchTerm, ratingFilter, reviewSortBy]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reviewForm.authorName.trim() || !reviewForm.comment.trim()) {
      alert('投稿者名とコメントを入力してください');
      return;
    }

    if (onSubmitReview) {
      onSubmitReview({
        festivalId: '', // 呼び出し元で設定
        userId: '', // 呼び出し元で設定
        authorName: reviewForm.authorName,
        comment: reviewForm.comment,
        rating: reviewForm.rating
      });
    }
    
    // フォームをリセット
    setReviewForm({
      authorName: '',
      comment: '',
      rating: 5
    });
    
    alert('レビューを投稿しました！');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageCircle className="h-5 w-5 text-red-500" />
        <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
          {reviews.length}件
        </Badge>
      </div>

      {/* 検索・フィルタ・並び替え */}
      <div className="space-y-3">
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
                  ? "bg-red-500 text-white" 
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
                    ? "bg-red-500 text-white" 
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
                  ? "bg-red-500 text-white" 
                  : "bg-white/80 border-gray-200 text-gray-600"
              }`}
            >
              最新順
            </Button>
            <Button
              variant={reviewSortBy === 'rating' ? "default" : "outline"}
              size="sm"
              onClick={() => setReviewSortBy('rating')}
              className={`text-xs px-2 py-1 ${
                reviewSortBy === 'rating' 
                  ? "bg-red-500 text-white" 
                  : "bg-white/80 border-gray-200 text-gray-600"
              }`}
            >
              高評価順
            </Button>
          </div>
        </div>
      </div>

      {/* 口コミ一覧 */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
            <CardContent className="p-6 text-center">
              <MessageCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">{emptyMessage}</p>
            </CardContent>
          </Card>
        ) : (
          filteredReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))
        )}
      </div>

      {/* 口コミ投稿フォーム */}
      {showReviewForm && onSubmitReview && (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-800">口コミを投稿</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    投稿者名
                  </label>
                  <Input
                    value={reviewForm.authorName}
                    onChange={(e) => setReviewForm({ ...reviewForm, authorName: e.target.value })}
                    placeholder="お名前を入力"
                    className="bg-white/80 border-gray-200 focus:border-slate-500 focus:ring-slate-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    評価
                  </label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setReviewForm({ ...reviewForm, rating })}
                        className={`transition-colors duration-200 ${
                          rating <= reviewForm.rating
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      >
                        <Star className="h-5 w-5 fill-current" />
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-gray-600">{reviewForm.rating}/5</span>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  コメント
                </label>
                <Textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  placeholder="祭りの感想をお聞かせください..."
                  rows={3}
                  className="bg-white/80 border-gray-200 focus:border-slate-500 focus:ring-slate-500"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                口コミを投稿
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
});

// 個別のレビューカードコンポーネント
const ReviewCard = memo(function ReviewCard({ review }: { review: FestivalReview }) {
  return (
    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-md">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-sm">{review.authorName}</p>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Star
                    key={rating}
                    className={`h-4 w-4 ${
                      rating <= review.rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-xs text-gray-500 ml-1">{review.rating}/5</span>
              </div>
            </div>
          </div>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {new Date(review.createdAt).toLocaleDateString('ja-JP')}
          </span>
        </div>
        <p className="text-gray-700 text-sm leading-relaxed mb-3">{review.comment}</p>
        
        {/* SNSっぽいアクション */}
        <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-500 hover:bg-red-50 p-1 h-auto">
            <ThumbsUp className="h-4 w-4 mr-1" />
            <span className="text-xs">いいね</span>
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-500 hover:bg-blue-50 p-1 h-auto">
            <MessageCircle className="h-4 w-4 mr-1" />
            <span className="text-xs">返信</span>
          </Button>
        </div>
        
        {/* 拡張フィールドの表示（将来の拡張用） */}
        {review.tags && review.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {review.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs bg-slate-50 text-slate-600 border-slate-200">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        {review.helpfulCount !== undefined && review.helpfulCount > 0 && (
          <div className="flex items-center gap-1 mt-3">
            <ThumbsUp className="h-3 w-3 text-gray-400" />
            <span className="text-xs text-gray-500">{review.helpfulCount}人が役に立った</span>
          </div>
        )}
        
        {review.reply && (
          <div className="mt-3 p-3 bg-slate-50 rounded-lg border-l-4 border-slate-300">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-slate-700">運営者からの返信</span>
              <span className="text-xs text-gray-500">
                {new Date(review.reply.repliedAt).toLocaleDateString('ja-JP')}
              </span>
            </div>
            <p className="text-sm text-gray-700">{review.reply.content}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
});
