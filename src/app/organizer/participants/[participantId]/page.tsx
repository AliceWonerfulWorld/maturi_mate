'use client';

import { useState, useMemo, memo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Users, Star, Award, ArrowLeft, MessageSquare, ThumbsUp, UserCheck, TrendingUp, Calendar } from 'lucide-react';
import { dummyApplicants, dummyOrganizerEvaluations, dummyTasks } from '@/lib/dummy-data';
import { Applicant, OrganizerEvaluation, Task } from '@/types';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function ParticipantEvaluationPage() {
  const params = useParams();
  const participantId = params.participantId as string;
  
  const [evaluationForm, setEvaluationForm] = useState({
    rating: 5,
    comment: '',
    status: 'good' as 'excellent' | 'good' | 'average' | 'poor',
    skills: [] as string[],
    improvements: [] as string[]
  });

  // 参加者情報を取得
  const participant = useMemo(() => {
    return dummyApplicants.find(p => p.id === participantId);
  }, [participantId]);

  // 参加者の評価履歴を取得
  const evaluations = useMemo(() => {
    return dummyOrganizerEvaluations.filter(evaluation => evaluation.participantId === participantId);
  }, [participantId]);

  // 参加者の関連タスクを取得
  const relatedTasks = useMemo(() => {
    return dummyTasks.filter(task => {
      // 簡単な関連付け（実際のアプリではより複雑なロジック）
      return task.createdBy === 'org1'; // 現在の運営者のタスク
    });
  }, []);

  const handleSubmitEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!evaluationForm.comment.trim()) {
      alert('評価コメントを入力してください');
      return;
    }

    // 新しい評価を作成
    const newEvaluation: OrganizerEvaluation = {
      id: `eval${Date.now()}`,
      participantId: participantId,
      organizerId: 'org1', // 現在の運営者
      organizerName: '中央区まつり実行委員会',
      taskId: relatedTasks[0]?.id || '1',
      taskTitle: relatedTasks[0]?.title || 'タスク',
      rating: evaluationForm.rating,
      comment: evaluationForm.comment,
      status: evaluationForm.status,
      createdAt: new Date().toISOString().split('T')[0],
      skills: evaluationForm.skills,
      improvements: evaluationForm.improvements
    };

    console.log('新しい評価を投稿:', newEvaluation);
    alert('評価を投稿しました！');
    
    // フォームをリセット
    setEvaluationForm({
      rating: 5,
      comment: '',
      status: 'good',
      skills: [],
      improvements: []
    });
  };

  if (!participant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-50 flex items-center justify-center">
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">参加者が見つかりません</p>
            <Link href="/organizer/participants" className="text-blue-600 hover:text-blue-700 mt-2 inline-block">
              参加者一覧に戻る
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

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
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <Link href="/organizer/participants" prefetch={false}>
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-slate-600 hover:bg-slate-100/50 rounded-full p-2 opacity-80 hover:opacity-100 transition-all duration-200">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex-1"></div>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-slate-500 to-gray-600 rounded-full mb-3 shadow-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">{participant.name}</h1>
            <p className="text-sm text-gray-600">{participant.age}歳 • レベル {participant.level}</p>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-md mx-auto px-4 py-6 pb-32">
        {/* 参加者情報 */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl mb-6">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-800 flex items-center">
              <UserCheck className="h-5 w-5 mr-2 text-blue-500" />
              参加者情報
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600 leading-relaxed">{participant.profile}</p>
            
            <div className="flex flex-wrap gap-2">
              {participant.badges.map((badge) => (
                <Badge key={badge} variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                  <Award className="h-3 w-3 mr-1" />
                  {badge}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 評価履歴 */}
        {evaluations.length > 0 && (
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl mb-6">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-gray-800 flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-green-500" />
                評価履歴 ({evaluations.length}件)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {evaluations.map((evaluation) => (
                <EvaluationCard key={evaluation.id} evaluation={evaluation} />
              ))}
            </CardContent>
          </Card>
        )}

        {/* 新規評価フォーム */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-800 flex items-center">
              <Star className="h-5 w-5 mr-2 text-yellow-500" />
              新規評価
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitEvaluation} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">評価</label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setEvaluationForm({...evaluationForm, rating})}
                      className={`transition-colors duration-200 ${
                        rating <= evaluationForm.rating
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    >
                      <Star className="h-6 w-6 fill-current" />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">{evaluationForm.rating}/5</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">評価ステータス</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'excellent', label: '優秀', color: 'bg-green-500' },
                    { value: 'good', label: '良好', color: 'bg-blue-500' },
                    { value: 'average', label: '普通', color: 'bg-yellow-500' },
                    { value: 'poor', label: '要改善', color: 'bg-red-500' }
                  ].map((status) => (
                    <Button
                      key={status.value}
                      type="button"
                      variant={evaluationForm.status === status.value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setEvaluationForm({...evaluationForm, status: status.value as any})}
                      className={`text-xs ${
                        evaluationForm.status === status.value 
                          ? `${status.color} text-white` 
                          : 'bg-white/80 border-gray-200 text-gray-600'
                      }`}
                    >
                      {status.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">評価コメント</label>
                <Textarea
                  value={evaluationForm.comment}
                  onChange={(e) => setEvaluationForm({...evaluationForm, comment: e.target.value})}
                  placeholder="参加者のパフォーマンスについて評価してください..."
                  rows={4}
                  className="bg-white/80 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-slate-500 to-gray-600 hover:from-slate-600 hover:to-gray-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <ThumbsUp className="h-4 w-4 mr-2" />
                評価を投稿
              </Button>
            </form>
          </CardContent>
        </Card>
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

// 評価カードコンポーネント
const EvaluationCard = memo(function EvaluationCard({ evaluation }: { evaluation: OrganizerEvaluation }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-500 text-white';
      case 'good': return 'bg-blue-500 text-white';
      case 'average': return 'bg-yellow-500 text-white';
      case 'poor': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'excellent': return '優秀';
      case 'good': return '良好';
      case 'average': return '普通';
      case 'poor': return '要改善';
      default: return '未評価';
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h4 className="font-semibold text-gray-800 text-sm">{evaluation.organizerName}</h4>
            <p className="text-xs text-gray-500">{evaluation.taskTitle}</p>
            <p className="text-xs text-gray-500">{evaluation.createdAt}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {Array.from({ length: evaluation.rating }, (_, i) => (
                <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />
              ))}
              {Array.from({ length: 5 - evaluation.rating }, (_, i) => (
                <Star key={i} className="h-3 w-3 text-gray-300" />
              ))}
            </div>
            <Badge className={`text-xs ${getStatusColor(evaluation.status)}`}>
              {getStatusLabel(evaluation.status)}
            </Badge>
          </div>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">{evaluation.comment}</p>
        
        {evaluation.skills && evaluation.skills.length > 0 && (
          <div className="mt-3">
            <div className="flex flex-wrap gap-1">
              {evaluation.skills.map((skill, index) => (
                <Badge key={index} variant="outline" className="text-xs bg-green-50 text-green-600 border-green-200">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
});
