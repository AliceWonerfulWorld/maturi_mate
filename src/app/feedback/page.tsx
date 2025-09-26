'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star } from 'lucide-react';
import Link from 'next/link';

export default function FeedbackPage() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    if (rating === 0) {
      alert('評価を選択してください');
      return;
    }
    if (comment.trim() === '') {
      alert('コメントを入力してください');
      return;
    }
    setIsSubmitted(true);
    // 実際のアプリケーションでは、ここでAPIを呼び出します
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Star className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">口コミを投稿しました！</h1>
          <p className="text-gray-600 mb-6">ご協力ありがとうございます。</p>
          <Link href="/">
            <Button>ホームに戻る</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center">
          <Link href="/" className="mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-semibold">口コミ投稿</h1>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle>タスクの感想を教えてください</CardTitle>
            <CardDescription>
              あなたの体験を他の参加者と共有しましょう
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 評価 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                評価
              </label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {rating === 0 && '評価を選択してください'}
                {rating === 1 && 'とても悪い'}
                {rating === 2 && '悪い'}
                {rating === 3 && '普通'}
                {rating === 4 && '良い'}
                {rating === 5 && 'とても良い'}
              </p>
            </div>

            {/* コメント */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                コメント
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="タスクの感想や体験を教えてください..."
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                {comment.length}/500文字
              </p>
            </div>

            {/* 投稿ボタン */}
            <Button
              onClick={handleSubmit}
              disabled={rating === 0 || comment.trim() === ''}
              className="w-full"
            >
              口コミを投稿する
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
