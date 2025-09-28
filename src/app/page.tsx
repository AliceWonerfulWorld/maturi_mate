'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, UserCheck, Calendar, Plus, Star, Heart, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function RoleSelectorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-100">
      {/* 背景装飾 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-slate-300 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gray-300 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse delay-1000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-stone-300 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8">
        <div className="max-w-lg mx-auto w-full">
          {/* ヘッダー */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-slate-600 to-gray-700 rounded-full mb-4 sm:mb-6 shadow-lg">
              <Sparkles className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-700 to-gray-800 bg-clip-text text-transparent mb-3 sm:mb-4">
              Matsuri Mate
            </h1>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              まつりの準備運営における人手不足を解消する<br />
              <span className="font-semibold text-slate-700">ジョブマッチングアプリ</span>
            </p>
          </div>

          {/* ロール選択 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* 参加者（若者） */}
            <Link href="/participant">
              <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-0 shadow-xl h-full">
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-slate-500 to-gray-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Users className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl sm:text-2xl font-bold text-gray-800 group-hover:text-slate-600 transition-colors">
                        参加者（若者）
                      </CardTitle>
                      <CardDescription className="text-gray-600 text-sm sm:text-base">
                        まつりのタスクに参加したい方
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
                    <div className="flex items-center justify-center group/item">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-slate-100 rounded-lg flex items-center justify-center mr-2 sm:mr-3 group-hover/item:bg-slate-200 transition-colors flex-shrink-0">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-slate-600" />
                      </div>
                      <span>タスク一覧・検索</span>
                    </div>
                    <div className="flex items-center justify-center group/item">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-slate-100 rounded-lg flex items-center justify-center mr-2 sm:mr-3 group-hover/item:bg-slate-200 transition-colors flex-shrink-0">
                        <Users className="h-3 w-3 sm:h-4 sm:w-4 text-slate-600" />
                      </div>
                      <span>プロフィール管理</span>
                    </div>
                    <div className="flex items-center justify-center group/item">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-slate-100 rounded-lg flex items-center justify-center mr-2 sm:mr-3 group-hover/item:bg-slate-200 transition-colors flex-shrink-0">
                        <Star className="h-3 w-3 sm:h-4 sm:w-4 text-slate-600" />
                      </div>
                      <span>口コミ投稿</span>
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-slate-600 to-gray-700 hover:from-slate-700 hover:to-gray-800 text-white font-semibold py-2 sm:py-3 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-sm sm:text-base">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    参加者としてログイン
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* 運営者 */}
            <Link href="/organizer">
              <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-0 shadow-xl h-full">
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <UserCheck className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl sm:text-2xl font-bold text-gray-800 group-hover:text-amber-700 transition-colors">
                        運営者
                      </CardTitle>
                      <CardDescription className="text-gray-600 text-sm sm:text-base">
                        まつりのタスクを募集したい方
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
                    <div className="flex items-center justify-center group/item">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-amber-100 rounded-lg flex items-center justify-center mr-2 sm:mr-3 group-hover/item:bg-amber-200 transition-colors flex-shrink-0">
                        <Plus className="h-3 w-3 sm:h-4 sm:w-4 text-amber-600" />
                      </div>
                      <span>タスク登録</span>
                    </div>
                    <div className="flex items-center justify-center group/item">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-amber-100 rounded-lg flex items-center justify-center mr-2 sm:mr-3 group-hover/item:bg-amber-200 transition-colors flex-shrink-0">
                        <UserCheck className="h-3 w-3 sm:h-4 sm:w-4 text-amber-600" />
                      </div>
                      <span>タスク管理</span>
                    </div>
                    <div className="flex items-center justify-center group/item">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-amber-100 rounded-lg flex items-center justify-center mr-2 sm:mr-3 group-hover/item:bg-amber-200 transition-colors flex-shrink-0">
                        <Users className="h-3 w-3 sm:h-4 sm:w-4 text-amber-600" />
                      </div>
                      <span>応募者確認・承認</span>
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold py-2 sm:py-3 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-sm sm:text-base">
                    <UserCheck className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    運営者としてログイン
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* フッター */}
          <div className="text-center mt-8 sm:mt-12">
            <div className="inline-flex items-center space-x-2 text-gray-500 bg-white/50 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg">
              <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-red-400" />
              <span className="text-xs sm:text-sm font-medium">どちらの立場でご利用になりますか？</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}