# 認証導線設計

## 📋 概要

Matsuri Mateアプリの認証システム設計とユーザーフローをまとめた文書です。現在のロール選択方式から、Firebase Auth導入時の自動遷移システムへの移行計画を含みます。

---

## 🔄 現在の認証フロー

### 現在の実装

```
ユーザーアクセス
    ↓
ロール選択画面 (/)
    ↓
[運営者選択] → 運営者ダッシュボード (/organizer)
[参加者選択] → 参加者ホーム (/participant)
```

**特徴:**
- 認証なしの状態でのアクセス
- 手動でのロール選択
- セッション管理なし
- データの永続化なし

---

## 🎯 目標の認証フロー

### Firebase Auth導入後のフロー

```
ユーザーアクセス
    ↓
認証状態チェック
    ↓
[未認証] → ログイン画面
[認証済み] → ユーザーロール確認
    ↓
[participant] → 参加者ダッシュボード (/participant)
[organizer] → 運営者ダッシュボード (/organizer)
```

**特徴:**
- 自動的なロール判定
- セッション永続化
- セキュリティ強化
- パーソナライズされた体験

---

## 🏗️ 認証システム設計

### 1. Firebase Auth設定

```typescript
// src/lib/auth.ts
import { 
  getAuth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';

export const auth = getAuth();

// 認証プロバイダー
export const googleProvider = new GoogleAuthProvider();

// 認証状態の監視
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
```

### 2. 認証コンテキスト

```typescript
// src/contexts/AuthContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, onAuthStateChange } from '@/lib/auth';
import { db } from '@/lib/firebase';

interface User {
  uid: string;
  email: string;
  role: 'participant' | 'organizer';
  profile: {
    name: string;
    age?: number;
    profile?: string;
    level: number;
    badges: string[];
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, role: 'participant' | 'organizer') => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      if (firebaseUser) {
        // ユーザー情報をFirestoreから取得
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            role: userData.role,
            profile: userData
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string, role: 'participant' | 'organizer') => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    
    // ユーザー情報をFirestoreに保存
    await setDoc(doc(db, 'users', user.uid), {
      email,
      role,
      name: email.split('@')[0], // デフォルト名
      level: 1,
      badges: [],
      createdAt: new Date(),
      updatedAt: new Date()
    });
  };

  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const signOut = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      signUp,
      signInWithGoogle,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

### 3. 認証ガード

```typescript
// src/components/AuthGuard.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  allowedRoles?: ('participant' | 'organizer')[];
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requireAuth = true,
  allowedRoles = []
}) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (requireAuth && !user) {
      router.push('/auth/login');
      return;
    }

    if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
      router.push('/unauthorized');
      return;
    }
  }, [user, loading, requireAuth, allowedRoles, router]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (requireAuth && !user) {
    return null;
  }

  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
};
```

---

## 📱 認証画面設計

### 1. ログイン画面

```typescript
// src/app/auth/login/page.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signIn, signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signIn(email, password);
      // 認証成功後はAuthProviderで自動リダイレクト
    } catch (err) {
      setError('ログインに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      setError('Googleログインに失敗しました');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100">
      <Card className="w-full max-w-md p-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">ログイン</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="メールアドレス"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="パスワード"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'ログイン中...' : 'ログイン'}
            </Button>
          </form>
          
          <div className="mt-4">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleGoogleSignIn}
            >
              Googleでログイン
            </Button>
          </div>
          
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
          
          <div className="mt-4 text-center">
            <Link href="/auth/signup" className="text-sm text-blue-600">
              アカウントを作成
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

### 2. サインアップ画面

```typescript
// src/app/auth/signup/page.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'participant' as 'participant' | 'organizer'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('パスワードが一致しません');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await signUp(formData.email, formData.password, formData.role);
      // 認証成功後はAuthProviderで自動リダイレクト
    } catch (err) {
      setError('アカウント作成に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100">
      <Card className="w-full max-w-md p-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">アカウント作成</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="メールアドレス"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
            <Input
              type="password"
              placeholder="パスワード"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
            <Input
              type="password"
              placeholder="パスワード確認"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              required
            />
            
            <div className="space-y-2">
              <label className="text-sm font-medium">ロール選択</label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={formData.role === 'participant' ? 'default' : 'outline'}
                  onClick={() => setFormData({...formData, role: 'participant'})}
                  className="flex-1"
                >
                  参加者
                </Button>
                <Button
                  type="button"
                  variant={formData.role === 'organizer' ? 'default' : 'outline'}
                  onClick={() => setFormData({...formData, role: 'organizer'})}
                  className="flex-1"
                >
                  運営者
                </Button>
              </div>
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? '作成中...' : 'アカウント作成'}
            </Button>
          </form>
          
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
          
          <div className="mt-4 text-center">
            <Link href="/auth/login" className="text-sm text-blue-600">
              すでにアカウントをお持ちの方はこちら
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## 🔄 自動リダイレクトシステム

### 1. ルートレイアウトの修正

```typescript
// src/app/layout.tsx
'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import { AuthGuard } from '@/components/AuthGuard';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <AuthProvider>
          <AuthGuard requireAuth={false}>
            {children}
          </AuthGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
