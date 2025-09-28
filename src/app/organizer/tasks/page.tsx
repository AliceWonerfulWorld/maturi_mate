'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Clock, Users, Gift, Plus, UserCheck, Eye, ArrowLeft, TrendingUp } from 'lucide-react';
import { dummyOrganizerTasks } from '@/lib/dummy-data';
import { OrganizerTask } from '@/types';
import Link from 'next/link';

export default function OrganizerTasksPage() {

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
            <Link href="/organizer" >
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-slate-600 hover:bg-slate-100/50 rounded-full p-2 opacity-80 hover:opacity-100 transition-all duration-200">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex-1"></div>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-slate-600 to-gray-700 rounded-full mb-2 shadow-lg">
              <Users className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-slate-700 to-gray-800 bg-clip-text text-transparent mb-1">
              タスク管理
            </h1>
            <p className="text-xs text-gray-600 bg-white/50 backdrop-blur-sm px-3 py-1 rounded-full inline-block">
              運営者モード
            </p>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-md mx-auto px-4 py-6 pb-32">
        {/* 新規タスク登録ボタン */}
        <div className="mb-6">
          <div className="grid grid-cols-2 gap-3">
            <Link href="/organizer/festivals/register" >
              <Button className="w-full bg-gradient-to-r from-slate-600 to-gray-700 hover:from-slate-700 hover:to-gray-800 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <Plus className="h-4 w-4 mr-2" />
                新しい祭りを登録
              </Button>
            </Link>
            <Button className="w-full bg-gradient-to-r from-slate-500 to-gray-600 hover:from-slate-600 hover:to-gray-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105" disabled>
              <Plus className="h-4 w-4 mr-2" />
              新しいタスクを登録
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            タスクは祭り詳細画面から登録してください
          </p>
        </div>

        {/* タスク一覧 */}
        <div className="space-y-4">
          {dummyOrganizerTasks.map((task) => (
            <TaskCard 
              key={task.id} 
              task={task} 
            />
          ))}
        </div>
      </div>

      {/* ナビゲーション */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-white/20 shadow-lg z-50">
        <div className="max-w-md mx-auto flex justify-around py-3">
          <Link href="/organizer" className="flex flex-col items-center py-2 px-3 rounded-full text-gray-500 hover:bg-gray-100/50 transition-all duration-300" >
            <TrendingUp className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">ダッシュボード</span>
          </Link>
          <Link href="/organizer/festivals" className="flex flex-col items-center py-2 px-3 rounded-full text-gray-500 hover:bg-gray-100/50 transition-all duration-300" >
            <Calendar className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">祭り管理</span>
          </Link>
          <Link href="/organizer/applications" className="flex flex-col items-center py-2 px-3 rounded-full text-gray-500 hover:bg-gray-100/50 transition-all duration-300" >
            <UserCheck className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">応募者管理</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}

function TaskCard({ task }: { 
  task: OrganizerTask; 
}) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold text-gray-800">
            {task.title}
          </CardTitle>
          <Badge variant={task.status === 'open' ? 'default' : 'secondary'}>
            {task.status === 'open' ? '募集中' : '終了'}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2">
          {task.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            {task.location}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            {task.date}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-2" />
            {task.time}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Users className="h-4 w-4 mr-2" />
            {task.currentParticipants}/{task.capacity}人
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Gift className="h-4 w-4 mr-2" />
            {task.reward}
          </div>
        </div>
        <div className="flex flex-wrap gap-1 mt-3">
          <Badge variant="outline" className="text-xs bg-slate-50 text-slate-600 border-slate-200">
            中央区夏祭り
          </Badge>
          {task.tags.map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex justify-between items-center mt-3">
          <div className="text-sm text-gray-600">
            応募者: {task.applicants.length}人
          </div>
          <Link href="/organizer/applications" >
            <Button size="sm" className="bg-gradient-to-r from-slate-600 to-gray-700 hover:from-slate-700 hover:to-gray-800 text-white">
              <UserCheck className="h-3 w-3 mr-1" />
              管理
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

