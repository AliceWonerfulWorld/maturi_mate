'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Clock, Users, Gift, ArrowLeft, Star, MessageCircle } from 'lucide-react';
import { dummyTasks, dummyFeedbacks } from '@/lib/dummy-data';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function ParticipantTaskDetailPage() {
  const params = useParams();
  const taskId = params.id as string;
  const task = dummyTasks.find(t => t.id === taskId);
  const feedbacks = dummyFeedbacks.filter(f => f.taskId === taskId);
  const [isApplied, setIsApplied] = useState(false);

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">タスクが見つかりません</h1>
          <Link href="/participant">
            <Button>ホームに戻る</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleApply = () => {
    setIsApplied(true);
    // 実際のアプリケーションでは、ここでAPIを呼び出します
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center">
          <Link href="/participant" className="mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-semibold">タスク詳細</h1>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* タスク情報 */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl">{task.title}</CardTitle>
              <Badge variant={task.status === 'open' ? 'default' : 'secondary'}>
                {task.status === 'open' ? '募集中' : '終了'}
              </Badge>
            </div>
            <CardDescription className="text-base">
              {task.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-3 text-gray-500" />
                <span>{task.location}</span>
              </div>
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-3 text-gray-500" />
                <span>{task.date}</span>
              </div>
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-3 text-gray-500" />
                <span>{task.time}</span>
              </div>
              <div className="flex items-center text-sm">
                <Users className="h-4 w-4 mr-3 text-gray-500" />
                <span>{task.currentParticipants}/{task.capacity}人</span>
              </div>
              <div className="flex items-center text-sm">
                <Gift className="h-4 w-4 mr-3 text-gray-500" />
                <span>{task.reward}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {task.tags.map(tag => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-gray-600">
                主催者: {task.organizerName}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 参加ボタン */}
        {task.status === 'open' && (
          <div className="mb-6">
            {isApplied ? (
              <Button className="w-full" disabled>
                応募済み
              </Button>
            ) : (
              <Button className="w-full" onClick={handleApply}>
                このタスクに参加する
              </Button>
            )}
          </div>
        )}

        {/* 口コミセクション */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircle className="h-5 w-5 mr-2" />
              口コミ・レビュー
            </CardTitle>
          </CardHeader>
          <CardContent>
            {feedbacks.length > 0 ? (
              <div className="space-y-4">
                {feedbacks.map(feedback => (
                  <div key={feedback.id} className="border-b pb-4 last:border-b-0">
                    <div className="flex items-center mb-2">
                      <span className="font-medium text-sm">{feedback.userName}</span>
                      <div className="flex ml-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < feedback.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{feedback.comment}</p>
                    <p className="text-xs text-gray-400 mt-2">{feedback.createdAt}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                まだ口コミがありません
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
