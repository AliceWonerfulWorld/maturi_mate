'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface HomeButtonProps {
  href?: string;
  className?: string;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'ghost' | 'default' | 'outline';
}

export default function HomeButton({ 
  href = '/', 
  className = '', 
  size = 'sm',
  variant = 'ghost'
}: HomeButtonProps) {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    setOpen(false);
    // Next.jsのルーターを使って遷移
    if (typeof window !== 'undefined') {
      window.location.href = href;
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button 
          variant={variant} 
          size={size} 
          className={`text-gray-500 hover:text-slate-600 hover:bg-slate-100/50 rounded-full p-2 opacity-80 hover:opacity-100 transition-all duration-200 ${className}`}
        >
          <Home className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-sm mx-auto p-6">
        <AlertDialogHeader className="text-center space-y-3">
          <AlertDialogTitle className="text-xl font-bold text-gray-800">
            ホームに戻る
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600 leading-relaxed">
            ロール選択画面に戻りますか？
            <br />
            <span className="text-sm text-gray-500">
              現在の作業内容は保存されません。
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col sm:flex-row justify-center gap-3 pt-4 w-full">
          <AlertDialogCancel className="w-full sm:flex-1 sm:max-w-[120px] bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 py-2">
            キャンセル
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm}
            className="w-full sm:flex-1 sm:max-w-[140px] bg-gradient-to-r from-slate-600 to-gray-700 hover:from-slate-700 hover:to-gray-800 text-white py-2"
          >
            ホームに戻る
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
