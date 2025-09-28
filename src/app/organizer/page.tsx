'use client';

import { useState, useMemo, memo, useCallback, lazy, Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, UserCheck, TrendingUp, ArrowRight, Plus, Eye } from 'lucide-react';
// Rechartsの型エラーを回避するため、any型でインポート
const { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } = require('recharts') as any;
import { dummyFestivals, dummyOrganizerTasks, dummyApplicants, dummyApplications, dummyFestivalReviews } from '@/lib/dummy-data';
import { getRelatedTasks } from '@/lib/relations';
import { Festival, OrganizerTask } from '@/types';
import Link from 'next/link';
import HomeButton from '@/components/HomeButton';

export default function OrganizerDashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('week');

  // ダッシュボード用の統計データ（メモ化強化）
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
  }, []); // 依存配列を空にして、初回のみ計算

  // 最近の祭り（最大3件）
  const recentFestivals = useMemo(() => {
    return dummyFestivals.slice(0, 3);
  }, []);

  // 最近の応募（最大5件）
  const recentApplications = useMemo(() => {
    return dummyApplicants.filter(app => app.status === 'pending').slice(0, 5);
  }, []);

  // 人気祭りランキング（応募率・口コミ平均点）
  const popularFestivals = useMemo(() => {
    return dummyFestivals.map(festival => {
      // 祭りに関連するタスクの応募数を計算（統一されたロジック）
      const relatedTasks = getRelatedTasks(festival, dummyOrganizerTasks, true);
      
      const totalApplications = relatedTasks.reduce((sum, task) => {
        return sum + dummyApplications.filter(app => app.taskId === task.id).length;
      }, 0);
      
      const totalCapacity = relatedTasks.reduce((sum, task) => sum + task.capacity, 0);
      const applicationRate = totalCapacity > 0 ? (totalApplications / totalCapacity) * 100 : 0;
      
      // 祭りの口コミ平均点を計算
      const festivalReviews = dummyFestivalReviews.filter(review => review.festivalId === festival.id);
      const averageRating = festivalReviews.length > 0 
        ? festivalReviews.reduce((sum, review) => sum + review.rating, 0) / festivalReviews.length 
        : 0;
      
      return {
        ...festival,
        applicationRate: Math.round(applicationRate),
        averageRating: Math.round(averageRating * 10) / 10,
        reviewCount: festivalReviews.length
      };
    }).sort((a, b) => {
      // 応募率と口コミ平均点の重み付きスコアでソート
      const scoreA = (a.applicationRate * 0.6) + (a.averageRating * 0.4);
      const scoreB = (b.applicationRate * 0.6) + (b.averageRating * 0.4);
      return scoreB - scoreA;
    }).slice(0, 5);
  }, []);

  // 参加者属性分布（年齢層別）
  const participantAgeDistribution = useMemo(() => {
    const ageGroups = {
      '10代': 0,
      '20代': 0,
      '30代': 0,
      '40代以上': 0
    };

    dummyApplicants.forEach(applicant => {
      if (applicant.age < 20) {
        ageGroups['10代']++;
      } else if (applicant.age < 30) {
        ageGroups['20代']++;
      } else if (applicant.age < 40) {
        ageGroups['30代']++;
      } else {
        ageGroups['40代以上']++;
      }
    });

    return Object.entries(ageGroups)
      .map(([ageGroup, count]) => ({
        name: ageGroup,
        value: count,
        percentage: Math.round((count / dummyApplicants.length) * 100)
      }))
      .filter(item => item.value > 0); // 0人の年齢層は表示しない
  }, []);

  // グラフの色設定
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

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
        <div className="max-w-md mx-auto px-3 py-3">
          <div className="flex items-center justify-between mb-1">
            <HomeButton />
            <div className="flex-1"></div>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-slate-600 to-gray-700 rounded-full mb-2 shadow-lg">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-slate-700 to-gray-800 bg-clip-text text-transparent mb-1">
              ダッシュボード
            </h1>
            <p className="text-xs text-gray-600 bg-white/50 backdrop-blur-sm px-3 py-1 rounded-full inline-block">
              運営者モード
            </p>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-md mx-auto px-4 py-6 space-y-6 pb-32">
        {/* 統計カード */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-1">{stats.totalFestivals}</div>
              <div className="text-sm text-gray-600 font-medium">登録祭り</div>
              <div className="text-xs text-green-600 mt-1">+2 今月</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-1">{stats.totalTasks}</div>
              <div className="text-sm text-gray-600 font-medium">登録タスク</div>
              <div className="text-xs text-green-600 mt-1">+5 今月</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                <UserCheck className="h-6 w-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-1">{stats.totalApplicants}</div>
              <div className="text-sm text-gray-600 font-medium">総応募者</div>
              <div className="text-xs text-green-600 mt-1">+12 今月</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-1">{stats.pendingApplications}</div>
              <div className="text-sm text-gray-600 font-medium">未承認</div>
              <div className="text-xs text-orange-600 mt-1">要対応</div>
            </CardContent>
          </Card>
        </div>

        {/* クイックアクション */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-800 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
              クイックアクション
            </CardTitle>
            <CardDescription className="text-gray-600">よく使用する機能へのショートカット</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/organizer/festivals/register">
              <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <Plus className="h-4 w-4 mr-2" />
                新しい祭りを登録
              </Button>
            </Link>
            
            <div className="grid grid-cols-2 gap-3">
              <Link href="/organizer/festivals">
                <Button variant="outline" className="w-full bg-white/80 backdrop-blur-sm border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300">
                  <Calendar className="h-4 w-4 mr-2" />
                  祭り一覧
                </Button>
              </Link>
              
              <Link href="/organizer/tasks">
                <Button variant="outline" className="w-full bg-white/80 backdrop-blur-sm border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 transition-all duration-300">
                  <Users className="h-4 w-4 mr-2" />
                  タスク管理
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Link href="/organizer/participants">
                <Button variant="outline" className="w-full bg-white/80 backdrop-blur-sm border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 transition-all duration-300">
                  <UserCheck className="h-4 w-4 mr-2" />
                  参加者評価
                </Button>
              </Link>
              
              <Link href="/organizer/applications">
                <Button variant="outline" className="w-full bg-white/80 backdrop-blur-sm border-orange-200 text-orange-700 hover:bg-orange-50 hover:border-orange-300 transition-all duration-300">
                  <Eye className="h-4 w-4 mr-2" />
                  応募者管理
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* 人気祭りランキング */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-800 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-orange-500" />
              人気祭りランキング
            </CardTitle>
            <CardDescription className="text-gray-600">応募率と口コミ平均点による人気度ランキング</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {popularFestivals.map((festival, index) => (
                <div key={festival.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-100">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 text-sm">{festival.name}</h4>
                      <p className="text-xs text-gray-600">{festival.date} • {festival.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-orange-600 font-medium">{festival.applicationRate}%</span>
                      <span className="text-gray-400">応募率</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-yellow-600 font-medium">{festival.averageRating}/5</span>
                      <span className="text-gray-400">評価</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 参加者属性分布 */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-800 flex items-center">
              <Users className="h-5 w-5 mr-2 text-purple-500" />
              参加者属性分布
            </CardTitle>
            <CardDescription className="text-gray-600">年齢層別の参加者分布</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={participantAgeDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }: { name: string; percentage: number }) => {
                      // 短縮形のラベルを使用
                      const shortName = name === '40代以上' ? '40代+' : name;
                      return `${shortName}: ${percentage}%`;
                    }}
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {participantAgeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number, name: string, props: any) => [
                      `${value}人 (${props.payload.percentage}%)`,
                      name
                    ]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {participantAgeDistribution.map((item, index) => (
                <div key={item.name} className="flex items-center gap-2 text-sm">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-gray-600">{item.name}</span>
                  <span className="font-medium text-gray-800">{item.value}人</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 最近の祭り */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-bold text-gray-800">最近の祭り</CardTitle>
              <Link href="/organizer/festivals">
                <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-700">
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
              <Link href="/organizer/applications">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-700">
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
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-white/20 shadow-lg z-50">
        <div className="max-w-md mx-auto flex justify-around py-3">
          <Link href="/organizer" className="flex flex-col items-center py-2 px-3 rounded-full bg-gradient-to-r from-slate-600 to-gray-700 text-white shadow-lg">
            <TrendingUp className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">ダッシュボード</span>
          </Link>
          <Link href="/organizer/festivals" className="flex flex-col items-center py-2 px-3 rounded-full text-gray-500 hover:bg-gray-100/50 transition-all duration-300">
            <Calendar className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">祭り管理</span>
          </Link>
          <Link href="/organizer/participants" className="flex flex-col items-center py-2 px-3 rounded-full text-gray-500 hover:bg-gray-100/50 transition-all duration-300">
            <UserCheck className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">参加者評価</span>
          </Link>
          <Link href="/organizer/applications" className="flex flex-col items-center py-2 px-3 rounded-full text-gray-500 hover:bg-gray-100/50 transition-all duration-300">
            <Users className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">応募者管理</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}

const FestivalSummaryCard = memo(function FestivalSummaryCard({ festival }: { festival: Festival }) {
  return (
    <Link href={`/organizer/festivals/${festival.id}`}>
      <div className="group hover:bg-slate-50/50 rounded-lg p-3 transition-colors cursor-pointer">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h4 className="font-semibold text-gray-800 group-hover:text-slate-700 transition-colors text-sm">
              {festival.name}
            </h4>
            <p className="text-xs text-gray-600 mt-1">{festival.date} {festival.time}</p>
            <p className="text-xs text-gray-500 mt-1">{festival.location}</p>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-slate-600 transition-colors" />
        </div>
      </div>
    </Link>
  );
});

const ApplicantSummaryCard = memo(function ApplicantSummaryCard({ applicant }: { applicant: any }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-gray-100">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800 text-sm">{applicant.name}</h4>
          <p className="text-xs text-gray-600 mt-1">レベル {applicant.level}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {applicant.badges.map((badge: string) => (
              <Badge key={badge} variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-200">
                {badge}
              </Badge>
            ))}
          </div>
        </div>
        <Badge className="bg-gray-500 text-white text-xs">
          承認待ち
        </Badge>
      </div>
    </div>
  );
});
