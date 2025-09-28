'use client';

import { useState, useMemo, memo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Calendar, Clock, Star, ArrowLeft, Home, Users } from 'lucide-react';
import { dummyFestivals, dummyFestivalReviews } from '@/lib/dummy-data';
import { Festival } from '@/types';
import Link from 'next/link';

export default function ParticipantFestivalsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFestivals = useMemo(() => {
    return dummyFestivals.filter(festival => {
      const matchesSearch = festival.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           festival.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           festival.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [searchTerm]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  // 祭りの平均評価を計算
  const getFestivalRating = (festivalId: string): string => {
    const reviews = dummyFestivalReviews.filter(review => review.festivalId === festivalId);
    if (reviews.length === 0) return "0.0";
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  // 祭りのレビュー数を取得
  const getReviewCount = (festivalId: string) => {
    return dummyFestivalReviews.filter(review => review.festivalId === festivalId).length;
  };

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
            <Link href="/" prefetch={false}>
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-slate-600 hover:bg-slate-100/50 rounded-full p-2 opacity-80 hover:opacity-100 transition-all duration-200">
                <Home className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex-1"></div>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-slate-600 to-gray-700 rounded-full mb-1 shadow-lg">
              <Calendar className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-slate-700 to-gray-800 bg-clip-text text-transparent mb-1">
              祭り一覧
            </h1>
            <p className="text-xs text-gray-600 bg-white/50 backdrop-blur-sm px-2 py-0.5 rounded-full inline-block">
              参加者モード
            </p>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-md mx-auto px-4 py-6">
        {/* 検索バー */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
                      placeholder="祭りを検索..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border border-white/30 rounded-2xl focus:ring-2 focus:ring-slate-500 focus:border-transparent shadow-lg text-base placeholder-gray-500"
            />
          </div>
        </div>

        {/* 祭り一覧 */}
        <div className="space-y-6 pb-24">
          {filteredFestivals.map((festival) => (
            <FestivalCard 
              key={festival.id} 
              festival={festival} 
              rating={getFestivalRating(festival.id)}
              reviewCount={getReviewCount(festival.id)}
            />
          ))}
        </div>

        {/* ナビゲーション */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-white/20 shadow-lg">
          <div className="max-w-md mx-auto flex justify-around py-3">
            <Link href="/participant" className="flex flex-col items-center py-2 px-3 rounded-full text-gray-500 hover:bg-gray-100/50 transition-all duration-300" prefetch={false}>
              <Calendar className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">タスク</span>
            </Link>
            <Link href="/participant/festivals" className="flex flex-col items-center py-2 px-3 rounded-full bg-gradient-to-r from-slate-600 to-gray-700 text-white shadow-lg" prefetch={false}>
              <Users className="h-5 w-5 mb-1" />
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

const FestivalCard = memo(function FestivalCard({ 
  festival, 
  rating, 
  reviewCount 
}: { 
  festival: Festival;
  rating: string;
  reviewCount: number;
}) {
  return (
    <Link href={`/participant/festivals/${festival.id}`} prefetch={false}>
      <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white/90 backdrop-blur-sm border-0 shadow-xl overflow-hidden will-change-transform gpu-accelerated contain-layout">
        {/* ヘッダー部分 */}
        <CardHeader className="pb-3 relative">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-slate-500/10 to-gray-500/10 rounded-full transform translate-x-8 -translate-y-8"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-2">
              <CardTitle className="text-lg font-bold text-gray-800 group-hover:text-slate-600 transition-colors pr-2">
                {festival.name}
              </CardTitle>
              <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md rounded-full px-3 py-1 text-xs font-medium">
                開催予定
              </Badge>
            </div>
            <CardDescription className="text-gray-600 line-clamp-2 leading-relaxed mb-3">
              {festival.description}
            </CardDescription>
            
            {/* 評価とレビュー数 */}
            {reviewCount > 0 && (
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <div className="flex items-center mr-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-3 w-3 ${
                        star <= Math.floor(parseFloat(rating)) 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-1 text-xs font-medium">{rating}</span>
                </div>
                <span className="text-xs text-gray-500">({reviewCount}件のレビュー)</span>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="pt-0 relative z-10">
          {/* 祭り詳細 */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center text-sm text-gray-600 bg-slate-50/50 rounded-lg p-2">
              <Calendar className="h-4 w-4 mr-2 text-slate-500" />
              <span>{festival.date}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600 bg-gray-50/50 rounded-lg p-2">
              <Clock className="h-4 w-4 mr-2 text-gray-500" />
              <span>{festival.time}</span>
            </div>
          </div>

          {/* 開催場所 */}
          <div className="flex items-center text-sm text-gray-600 bg-slate-50/50 rounded-lg p-3">
            <MapPin className="h-5 w-5 mr-2 text-slate-500" />
            <span className="font-medium">{festival.location}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
});
