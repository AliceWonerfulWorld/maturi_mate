'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Clock, Users, Gift, ArrowLeft, ClipboardList, MessageSquare } from 'lucide-react';
import { dummyOrganizerTasks, dummyFestivals, dummyApplications } from '@/lib/dummy-data';
import { Application } from '@/types';
import { getRelatedFestivals } from '@/lib/relations';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function ParticipantTaskDetailPage() {
  const params = useParams();
  const taskId = params.id as string;
  const task = dummyOrganizerTasks.find(t => t.id === taskId);
  const [isApplied, setIsApplied] = useState(false);
  const [applications, setApplications] = useState<Application[]>(dummyApplications);

  // タスクに関連する祭りを特定（統一されたロジック）
  const relatedFestival = task ? getRelatedFestivals(task, dummyFestivals, true)[0] : null;

  if (!task) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-50 flex items-center justify-center">
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">タスクが見つかりません</p>
            <Link href="/participant" className="text-slate-600 hover:text-slate-700 mt-2 inline-block">
              ホームに戻る
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleApply = () => {
    const newApplication: Application = {
      id: `app${Date.now()}`,
      taskId: taskId,
      userId: '1', // 現在のユーザーID（ダミー）
      status: 'pending',
      appliedAt: new Date().toISOString().split('T')[0]
    };
    
    setApplications(prev => [...prev, newApplication]);
    setIsApplied(true);
    alert('タスクに応募しました！');
    // 実際のアプリケーションでは、ここでAPIを呼び出します
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
            <Link href="/participant">
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-slate-600 hover:bg-slate-100/50 rounded-full p-2 opacity-80 hover:opacity-100 transition-all duration-200">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex-1"></div>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-slate-600 to-gray-700 rounded-full mb-1 shadow-lg">
              <ClipboardList className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-slate-700 to-gray-800 bg-clip-text text-transparent">
              タスク詳細
            </h1>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-md mx-auto px-4 py-6 pb-32">
        {/* タスク情報 */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl mb-6">
          <CardHeader>
            <div className="flex justify-between items-start mb-3">
              <CardTitle className="text-xl font-bold text-slate-800">{task.title}</CardTitle>
              <Badge 
                variant={task.status === 'open' ? 'default' : 'secondary'}
                className={task.status === 'open' 
                  ? "bg-blue-500 text-white" 
                  : "bg-gray-500 text-white"
                }
              >
                {task.status === 'open' ? '募集中' : '終了'}
              </Badge>
            </div>
            <CardDescription className="text-base text-gray-700 leading-relaxed">
              {task.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-700">
                <MapPin className="h-4 w-4 mr-3 text-slate-600" />
                <span className="font-medium">{task.location}</span>
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <Calendar className="h-4 w-4 mr-3 text-slate-600" />
                <span className="font-medium">{task.date}</span>
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <Clock className="h-4 w-4 mr-3 text-slate-600" />
                <span className="font-medium">{task.time}</span>
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <Users className="h-4 w-4 mr-3 text-slate-600" />
                <span className="font-medium">{task.currentParticipants}/{task.capacity}人</span>
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <Gift className="h-4 w-4 mr-3 text-slate-600" />
                <span className="font-medium">{task.reward}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4">
              {task.tags.map(tag => (
                <Badge key={tag} variant="outline" className="bg-slate-50 text-slate-700 border-slate-300">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-200">
              <p className="text-sm text-gray-600">
                主催者: <span className="font-medium text-slate-700">{task.organizerName}</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 参加ボタン */}
        {task.status === 'open' && (
          <div className="mb-6">
            {isApplied ? (
              <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 rounded-xl shadow-lg" disabled>
                ✓ 応募済み
              </Button>
            ) : (
              <Button 
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                onClick={handleApply}
              >
                このタスクに参加する
              </Button>
            )}
          </div>
        )}

        {/* 関連祭りへのリンク */}
        {relatedFestival && (
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">このタスクに関連する祭り</h3>
              <p className="text-sm text-gray-600 mb-4">
                祭りの詳細情報や他のタスク、参加者の口コミを確認できます
              </p>
              <Link href={`/participant/festivals/${relatedFestival.id}`}>
                <Button variant="outline" className="w-full bg-white/80 border-slate-300 text-slate-700 hover:bg-slate-50">
                  {relatedFestival.name}の詳細を見る
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      {/* ナビゲーション */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-white/20 shadow-lg z-50">
        <div className="max-w-md mx-auto flex justify-around py-3">
          <Link href="/participant" className="flex flex-col items-center py-2 px-4 rounded-full bg-gradient-to-r from-slate-600 to-gray-700 text-white shadow-lg">
            <Calendar className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">タスク</span>
          </Link>
          <Link href="/participant/festivals" className="flex flex-col items-center py-2 px-4 rounded-full text-gray-500 hover:bg-gray-100/50 transition-all duration-300">
            <Users className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">祭り</span>
          </Link>
          <Link href="/participant/profile" className="flex flex-col items-center py-2 px-4 rounded-full text-gray-500 hover:bg-gray-100/50 transition-all duration-300">
            <Users className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">プロフィール</span>
          </Link>
          <Link href="/participant/feedback" className="flex flex-col items-center py-2 px-4 rounded-full text-gray-500 hover:bg-gray-100/50 transition-all duration-300">
            <MessageSquare className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">フィードバック</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}