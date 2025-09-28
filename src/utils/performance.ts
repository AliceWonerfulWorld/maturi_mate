// パフォーマンス最適化用ユーティリティ

/**
 * 重い計算をメモ化するためのヘルパー
 */
export const memoize = <T extends (...args: any[]) => any>(fn: T): T => {
  const cache = new Map();
  
  return ((...args: any[]) => {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn(...args);
    cache.set(key, result);
    
    return result;
  }) as T;
};

/**
 * 仮想スクロール用のアイテム計算
 */
export const calculateVirtualItems = (
  totalItems: number,
  containerHeight: number,
  itemHeight: number,
  scrollTop: number
) => {
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(startIndex + visibleCount, totalItems);
  
  return {
    startIndex,
    endIndex,
    visibleCount,
    totalHeight: totalItems * itemHeight,
    offsetY: startIndex * itemHeight,
  };
};

/**
 * リサイズオブザーバー用のデバウンス
 */
export const debounceResize = (callback: () => void, delay: number = 100) => {
  let timeoutId: NodeJS.Timeout;
  
  return () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(callback, delay);
  };
};

/**
 * Intersection Observer用の設定
 */
export const intersectionObserverOptions = {
  root: null,
  rootMargin: '50px',
  threshold: 0.1,
};

/**
 * パフォーマンス測定用
 */
export const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`${name}: ${end - start}ms`);
  }
};
