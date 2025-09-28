'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Clock, Users, Gift, Plus, UserCheck, Eye } from 'lucide-react';
import { dummyOrganizerTasks, dummyApplicants } from '@/lib/dummy-data';
import { OrganizerTask, Applicant } from '@/types';
import Link from 'next/link';

export default function OrganizerManagePage() {
  const [selectedTask, setSelectedTask] = useState<OrganizerTask | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);

  const handleTaskClick = (task: OrganizerTask) => {
    setSelectedTask(task);
    // 応募者データを取得（実際のアプリケーションではAPIを呼び出し）
    const taskApplicants = dummyApplicants.filter(applicant => 
      task.applicants.some(app => app.userId === applicant.id)
    );
    setApplicants(taskApplicants);
  };

  const handleApprove = (applicantId: string) => {
    setApplicants(prev => 
      prev.map(applicant => 
        applicant.id === applicantId 
          ? { ...applicant, status: 'approved' as const }
          : applicant
      )
    );
    // 実際のアプリケーションでは、ここでAPIを呼び出します
  };

  const closeModal = () => {
    setSelectedTask(null);
    setApplicants([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-lg font-semibold text-center">タスク管理</h1>
          <p className="text-sm text-center text-gray-600">運営者モード</p>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* 新規登録ボタン */}
        <div className="mb-6">
          <Link href="/organizer/register">
            <Button className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              新しいタスクを登録
            </Button>
          </Link>
        </div>

        {/* タスク一覧 */}
        <div className="space-y-4">
          {dummyOrganizerTasks.map((task) => (
            <TaskCard key={task.id} task={task} onClick={() => handleTaskClick(task)} />
          ))}
        </div>

        {/* 応募者リストモーダル */}
        {selectedTask && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">応募者一覧</h2>
                  <Button variant="outline" onClick={closeModal}>
                    ×
                  </Button>
                </div>
                
                <div className="mb-4">
                  <h3 className="font-medium text-gray-900">{selectedTask.title}</h3>
                  <p className="text-sm text-gray-600">{selectedTask.date} {selectedTask.time}</p>
                </div>

                <div className="space-y-3">
                  {applicants.map((applicant) => (
                    <ApplicantCard 
                      key={applicant.id} 
                      applicant={applicant} 
                      onApprove={() => handleApprove(applicant.id)}
                    />
                  ))}
                </div>

                {applicants.length === 0 && (
                  <p className="text-center text-gray-500 py-4">
                    まだ応募者がいません
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ナビゲーション */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-white/20 shadow-lg">
          <div className="max-w-md mx-auto flex justify-around py-3">
            <Link href="/organizer/dashboard" className="flex flex-col items-center py-2 px-3 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg" prefetch={false}>
              <UserCheck className="h-5 w-5 mb-1" />
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
    </div>
  );
}

function TaskCard({ task, onClick }: { task: OrganizerTask; onClick: () => void }) {
  const pendingCount = task.applicants.filter(app => app.status === 'pending').length;
  const approvedCount = task.applicants.filter(app => app.status === 'approved').length;

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
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
        
        <div className="flex justify-between items-center mt-4">
          <div className="flex flex-wrap gap-1">
            {task.tags.map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Eye className="h-4 w-4 mr-1" />
            {pendingCount}件の応募
          </div>
        </div>

        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">承認済み: {approvedCount}人</span>
            <span className="text-blue-600">未承認: {pendingCount}人</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ApplicantCard({ applicant, onApprove }: { applicant: Applicant; onApprove: () => void }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h4 className="font-medium">{applicant.name}</h4>
              <Badge variant="outline">レベル {applicant.level}</Badge>
              <Badge variant={applicant.status === 'approved' ? 'default' : 'secondary'}>
                {applicant.status === 'approved' ? '承認済み' : '未承認'}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mb-2">{applicant.profile}</p>
            <div className="flex flex-wrap gap-1 mb-2">
              {applicant.badges.map(badge => (
                <Badge key={badge} variant="outline" className="text-xs">
                  {badge}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-gray-500">応募日: {applicant.appliedAt}</p>
          </div>
          {applicant.status === 'pending' && (
            <Button size="sm" onClick={onApprove}>
              承認
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