```

### 2. 自動リダイレクトコンポーネント

```typescript
// src/components/AutoRedirect.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const AutoRedirect: React.FC = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (user) {
      // ユーザーのロールに基づいて自動リダイレクト
      if (user.role === 'participant') {
        router.push('/participant');
      } else if (user.role === 'organizer') {
        router.push('/organizer');
      }
    } else {
      // 未認証の場合はログイン画面へ
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  return <LoadingSpinner />;
};
```

### 3. メインページの修正

```typescript
// src/app/page.tsx
'use client';

import { AutoRedirect } from '@/components/AutoRedirect';

export default function HomePage() {
  return <AutoRedirect />;
}
```

---

## 🛡️ セキュリティ考慮事項

### 1. 認証状態の管理

```typescript
// セッション永続化
const auth = getAuth();
auth.setPersistence(browserLocalPersistence);

// 認証状態の監視
onAuthStateChanged(auth, (user) => {
  if (user) {
    // 認証済みユーザーの処理
    console.log('ユーザーがログインしました:', user.uid);
  } else {
    // 未認証ユーザーの処理
    console.log('ユーザーがログアウトしました');
  }
});
```

### 2. ロールベースアクセス制御

```typescript
// src/hooks/useRole.ts
import { useAuth } from '@/contexts/AuthContext';

export const useRole = () => {
  const { user } = useAuth();
  
  const isParticipant = user?.role === 'participant';
  const isOrganizer = user?.role === 'organizer';
  const hasRole = (role: 'participant' | 'organizer') => user?.role === role;
  
  return {
    isParticipant,
    isOrganizer,
    hasRole,
    userRole: user?.role
  };
};
```

### 3. 保護されたルート

```typescript
// src/app/organizer/layout.tsx
'use client';

import { AuthGuard } from '@/components/AuthGuard';

export default function OrganizerLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard allowedRoles={['organizer']}>
      {children}
    </AuthGuard>
  );
}
```

---

## 📊 移行計画

### フェーズ1: 認証基盤の構築
- [ ] Firebase Auth設定
- [ ] 認証コンテキスト作成
- [ ] ログイン・サインアップ画面作成
- [ ] 認証ガード実装

### フェーズ2: 段階的移行
- [ ] 認証機能のテスト実装
- [ ] 既存画面への認証ガード追加
- [ ] ロールベースアクセス制御実装
- [ ] 自動リダイレクトシステム実装

### フェーズ3: 完全移行
- [ ] ロール選択画面の削除
- [ ] 認証必須化
- [ ] セキュリティテスト
- [ ] ユーザビリティテスト

---

## 🧪 テスト戦略

### 1. 認証フローテスト

```typescript
// __tests__/auth.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { AuthProvider } from '@/contexts/AuthContext';
import LoginPage from '@/app/auth/login/page';

describe('認証フロー', () => {
  test('ログイン成功時にダッシュボードにリダイレクト', async () => {
    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    );

    fireEvent.change(screen.getByPlaceholderText('メールアドレス'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('パスワード'), {
      target: { value: 'password123' }
    });
    fireEvent.click(screen.getByText('ログイン'));

    // リダイレクトの確認
    expect(window.location.pathname).toBe('/participant');
  });
});
```

### 2. ロールベースアクセステスト

```typescript
describe('ロールベースアクセス', () => {
  test('運営者以外は運営者画面にアクセスできない', () => {
    const mockUser = { role: 'participant' };
    render(
      <AuthProvider value={{ user: mockUser }}>
        <AuthGuard allowedRoles={['organizer']}>
          <div>運営者専用コンテンツ</div>
        </AuthGuard>
      </AuthProvider>
    );

    expect(screen.queryByText('運営者専用コンテンツ')).not.toBeInTheDocument();
  });
});
```

---

## 📝 移行チェックリスト

### 準備段階
- [ ] Firebase プロジェクトにAuthentication有効化
- [ ] 認証プロバイダー設定（Email/Password, Google）
- [ ] Firestore セキュリティルール更新
- [ ] 認証コンテキスト実装

### 実装段階
- [ ] ログイン・サインアップ画面作成
- [ ] 認証ガードコンポーネント実装
- [ ] 自動リダイレクトシステム実装
- [ ] ロールベースアクセス制御実装

### テスト段階
- [ ] 認証フローのテスト
- [ ] セキュリティテスト
- [ ] ユーザビリティテスト
- [ ] パフォーマンステスト

### 移行段階
- [ ] 段階的リリース
- [ ] ユーザーサポート準備
- [ ] ロールバック計画
- [ ] 監視・ログ設定

---

*最終更新: 2024年12月*
