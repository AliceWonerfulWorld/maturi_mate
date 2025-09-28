'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Plus, Calendar, Clock, MapPin, Users, Gift, Tag } from 'lucide-react';
import Link from 'next/link';
import { dummyFestivals } from '@/lib/dummy-data';
import { Breadcrumb } from '@/components/ui/breadcrumb';

export default function FestivalTaskRegisterPage() {
  const router = useRouter();
  const params = useParams();
  const festivalId = params.festivalId as string;
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    capacity: '',
    reward: '',
    tags: ''
  });

  // 祭り情報を取得
  const festival = dummyFestivals.find(f => f.id === festivalId);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // ダミーデータとして新しいタスクを追加
    const newTask = {
      id: `task${Date.now()}`,
      title: formData.title,
      description: formData.description,
      date: formData.date,
      time: formData.time,
      location: formData.location || festival?.location || '',
      capacity: parseInt(formData.capacity),
      currentParticipants: 0,
      reward: formData.reward,
      createdBy: 'org1',
      organizerName: '中央区まつり実行委員会',
      status: 'open' as const,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      applicants: [],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    // 実際のアプリでは、ここでAPIに送信
    console.log('新しいタスクを登録:', newTask);
    
    // 成功後、祭り詳細に戻る
    router.push(`/organizer/festivals/${festivalId}`);
  };

  if (!festival) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-50 flex items-center justify-center">
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">祭りが見つかりません</p>
            <Link href="/organizer/festivals" className="text-slate-600 hover:text-slate-700 mt-2 inline-block">
              祭り一覧に戻る
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-50">
      {/* 背景装飾 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-slate-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gray-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-1000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-slate-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
      </div>

      {/* ヘッダー */}
      <header className="relative z-10 bg-white/80 backdrop-blur-sm shadow-lg border-b border-white/20">
        <div className="max-w-md mx-auto px-3 py-3">
          <div className="flex items-center justify-between mb-1">
            <Link href={`/organizer/festivals/${festivalId}`} >
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-slate-600 hover:bg-slate-100/50 rounded-full p-2 opacity-80 hover:opacity-100 transition-all duration-200">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex-1"></div>
          </div>
          {/* パンくずリスト */}
          <div className="mb-4">
            <Breadcrumb
              items={[
                { label: "祭り一覧", href: "/organizer/festivals" },
                { label: festival.name, href: `/organizer/festivals/${festivalId}` },
                { label: "タスク登録", isActive: true }
              ]}
              className="justify-center"
            />
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-slate-600 to-gray-700 rounded-full mb-2 shadow-lg">
              <Plus className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-slate-700 to-gray-800 bg-clip-text text-transparent mb-1">
              タスク登録
            </h1>
            <p className="text-xs text-gray-600 bg-white/50 backdrop-blur-sm px-3 py-1 rounded-full inline-block">
              {festival.name}
            </p>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-md mx-auto px-4 py-6">
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-800">タスク情報を入力</CardTitle>
            <CardDescription className="text-gray-600">
              祭りの準備で必要な人手を募集しましょう
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* タスク名 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Tag className="h-4 w-4 mr-2 text-slate-600" />
                  タスク名
                </label>
                <Input
                  type="text"
                  placeholder="例: 夏祭り 屋台設営のお手伝い"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="bg-white/80 border-slate-200 focus:border-slate-500 focus:ring-slate-500"
                  required
                />
              </div>

              {/* 内容 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Tag className="h-4 w-4 mr-2 text-slate-600" />
                  内容
                </label>
                <Textarea
                  placeholder="タスクの詳細を説明してください..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="bg-white/80 border-slate-200 focus:border-slate-500 focus:ring-slate-500 min-h-[100px] resize-none"
                  required
                />
              </div>

              {/* 日時 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-slate-600" />
                    日付
                  </label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className="bg-white/80 border-slate-200 focus:border-slate-500 focus:ring-slate-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-slate-600" />
                    時間
                  </label>
                  <Input
                    type="text"
                    placeholder="例: 09:00-12:00"
                    value={formData.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                    className="bg-white/80 border-slate-200 focus:border-slate-500 focus:ring-slate-500"
                    required
                  />
                </div>
              </div>

              {/* 場所 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-slate-600" />
                  場所
                </label>
                <Input
                  type="text"
                  placeholder={festival.location}
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="bg-white/80 border-slate-200 focus:border-slate-500 focus:ring-slate-500"
                />
              </div>

              {/* 募集人数 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Users className="h-4 w-4 mr-2 text-slate-600" />
                  募集人数
                </label>
                <Input
                  type="number"
                  placeholder="例: 5"
                  min="1"
                  value={formData.capacity}
                  onChange={(e) => handleInputChange('capacity', e.target.value)}
                  className="bg-white/80 border-slate-200 focus:border-slate-500 focus:ring-slate-500"
                  required
                />
              </div>

              {/* 報酬 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Gift className="h-4 w-4 mr-2 text-slate-600" />
                  報酬・特典
                </label>
                <Input
                  type="text"
                  placeholder="例: お弁当付き、交通費支給"
                  value={formData.reward}
                  onChange={(e) => handleInputChange('reward', e.target.value)}
                  className="bg-white/80 border-slate-200 focus:border-slate-500 focus:ring-slate-500"
                />
              </div>

              {/* タグ */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Tag className="h-4 w-4 mr-2 text-slate-600" />
                  タグ（カンマ区切り）
                </label>
                <Input
                  type="text"
                  placeholder="例: 屋台, 設営, 軽作業"
                  value={formData.tags}
                  onChange={(e) => handleInputChange('tags', e.target.value)}
                  className="bg-white/80 border-slate-200 focus:border-slate-500 focus:ring-slate-500"
                />
              </div>

              {/* 登録ボタン */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-slate-600 to-gray-700 hover:from-slate-700 hover:to-gray-800 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Plus className="h-4 w-4 mr-2" />
                タスクを登録
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
