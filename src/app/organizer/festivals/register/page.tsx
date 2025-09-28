'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Calendar, MapPin, FileText, Plus } from 'lucide-react';
import Link from 'next/link';
import { dummyFestivals } from '@/lib/dummy-data';

export default function FestivalRegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    location: '',
    description: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // ダミーデータとして新しい祭りを追加
    const newFestival = {
      id: `festival${Date.now()}`,
      name: formData.name,
      date: formData.date,
      time: formData.time,
      location: formData.location,
      description: formData.description,
      createdBy: 'org1',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    // 実際のアプリでは、ここでAPIに送信
    console.log('新しい祭りを登録:', newFestival);
    
    // 成功後、祭り一覧に戻る
    router.push('/organizer/festivals');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-50">
      {/* 背景装飾 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-300 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse delay-1000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-amber-300 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse delay-500"></div>
      </div>

      {/* ヘッダー */}
      <header className="relative z-10 bg-white/80 backdrop-blur-sm shadow-lg border-b border-white/20">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <Link href="/organizer/festivals" prefetch={false}>
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-amber-600 hover:bg-amber-100/50 rounded-full p-2 opacity-80 hover:opacity-100 transition-all duration-200">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex-1"></div>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full mb-2 shadow-lg">
              <Plus className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-amber-700 to-orange-700 bg-clip-text text-transparent mb-1">
              祭り登録
            </h1>
            <p className="text-xs text-gray-600 bg-white/50 backdrop-blur-sm px-3 py-1 rounded-full inline-block">
              新しい祭りを登録します
            </p>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-md mx-auto px-4 py-6">
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-800">祭り情報を入力</CardTitle>
            <CardDescription className="text-gray-600">
              祭りの基本情報を入力してください
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 祭り名 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-amber-600" />
                  祭り名
                </label>
                <Input
                  type="text"
                  placeholder="例: 中央区夏祭り"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="bg-white/80 border-amber-200 focus:border-amber-500 focus:ring-amber-500"
                  required
                />
              </div>

              {/* 開催日 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-amber-600" />
                  開催日
                </label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="bg-white/80 border-amber-200 focus:border-amber-500 focus:ring-amber-500"
                  required
                />
              </div>

              {/* 開催時間 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-amber-600" />
                  開催時間
                </label>
                <Input
                  type="text"
                  placeholder="例: 09:00-21:00"
                  value={formData.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  className="bg-white/80 border-amber-200 focus:border-amber-500 focus:ring-amber-500"
                  required
                />
              </div>

              {/* 開催場所 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-amber-600" />
                  開催場所
                </label>
                <Input
                  type="text"
                  placeholder="例: 中央公園"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="bg-white/80 border-amber-200 focus:border-amber-500 focus:ring-amber-500"
                  required
                />
              </div>

              {/* 詳細 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-amber-600" />
                  詳細
                </label>
                <Textarea
                  placeholder="祭りの詳細な説明を入力してください..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="bg-white/80 border-amber-200 focus:border-amber-500 focus:ring-amber-500 min-h-[100px] resize-none"
                  required
                />
              </div>

              {/* 登録ボタン */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Plus className="h-4 w-4 mr-2" />
                祭りを登録
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
