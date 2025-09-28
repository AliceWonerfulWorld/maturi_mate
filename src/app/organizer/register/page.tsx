'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';

export default function OrganizerTaskRegisterPage() {
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
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.date || !formData.time || !formData.location || !formData.capacity) {
      alert('必須項目を入力してください');
      return;
    }
    setIsSubmitted(true);
    // 実際のアプリケーションでは、ここでAPIを呼び出します
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Plus className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">タスクを登録しました！</h1>
          <p className="text-gray-600 mb-6">応募者からの連絡をお待ちください。</p>
          <div className="space-x-4">
            <Link href="/organizer">
              <Button>管理画面へ</Button>
            </Link>
            <Link href="/organizer/register">
              <Button variant="outline">もう一つ登録</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-3 py-3 flex items-center">
          <Link href="/organizer" className="mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-semibold">タスク登録</h1>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle>新しいタスクを登録</CardTitle>
            <CardDescription>
              まつりの準備で必要な人手を募集しましょう
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* タスク名 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  タスク名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="例: 夏祭り 屋台設営のお手伝い"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* 内容 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  内容 <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="タスクの詳細を説明してください..."
                  className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  required
                />
              </div>

              {/* 日時 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    日付 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    時間 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* 場所 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  場所 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="例: 中央公園"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* 人数 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  募集人数 <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  placeholder="例: 5"
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* 報酬 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  報酬・特典
                </label>
                <input
                  type="text"
                  name="reward"
                  value={formData.reward}
                  onChange={handleInputChange}
                  placeholder="例: お弁当付き、交通費支給"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* タグ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  タグ（カンマ区切り）
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="例: 屋台, 設営, 軽作業"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* 投稿ボタン */}
              <Button type="submit" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                タスクを登録する
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
