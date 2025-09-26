'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Calendar, Clock, Users, Gift } from 'lucide-react';
import { dummyTasks } from '@/lib/dummy-data';
import { Task } from '@/types';
import Link from 'next/link';

export default function ParticipantHomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredTasks = dummyTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !selectedTag || task.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const allTags = Array.from(new Set(dummyTasks.flatMap(task => task.tags)));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-center">Matsuri Mate</h1>
          <p className="text-sm text-center text-gray-600">参加者モード</p>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* 検索バー */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="タスクを検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* タグフィルター */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedTag === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTag(null)}
            >
              すべて
            </Button>
            {allTags.map(tag => (
              <Button
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>

        {/* タスク一覧 */}
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>

        {/* ナビゲーション */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t">
          <div className="max-w-md mx-auto flex justify-around py-2">
            <Link href="/participant" className="flex flex-col items-center py-2 text-blue-600">
              <Calendar className="h-5 w-5" />
              <span className="text-xs mt-1">ホーム</span>
            </Link>
            <Link href="/participant/profile" className="flex flex-col items-center py-2 text-gray-400">
              <Users className="h-5 w-5" />
              <span className="text-xs mt-1">プロフィール</span>
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}

function TaskCard({ task }: { task: Task }) {
  return (
    <Link href={`/participant/task/${task.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{task.title}</CardTitle>
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
            {task.tags.map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
