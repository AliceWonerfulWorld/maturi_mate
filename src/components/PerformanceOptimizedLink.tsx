'use client';

import Link from 'next/link';
import { memo } from 'react';

interface PerformanceOptimizedLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

// パフォーマンス最適化されたLinkコンポーネント
export const PerformanceOptimizedLink = memo(function PerformanceOptimizedLink({
  href,
  children,
  className,
  onClick
}: PerformanceOptimizedLinkProps) {
  return (
    <Link 
      href={href} 
      className={className}
      onClick={onClick}
      // プリフェッチを有効にして高速化
      // prefetch={true} // デフォルトで有効
    >
      {children}
    </Link>
  );
});
