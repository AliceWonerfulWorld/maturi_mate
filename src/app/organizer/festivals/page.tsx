'use client';

import { useState, useMemo, memo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Calendar, Clock, Eye, Plus, ArrowLeft } from 'lucide-react';
import { dummyFestivals } from '@/lib/dummy-data';
import { Festival } from '@/types';
import Link from 'next/link';

export default function FestivalsListPage() {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-50">
      {/* 背景装飾 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-300 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse delay-1000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-amber-300 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse delay-500"></div>
      </div>

      {/* ヘッダー */}
      <header className="relative z-10 bg-white/80 backdrop-blur-sm shadow-lg border-b border-white/20">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <Link href="/organizer" prefetch={false}>
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-amber-600 hover:bg-amber-100/50 rounded-full p-2 opacity-80 hover:opacity-100 transition-all duration-200">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex-1"></div>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full mb-2 shadow-lg">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-amber-700 to-orange-700 bg-clip-text text-transparent mb-1">
              祭り管理
            </h1>
            <p className="text-xs text-gray-600 bg-white/50 backdrop-blur-sm px-3 py-1 rounded-full inline-block">
              運営者モード
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
              className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border border-white/30 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-transparent shadow-lg text-base placeholder-gray-500"
            />
          </div>
        </div>

        {/* 新規登録ボタン */}
        <div className="mb-6">
          <Link href="/organizer/festivals/register" prefetch={false}>
            <Button className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <Plus className="h-4 w-4 mr-2" />
              新しい祭りを登録
            </Button>
          </Link>
        </div>

        {/* 祭り一覧 */}
        <div className="space-y-6 pb-24">
          {filteredFestivals.map((festival) => (
            <FestivalCard key={festival.id} festival={festival} />
          ))}
        </div>
      </div>
    </div>
  );
}

const FestivalCard = memo(function FestivalCard({ festival }: { festival: Festival }) {
  return (
    <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white/90 backdrop-blur-sm border-0 shadow-xl overflow-hidden will-change-transform gpu-accelerated contain-layout">
      {/* ヘッダー部分 */}
      <CardHeader className="pb-3 relative">
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-full transform translate-x-8 -translate-y-8"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-2">
            <CardTitle className="text-lg font-bold text-gray-800 group-hover:text-amber-600 transition-colors pr-2">
              {festival.name}
            </CardTitle>
            <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md rounded-full px-3 py-1 text-xs font-medium">
              開催予定
            </Badge>
          </div>
          <CardDescription className="text-gray-600 line-clamp-2 leading-relaxed">
            {festival.description}
          </CardDescription>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 relative z-10">
        {/* 祭り詳細 */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center text-sm text-gray-600 bg-amber-50/50 rounded-lg p-2">
            <Calendar className="h-4 w-4 mr-2 text-amber-500" />
            <span>{festival.date}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 bg-orange-50/50 rounded-lg p-2">
            <Clock className="h-4 w-4 mr-2 text-orange-500" />
            <span>{festival.time}</span>
          </div>
        </div>

        {/* 開催場所 */}
        <div className="flex items-center text-sm text-gray-600 bg-slate-50/50 rounded-lg p-3 mb-4">
          <MapPin className="h-5 w-5 mr-2 text-slate-500" />
          <span className="font-medium">{festival.location}</span>
        </div>

        {/* 詳細を見るボタン */}
        <div className="flex justify-end">
          <Link href={`/organizer/festivals/${festival.id}`} prefetch={false}>
            <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
              <Eye className="h-4 w-4 mr-2" />
              詳細を見る
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
});
