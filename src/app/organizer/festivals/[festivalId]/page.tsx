'use client';

import { useState, useMemo, memo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Clock, Users, Plus, ArrowLeft, Eye, UserCheck } from 'lucide-react';
import { dummyFestivals, dummyOrganizerTasks } from '@/lib/dummy-data';
import { Festival, OrganizerTask } from '@/types';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function OrganizerFestivalDetailPage() {
  const params = useParams();
  const festivalId = params.festivalId as string;

  // 祭り情報を取得
  const festival = useMemo(() => {
    return dummyFestivals.find(f => f.id === festivalId);
  }, [festivalId]);

  // 祭りに関連するタスクを取得
  const relatedTasks = useMemo(() => {
    return dummyOrganizerTasks.filter(task => {
      // 簡単な関連付け（実際のアプリではより複雑なロジック）
      return task.location === festival?.location || 
             task.title.toLowerCase().includes(festival?.name.toLowerCase().split(' ')[0] || '');
    });
  }, [festival]);

  if (!festival) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-50 flex items-center justify-center">
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">祭りが見つかりません</p>
            <Link href="/organizer/festivals" className="text-amber-600 hover:text-amber-700 mt-2 inline-block">
              祭り一覧に戻る
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            <Link href="/organizer/festivals" prefetch={false}>
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
            <h1 className="text-lg font-bold bg-gradient-to-r from-amber-700 to-orange-700 bg-clip-text text-transparent mb-1">
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
              <div className="flex items-center text-sm text-gray-600 bg-amber-50/50 rounded-lg p-2">
                <Calendar className="h-4 w-4 mr-2 text-amber-500" />
                <span>{festival.date}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 bg-orange-50/50 rounded-lg p-2">
                <Clock className="h-4 w-4 mr-2 text-orange-500" />
                <span>{festival.time}</span>
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-600 bg-slate-50/50 rounded-lg p-3">
              <MapPin className="h-5 w-5 mr-2 text-slate-500" />
              <span className="font-medium">{festival.location}</span>
            </div>
          </CardContent>
        </Card>

        {/* 新規タスク登録ボタン */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-6 text-center">
            <Link href={`/organizer/festivals/${festivalId}/tasks/register`} prefetch={false}>
              <Button className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <Plus className="h-4 w-4 mr-2" />
                新しいタスクを登録
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* 関連タスク一覧 */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-800 flex items-center">
              <Users className="h-5 w-5 mr-2 text-amber-600" />
              登録済みタスク ({relatedTasks.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {relatedTasks.length > 0 ? (
              relatedTasks.map((task) => (
                <OrganizerTaskCard key={task.id} task={task} />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>まだタスクが登録されていません</p>
                <p className="text-sm">上のボタンから新しいタスクを登録してください</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const OrganizerTaskCard = memo(function OrganizerTaskCard({ task }: { task: OrganizerTask }) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm border border-amber-100">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base font-bold text-gray-800 group-hover:text-amber-600 transition-colors">
            {task.title}
          </CardTitle>
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
        <CardDescription className="text-gray-600 text-sm line-clamp-2">
          {task.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="h-3 w-3 mr-1" />
            <span className="mr-3">{task.date}</span>
            <Clock className="h-3 w-3 mr-1" />
            <span className="mr-3">{task.time}</span>
            <Users className="h-3 w-3 mr-1" />
            <span>{task.currentParticipants}/{task.capacity}人</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            応募者: {task.applicants.length}人
          </div>
          <Link href="/organizer" prefetch={false}>
            <Button size="sm" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white">
              <UserCheck className="h-3 w-3 mr-1" />
              管理
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
});
