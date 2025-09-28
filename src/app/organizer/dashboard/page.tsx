'use client';

import { useState, useMemo, memo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, UserCheck, TrendingUp, ArrowRight, Plus, Eye } from 'lucide-react';
import { dummyFestivals, dummyOrganizerTasks, dummyApplicants } from '@/lib/dummy-data';
import { Festival, OrganizerTask } from '@/types';
import Link from 'next/link';

export default function OrganizerDashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('week');

  // ダッシュボード用の統計データ
  const stats = useMemo(() => {
    const totalFestivals = dummyFestivals.length;
    const totalTasks = dummyOrganizerTasks.length;
    const totalApplicants = dummyApplicants.length;
    const pendingApplications = dummyApplicants.filter(app => app.status === 'pending').length;
    
    return {
      totalFestivals,
      totalTasks,
      totalApplicants,
      pendingApplications
    };
  }, []);

  // 最近の祭り（最大3件）
  const recentFestivals = useMemo(() => {
    return dummyFestivals.slice(0, 3);
  }, []);

  // 最近の応募（最大5件）
  const recentApplications = useMemo(() => {
    return dummyApplicants.filter(app => app.status === 'pending').slice(0, 5);
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
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full mb-2 shadow-lg">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-amber-700 to-orange-700 bg-clip-text text-transparent mb-1">
              ダッシュボード
            </h1>
            <p className="text-xs text-gray-600 bg-white/50 backdrop-blur-sm px-3 py-1 rounded-full inline-block">
              運営者モード
            </p>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-md mx-auto px-4 py-6 space-y-6 pb-24">
        {/* 統計カード */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Calendar className="h-4 w-4 text-amber-600" />
              </div>
              <div className="text-2xl font-bold text-gray-800">{stats.totalFestivals}</div>
              <div className="text-xs text-gray-600">登録祭り</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-800">{stats.totalTasks}</div>
              <div className="text-xs text-gray-600">登録タスク</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <UserCheck className="h-4 w-4 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-800">{stats.totalApplicants}</div>
              <div className="text-xs text-gray-600">総応募者</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Eye className="h-4 w-4 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-gray-800">{stats.pendingApplications}</div>
              <div className="text-xs text-gray-600">未承認</div>
            </CardContent>
          </Card>
        </div>

        {/* クイックアクション */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-800">クイックアクション</CardTitle>
            <CardDescription className="text-gray-600">よく使用する機能へのショートカット</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/organizer/festivals/register" prefetch={false}>
              <Button className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <Plus className="h-4 w-4 mr-2" />
                新しい祭りを登録
              </Button>
            </Link>
            
            <div className="grid grid-cols-2 gap-3">
              <Link href="/organizer/festivals" prefetch={false}>
                <Button variant="outline" className="w-full bg-white/80 backdrop-blur-sm border-amber-200 text-amber-700 hover:bg-amber-50">
                  <Calendar className="h-4 w-4 mr-2" />
                  祭り一覧
                </Button>
              </Link>
              
              <Link href="/organizer/tasks" prefetch={false}>
                <Button variant="outline" className="w-full bg-white/80 backdrop-blur-sm border-blue-200 text-blue-700 hover:bg-blue-50">
                  <Users className="h-4 w-4 mr-2" />
                  タスク管理
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* 最近の祭り */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-bold text-gray-800">最近の祭り</CardTitle>
              <Link href="/organizer/festivals" prefetch={false}>
                <Button variant="ghost" size="sm" className="text-amber-600 hover:text-amber-700">
                  すべて見る
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentFestivals.map((festival) => (
              <FestivalSummaryCard key={festival.id} festival={festival} />
            ))}
          </CardContent>
        </Card>

        {/* 最近の応募 */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-bold text-gray-800">承認待ちの応募</CardTitle>
              <Link href="/organizer/applications" prefetch={false}>
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                  すべて見る
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentApplications.map((applicant) => (
              <ApplicantSummaryCard key={applicant.id} applicant={applicant} />
            ))}
            {recentApplications.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                <UserCheck className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">承認待ちの応募はありません</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ナビゲーション */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-white/20 shadow-lg">
        <div className="max-w-md mx-auto flex justify-around py-3">
          <Link href="/organizer/dashboard" className="flex flex-col items-center py-2 px-3 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg" prefetch={false}>
            <TrendingUp className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">ダッシュボード</span>
          </Link>
          <Link href="/organizer/festivals" className="flex flex-col items-center py-2 px-3 rounded-full text-gray-500 hover:bg-gray-100/50 transition-all duration-300" prefetch={false}>
            <Calendar className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">祭り管理</span>
          </Link>
          <Link href="/organizer/tasks" className="flex flex-col items-center py-2 px-3 rounded-full text-gray-500 hover:bg-gray-100/50 transition-all duration-300" prefetch={false}>
            <Users className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">タスク管理</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}

const FestivalSummaryCard = memo(function FestivalSummaryCard({ festival }: { festival: Festival }) {
  return (
    <Link href={`/organizer/festivals/${festival.id}`} prefetch={false}>
      <div className="group hover:bg-amber-50/50 rounded-lg p-3 transition-colors cursor-pointer">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h4 className="font-semibold text-gray-800 group-hover:text-amber-700 transition-colors text-sm">
              {festival.name}
            </h4>
            <p className="text-xs text-gray-600 mt-1">{festival.date} {festival.time}</p>
            <p className="text-xs text-gray-500 mt-1">{festival.location}</p>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-amber-600 transition-colors" />
        </div>
      </div>
    </Link>
  );
});

const ApplicantSummaryCard = memo(function ApplicantSummaryCard({ applicant }: { applicant: any }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-orange-100">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800 text-sm">{applicant.name}</h4>
          <p className="text-xs text-gray-600 mt-1">レベル {applicant.level}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {applicant.badges.map((badge: string) => (
              <Badge key={badge} variant="outline" className="text-xs bg-orange-50 text-orange-600 border-orange-200">
                {badge}
              </Badge>
            ))}
          </div>
        </div>
        <Badge className="bg-orange-500 text-white text-xs">
          承認待ち
        </Badge>
      </div>
    </div>
  );
});
