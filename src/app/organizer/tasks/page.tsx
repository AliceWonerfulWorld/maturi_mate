'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Clock, Users, Gift, Plus, UserCheck, Eye, ArrowLeft } from 'lucide-react';
import { dummyOrganizerTasks, dummyApplicants } from '@/lib/dummy-data';
import { OrganizerTask, Applicant } from '@/types';
import Link from 'next/link';

export default function OrganizerTasksPage() {
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
    setApplicants(prev => prev.map(applicant => 
      applicant.id === applicantId 
        ? { ...applicant, status: 'approved' as const }
        : applicant
    ));
  };

  const handleReject = (applicantId: string) => {
    setApplicants(prev => prev.map(applicant => 
      applicant.id === applicantId 
        ? { ...applicant, status: 'rejected' as const }
        : applicant
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-50">
      {/* 背景装飾 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse delay-1000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse delay-500"></div>
      </div>

      {/* ヘッダー */}
      <header className="relative z-10 bg-white/80 backdrop-blur-sm shadow-lg border-b border-white/20">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <Link href="/organizer/dashboard" prefetch={false}>
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-600 hover:bg-blue-100/50 rounded-full p-2 opacity-80 hover:opacity-100 transition-all duration-200">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex-1"></div>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-2 shadow-lg">
              <Users className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
              タスク管理
            </h1>
            <p className="text-xs text-gray-600 bg-white/50 backdrop-blur-sm px-3 py-1 rounded-full inline-block">
              運営者モード
            </p>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-md mx-auto px-4 py-6">
        {/* タスク一覧 */}
        <div className="space-y-4 mb-6">
          {dummyOrganizerTasks.map((task) => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onClick={() => handleTaskClick(task)}
              isSelected={selectedTask?.id === task.id}
            />
          ))}
        </div>

        {/* 応募者一覧 */}
        {selectedTask && (
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-gray-800">
                応募者一覧: {selectedTask.title}
              </CardTitle>
              <CardDescription className="text-gray-600">
                応募者を承認または却下してください
              </CardDescription>
            </CardHeader>
            <CardContent>
              {applicants.length > 0 ? (
                <div className="space-y-4">
                  {applicants.map((applicant) => (
                    <ApplicantCard
                      key={applicant.id}
                      applicant={applicant}
                      onApprove={() => handleApprove(applicant.id)}
                      onReject={() => handleReject(applicant.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>まだ応募者がいません</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function TaskCard({ task, onClick, isSelected }: { 
  task: OrganizerTask; 
  onClick: () => void; 
  isSelected: boolean;
}) {
  return (
    <Card 
      className={`cursor-pointer transition-all duration-300 ${
        isSelected 
          ? 'bg-blue-50/80 border-blue-200 shadow-lg' 
          : 'bg-white/90 hover:shadow-lg hover:bg-white/95'
      } backdrop-blur-sm border-0 shadow-xl`}
      onClick={onClick}
    >
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
          {task.tags.map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="mt-3 text-sm text-gray-600">
          応募者: {task.applicants.length}人
        </div>
      </CardContent>
    </Card>
  );
}

function ApplicantCard({ 
  applicant, 
  onApprove, 
  onReject 
}: { 
  applicant: Applicant; 
  onApprove: () => void; 
  onReject: () => void;
}) {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-gray-200">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h4 className="font-semibold text-gray-800">{applicant.name}</h4>
            <p className="text-sm text-gray-600">{applicant.age}歳</p>
            <p className="text-sm text-gray-600">レベル {applicant.level}</p>
          </div>
          <Badge variant={applicant.status === 'pending' ? 'default' : 'secondary'}>
            {applicant.status === 'pending' ? '承認待ち' : 
             applicant.status === 'approved' ? '承認済み' : '却下済み'}
          </Badge>
        </div>
        
        <p className="text-sm text-gray-700 mb-3">{applicant.profile}</p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {applicant.badges.map(badge => (
            <Badge key={badge} variant="outline" className="text-xs">
              {badge}
            </Badge>
          ))}
        </div>
        
        <div className="flex gap-2">
          {applicant.status === 'pending' && (
            <>
              <Button 
                size="sm" 
                onClick={onApprove}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                承認
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={onReject}
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                却下
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
