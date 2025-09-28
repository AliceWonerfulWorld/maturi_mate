'use client';

import { useState, useMemo, memo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Calendar, Clock, Users, Gift } from 'lucide-react';
import dynamic from 'next/dynamic';
import { dummyTasks } from '@/lib/dummy-data';
import { Task } from '@/types';
import Link from 'next/link';

export default function ParticipantHomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredTasks = useMemo(() => {
    return dummyTasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTag = !selectedTag || task.tags.includes(selectedTag);
      return matchesSearch && matchesTag;
    });
  }, [searchTerm, selectedTag]);

  const allTags = useMemo(() => {
    return Array.from(new Set(dummyTasks.flatMap(task => task.tags)));
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
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-slate-600 to-gray-700 rounded-full mb-2 shadow-lg">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-slate-700 to-gray-800 bg-clip-text text-transparent mb-1">
              Matsuri Mate
            </h1>
            <p className="text-xs text-gray-600 bg-white/50 backdrop-blur-sm px-3 py-1 rounded-full inline-block">
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
        <div className="space-y-12 pb-24">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>

        {/* ナビゲーション */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-white/20 shadow-lg">
          <div className="max-w-md mx-auto flex justify-around py-3">
            <Link href="/participant" className="flex flex-col items-center py-2 px-4 rounded-full bg-gradient-to-r from-slate-600 to-gray-700 text-white shadow-lg" prefetch={false}>
              <Calendar className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">ホーム</span>
            </Link>
            <Link href="/participant/profile" className="flex flex-col items-center py-2 px-4 rounded-full text-gray-500 hover:bg-gray-100/50 transition-all duration-300" prefetch={false}>
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
      <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white/90 backdrop-blur-sm border-0 shadow-xl overflow-hidden will-change-transform gpu-accelerated contain-layout">
        {/* ヘッダー部分 */}
        <CardHeader className="pb-3 relative">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-slate-500/10 to-gray-500/10 rounded-full transform translate-x-8 -translate-y-8"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-2">
              <CardTitle className="text-lg font-bold text-gray-800 group-hover:text-slate-600 transition-colors pr-2">
                {task.title}
              </CardTitle>
              <Badge 
                variant={task.status === 'open' ? 'default' : 'secondary'}
                className={`${
                  task.status === 'open' 
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg' 
                    : 'bg-gray-200 text-gray-600'
                } rounded-full px-3 py-1 text-xs font-medium`}
              >
                {task.status === 'open' ? '募集中' : '終了'}
              </Badge>
            </div>
            <CardDescription className="text-gray-600 line-clamp-2 leading-relaxed">
              {task.description}
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0 relative z-10">
          {/* タスク詳細 */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center text-sm text-gray-600 bg-slate-50/50 rounded-lg p-2">
              <MapPin className="h-4 w-4 mr-2 text-slate-500" />
              <span className="truncate">{task.location}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600 bg-gray-50/50 rounded-lg p-2">
              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
              <span>{task.date}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600 bg-stone-50/50 rounded-lg p-2">
              <Clock className="h-4 w-4 mr-2 text-stone-500" />
              <span>{task.time}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600 bg-emerald-50/50 rounded-lg p-2">
              <Users className="h-4 w-4 mr-2 text-emerald-500" />
              <span>{task.currentParticipants}/{task.capacity}人</span>
            </div>
          </div>

          {/* 報酬 */}
          <div className="flex items-center text-sm text-gray-600 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-3 mb-4">
            <Gift className="h-5 w-5 mr-2 text-amber-500" />
            <span className="font-medium">{task.reward}</span>
          </div>

          {/* タグ */}
          <div className="flex flex-wrap gap-2">
            {task.tags.map(tag => (
              <Badge 
                key={tag} 
                variant="outline" 
                className="text-xs bg-white/80 backdrop-blur-sm border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
});
