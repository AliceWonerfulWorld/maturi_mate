'use client';

import { useState, useMemo, memo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Users, Search, Star, Award, UserCheck, Eye, MessageSquare, TrendingUp, Calendar } from 'lucide-react';
import { dummyApplicants, dummyOrganizerEvaluations } from '@/lib/dummy-data';
import { Applicant, OrganizerEvaluation } from '@/types';
import Link from 'next/link';
import HomeButton from '@/components/HomeButton';

export default function ParticipantsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'evaluated' | 'pending'>('all');

  // 参加者一覧の取得とフィルタリング
  const filteredParticipants = useMemo(() => {
    let filtered = dummyApplicants.filter(applicant => {
      // 検索フィルタ
      if (searchTerm) {
        return applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               applicant.profile.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return true;
    });

    // 評価ステータスフィルタ
    if (statusFilter !== 'all') {
      const evaluatedParticipantIds = dummyOrganizerEvaluations.map(evaluation => evaluation.participantId);
      if (statusFilter === 'evaluated') {
        filtered = filtered.filter(applicant => evaluatedParticipantIds.includes(applicant.id));
      } else if (statusFilter === 'pending') {
        filtered = filtered.filter(applicant => !evaluatedParticipantIds.includes(applicant.id));
      }
    }

    return filtered;
  }, [searchTerm, statusFilter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-stone-100">
      {/* 背景装飾 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-slate-200 rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gray-200 rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-pulse delay-1000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-stone-200 rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-pulse delay-500"></div>
      </div>

      {/* ヘッダー */}
      <header className="relative z-10 bg-white/80 backdrop-blur-sm shadow-lg border-b border-white/20">
        <div className="max-w-md mx-auto px-3 py-3">
          <div className="flex items-center justify-between mb-1">
            <HomeButton />
            <div className="flex-1"></div>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-slate-600 to-gray-700 rounded-full mb-2 shadow-lg">
              <Users className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 mb-1">
              参加者評価
            </h1>
            <p className="text-xs text-gray-600 bg-white/50 backdrop-blur-sm px-3 py-1 rounded-full inline-block">
              運営者モード
            </p>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-md mx-auto px-4 py-6 space-y-6 pb-32">
        {/* 検索・フィルタ */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="参加者を検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/80 border-gray-200 focus:border-slate-500 focus:ring-slate-500"
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('all')}
                className={`text-xs px-3 py-1 ${
                  statusFilter === 'all' 
                    ? "bg-slate-600 text-white" 
                    : "bg-white/80 border-gray-200 text-gray-600"
                }`}
              >
                すべて
              </Button>
              <Button
                variant={statusFilter === 'evaluated' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('evaluated')}
                className={`text-xs px-3 py-1 ${
                  statusFilter === 'evaluated' 
                    ? "bg-slate-700 text-white" 
                    : "bg-white/80 border-gray-200 text-gray-600"
                }`}
              >
                評価済み
              </Button>
              <Button
                variant={statusFilter === 'pending' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('pending')}
                className={`text-xs px-3 py-1 ${
                  statusFilter === 'pending' 
                    ? "bg-gray-600 text-white" 
                    : "bg-white/80 border-gray-200 text-gray-600"
                }`}
              >
                未評価
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 参加者一覧 */}
        <div className="space-y-4">
          {filteredParticipants.map((participant) => (
            <ParticipantCard key={participant.id} participant={participant} />
          ))}
        </div>

        {filteredParticipants.length === 0 && (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">該当する参加者がいません</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* ナビゲーション */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-white/20 shadow-lg z-50">
        <div className="max-w-md mx-auto flex justify-around py-3">
          <Link href="/organizer" className="flex flex-col items-center py-2 px-3 rounded-full text-gray-500 hover:bg-gray-100/50 transition-all duration-300">
            <TrendingUp className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">ダッシュボード</span>
          </Link>
          <Link href="/organizer/festivals" className="flex flex-col items-center py-2 px-3 rounded-full text-gray-500 hover:bg-gray-100/50 transition-all duration-300">
            <Calendar className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">祭り管理</span>
          </Link>
          <Link href="/organizer/participants" className="flex flex-col items-center py-2 px-3 rounded-full bg-gradient-to-r from-slate-600 to-gray-700 text-white shadow-lg">
            <UserCheck className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">参加者評価</span>
          </Link>
          <Link href="/organizer/applications" className="flex flex-col items-center py-2 px-3 rounded-full text-gray-500 hover:bg-gray-100/50 transition-all duration-300">
            <Users className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">応募者管理</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}

// 参加者カードコンポーネント
const ParticipantCard = memo(function ParticipantCard({ participant }: { participant: Applicant }) {
  // 参加者の評価情報を取得
  const evaluations = dummyOrganizerEvaluations.filter(evaluation => evaluation.participantId === participant.id);
  const hasEvaluations = evaluations.length > 0;
  const averageRating = hasEvaluations 
    ? Math.round(evaluations.reduce((sum, evaluation) => sum + evaluation.rating, 0) / evaluations.length * 10) / 10
    : 0;

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-slate-500 to-gray-600 rounded-full flex items-center justify-center shadow-md">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 text-sm">{participant.name}</h3>
              <p className="text-xs text-gray-600">{participant.age}歳</p>
              <div className="flex items-center gap-1 mt-1">
                <Award className="h-3 w-3 text-yellow-500" />
                <span className="text-xs text-gray-500">レベル {participant.level}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            {hasEvaluations ? (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm font-bold text-gray-800">{averageRating}</span>
              </div>
            ) : (
              <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200 text-xs">
                未評価
              </Badge>
            )}
          </div>
        </div>
        
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">{participant.profile}</p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {participant.badges.map((badge) => (
            <Badge key={badge} variant="outline" className="text-xs bg-slate-50 text-slate-600 border-slate-200">
              {badge}
            </Badge>
          ))}
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {hasEvaluations && (
              <div className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3 text-gray-400" />
                <span className="text-xs text-gray-500">{evaluations.length}件の評価</span>
              </div>
            )}
          </div>
          <Link href={`/organizer/participants/${participant.id}`}>
            <Button size="sm" className="bg-gradient-to-r from-slate-500 to-gray-600 hover:from-slate-600 hover:to-gray-700 text-white text-xs px-3 py-1 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105">
              {hasEvaluations ? '評価を確認' : '評価する'}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
});
