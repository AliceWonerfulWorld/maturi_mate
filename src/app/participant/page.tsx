'use client';

import { useState, useMemo, memo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Calendar, Clock, Users, Gift, MessageSquare } from 'lucide-react';
import { dummyOrganizerTasks } from '@/lib/dummy-data';
import { Task } from '@/types';
import Link from 'next/link';
import HomeButton from '@/components/HomeButton';
import { useDebounce } from '@/hooks/useDebounce';

// TaskCardコンポーネントを直接定義

export default function ParticipantHomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  // デバウンスされた検索語
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const filteredTasks = useMemo(() => {
    return dummyOrganizerTasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                           task.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      const matchesTag = !selectedTag || task.tags.includes(selectedTag);
      return matchesSearch && matchesTag;
    });
  }, [debouncedSearchTerm, selectedTag]);

  const allTags = useMemo(() => {
    return Array.from(new Set(dummyOrganizerTasks.flatMap(task => task.tags)));
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleTagSelect = useCallback((tag: string | null) => {
    setSelectedTag(tag);
  }, []);

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
            <HomeButton />
            <div className="flex-1"></div>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-slate-600 to-gray-700 rounded-full mb-1 shadow-lg">
              <Calendar className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-slate-700 to-gray-800 bg-clip-text text-transparent mb-1">
              タスク一覧
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
              placeholder="タスクを検索..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border border-white/30 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg text-base placeholder-gray-500"
            />
          </div>
        </div>

        {/* タグフィルター */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedTag === null ? "default" : "outline"}
              size="sm"
              onClick={() => handleTagSelect(null)}
              className={`rounded-full px-4 py-2 font-medium transition-all duration-300 ${
                selectedTag === null 
                  ? "bg-gradient-to-r from-slate-600 to-gray-700 text-white shadow-lg hover:shadow-xl" 
                  : "bg-white/80 backdrop-blur-sm border-white/30 text-gray-600 hover:bg-white/90"
              }`}
            >
              すべて
            </Button>
            {allTags.map(tag => (
              <Button
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                size="sm"
                onClick={() => handleTagSelect(tag)}
                className={`rounded-full px-4 py-2 font-medium transition-all duration-300 ${
                  selectedTag === tag 
                    ? "bg-gradient-to-r from-slate-600 to-gray-700 text-white shadow-lg hover:shadow-xl" 
                    : "bg-white/80 backdrop-blur-sm border-white/30 text-gray-600 hover:bg-white/90"
                }`}
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>

        {/* タスク一覧 */}
        <div className="space-y-4 pb-24">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))
          ) : (
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-xl">
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">タスクが見つかりません</h3>
                <p className="text-gray-500 text-sm">
                  検索条件を変更して再度お試しください
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* ナビゲーション */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-white/20 shadow-lg">
          <div className="max-w-md mx-auto flex justify-around py-3">
            <Link href="/participant" className="flex flex-col items-center py-2 px-4 rounded-full bg-gradient-to-r from-slate-600 to-gray-700 text-white shadow-lg" prefetch={false}>
              <Calendar className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">タスク</span>
            </Link>
            <Link href="/participant/festivals" className="flex flex-col items-center py-2 px-4 rounded-full text-gray-500 hover:bg-gray-100/50 transition-all duration-300" prefetch={false}>
              <Users className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">祭り</span>
            </Link>
            <Link href="/participant/profile" className="flex flex-col items-center py-2 px-4 rounded-full text-gray-500 hover:bg-gray-100/50 transition-all duration-300" prefetch={false}>
              <Users className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">プロフィール</span>
            </Link>
            <Link href="/participant/feedback" className="flex flex-col items-center py-2 px-4 rounded-full text-gray-500 hover:bg-gray-100/50 transition-all duration-300" prefetch={false}>
              <MessageSquare className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">フィードバック</span>
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}

// TaskCardコンポーネント
const TaskCard = memo(function TaskCard({ task }: { task: Task }) {
  return (
    <Link href={`/participant/task/${task.id}`} className="block">
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start mb-2">
            <CardTitle className="text-lg font-bold text-slate-800 leading-tight">
              {task.title}
            </CardTitle>
            <Badge 
              variant={task.status === 'open' ? 'default' : 'secondary'}
              className={`ml-2 flex-shrink-0 ${
                task.status === 'open' 
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {task.status === 'open' ? '募集中' : '終了'}
            </Badge>
          </div>
          <CardDescription className="text-slate-600 text-sm leading-relaxed">
            {task.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {/* 基本情報 */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center text-slate-600">
                <Calendar className="h-4 w-4 mr-2 text-slate-500" />
                <span>{task.date}</span>
              </div>
              <div className="flex items-center text-slate-600">
                <Clock className="h-4 w-4 mr-2 text-slate-500" />
                <span>{task.time}</span>
              </div>
            </div>
            
            <div className="flex items-center text-slate-600 text-sm">
              <MapPin className="h-4 w-4 mr-2 text-slate-500" />
              <span className="truncate">{task.location}</span>
            </div>

            {/* 参加者情報 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center text-slate-600 text-sm">
                <Users className="h-4 w-4 mr-2 text-slate-500" />
                <span>{task.currentParticipants}/{task.capacity}人</span>
              </div>
              {task.reward && (
                <div className="flex items-center text-slate-600 text-sm">
                  <Gift className="h-4 w-4 mr-1 text-slate-500" />
                  <span className="text-xs">{task.reward}</span>
                </div>
              )}
            </div>

            {/* タグ */}
            <div className="flex flex-wrap gap-1">
              {task.tags.slice(0, 3).map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {task.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{task.tags.length - 3}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
});
