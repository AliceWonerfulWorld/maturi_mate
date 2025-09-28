'use client';

import { useState, useMemo, memo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Users, UserCheck, Calendar, ArrowLeft, Filter } from 'lucide-react';
import { dummyFestivals, dummyOrganizerTasks, dummyApplicants } from '@/lib/dummy-data';
import { Festival, OrganizerTask, Applicant } from '@/types';
import Link from 'next/link';

export default function ApplicationsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFestival, setSelectedFestival] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // 祭り単位の応募者データを集計
  const festivalApplications = useMemo(() => {
    const result: Array<{
      festival: Festival;
      tasks: Array<{
        task: OrganizerTask;
        applicants: Applicant[];
      }>;
      totalApplicants: number;
      pendingCount: number;
    }> = [];

    dummyFestivals.forEach(festival => {
      // 祭りに関連するタスクを取得
      const relatedTasks = dummyOrganizerTasks.filter(task => {
        // 簡単な関連付け（実際のアプリではより複雑なロジック）
        return task.location === festival.location || 
               task.title.toLowerCase().includes(festival.name.toLowerCase().split(' ')[0] || '');
      });

      const tasksWithApplicants = relatedTasks.map(task => {
        const taskApplicants = dummyApplicants.filter(applicant => 
          task.applicants.some(app => app.userId === applicant.id)
        );
        return { task, applicants: taskApplicants };
      });

      const totalApplicants = tasksWithApplicants.reduce((sum, item) => sum + item.applicants.length, 0);
      const pendingCount = tasksWithApplicants.reduce((sum, item) => 
        sum + item.applicants.filter(app => app.status === 'pending').length, 0
      );

      result.push({
        festival,
        tasks: tasksWithApplicants,
        totalApplicants,
        pendingCount
      });
    });

    return result;
  }, []);

  // フィルタリングされたデータ
  const filteredApplications = useMemo(() => {
    return festivalApplications.filter(item => {
      const matchesSearch = searchTerm === '' || 
        item.festival.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.festival.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFestival = selectedFestival === null || item.festival.id === selectedFestival;
      
      return matchesSearch && matchesFestival;
    });
  }, [festivalApplications, searchTerm, selectedFestival]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleApprove = (applicantId: string) => {
    // 実際のアプリではAPIを呼び出し
    console.log('承認:', applicantId);
  };

  const handleReject = (applicantId: string) => {
    // 実際のアプリではAPIを呼び出し
    console.log('却下:', applicantId);
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
              <UserCheck className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
              応募者一覧
            </h1>
            <p className="text-xs text-gray-600 bg-white/50 backdrop-blur-sm px-3 py-1 rounded-full inline-block">
              祭り単位で応募者を管理
            </p>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-md mx-auto px-4 py-6">
        {/* 検索・フィルター */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="祭り名や場所で検索..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border border-white/30 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg text-base placeholder-gray-500"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto">
            <Button
              variant={selectedFestival === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFestival(null)}
              className={`whitespace-nowrap ${
                selectedFestival === null 
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg" 
                  : "bg-white/80 backdrop-blur-sm border-white/30 text-gray-600"
              }`}
            >
              すべての祭り
            </Button>
            {dummyFestivals.map(festival => (
              <Button
                key={festival.id}
                variant={selectedFestival === festival.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFestival(festival.id)}
                className={`whitespace-nowrap ${
                  selectedFestival === festival.id 
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg" 
                    : "bg-white/80 backdrop-blur-sm border-white/30 text-gray-600"
                }`}
              >
                {festival.name}
              </Button>
            ))}
          </div>
        </div>

        {/* 応募者一覧 */}
        <div className="space-y-6 pb-24">
          {filteredApplications.map((item) => (
            <FestivalApplicationCard 
              key={item.festival.id} 
              festival={item.festival}
              tasks={item.tasks}
              totalApplicants={item.totalApplicants}
              pendingCount={item.pendingCount}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const FestivalApplicationCard = memo(function FestivalApplicationCard({ 
  festival, 
  tasks, 
  totalApplicants, 
  pendingCount,
  onApprove,
  onReject
}: { 
  festival: Festival;
  tasks: Array<{ task: OrganizerTask; applicants: Applicant[] }>;
  totalApplicants: number;
  pendingCount: number;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}) {
  return (
    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-bold text-gray-800">{festival.name}</CardTitle>
            <CardDescription className="text-gray-600">
              {festival.date} {festival.time} | {festival.location}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-gray-800">{totalApplicants}人</div>
            <div className="text-xs text-gray-600">総応募者</div>
            {pendingCount > 0 && (
              <Badge className="bg-orange-500 text-white text-xs mt-1">
                {pendingCount}件承認待ち
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {tasks.map(({ task, applicants }) => (
          <div key={task.id} className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-gray-100">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-semibold text-gray-800 text-sm">{task.title}</h4>
              <Badge variant="outline" className="text-xs">
                {applicants.length}人応募
              </Badge>
            </div>
            
            {applicants.length > 0 ? (
              <div className="space-y-3">
                {applicants.map((applicant) => (
                  <ApplicantCard
                    key={applicant.id}
                    applicant={applicant}
                    onApprove={() => onApprove(applicant.id)}
                    onReject={() => onReject(applicant.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                <Users className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">まだ応募者がいません</p>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
});

const ApplicantCard = memo(function ApplicantCard({ 
  applicant, 
  onApprove, 
  onReject 
}: { 
  applicant: Applicant; 
  onApprove: () => void; 
  onReject: () => void;
}) {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 border border-gray-200">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h5 className="font-medium text-gray-800 text-sm">{applicant.name}</h5>
          <p className="text-xs text-gray-600">{applicant.age}歳 | レベル {applicant.level}</p>
        </div>
        <Badge 
          variant={applicant.status === 'pending' ? 'default' : 'secondary'}
          className={`text-xs ${
            applicant.status === 'pending' ? 'bg-orange-500 text-white' :
            applicant.status === 'approved' ? 'bg-green-500 text-white' :
            'bg-gray-500 text-white'
          }`}
        >
          {applicant.status === 'pending' ? '承認待ち' : 
           applicant.status === 'approved' ? '承認済み' : '却下済み'}
        </Badge>
      </div>
      
      <p className="text-xs text-gray-700 mb-2">{applicant.profile}</p>
      
      <div className="flex flex-wrap gap-1 mb-2">
        {applicant.badges.map(badge => (
          <Badge key={badge} variant="outline" className="text-xs">
            {badge}
          </Badge>
        ))}
      </div>
      
      {applicant.status === 'pending' && (
        <div className="flex gap-2">
          <Button 
            size="sm" 
            onClick={onApprove}
            className="bg-green-600 hover:bg-green-700 text-white text-xs py-1 px-3"
          >
            承認
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={onReject}
            className="border-red-300 text-red-600 hover:bg-red-50 text-xs py-1 px-3"
          >
            却下
          </Button>
        </div>
      )}
    </div>
  );
});
