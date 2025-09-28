# Firestore移行ガイド

## 📋 概要

Matsuri MateアプリをFirestoreに移行する際のデータ構造設計と移行手順をまとめたガイドです。

---

## 🗂️ Firestoreデータ構造

### コレクション構成

```
/users/{userId}
/festivals/{festivalId}
  /tasks/{taskId}
  /reviews/{reviewId}
/applications/{applicationId}
```

### 1. Usersコレクション

```typescript
interface User {
  id: string; // ドキュメントID
  name: string;
  age: number;
  role: 'participant' | 'organizer';
  profile: string;
  level: number;
  badges: string[];
  email: string; // Firebase Auth連携
  createdAt: Timestamp;
  updatedAt: Timestamp;
  // プロフィール拡張
  profileImage?: string;
  phoneNumber?: string;
  location?: string;
  // 統計情報
  stats: {
    participatedTasks: number;
    organizedFestivals: number;
    totalReviews: number;
    averageRating: number;
  };
}
```

### 2. Festivalsコレクション

```typescript
interface Festival {
  id: string; // ドキュメントID
  name: string;
  date: string; // ISO形式
  time: string;
  location: string;
  description: string;
  createdBy: string; // organizerId (User参照)
  createdAt: Timestamp;
  updatedAt: Timestamp;
  // 拡張フィールド
  images?: string[]; // 画像URL配列
  tags?: string[]; // 祭りタグ
  status: 'draft' | 'published' | 'completed' | 'cancelled';
  maxParticipants?: number;
  currentParticipants: number;
  // 地理情報
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  // 統計情報
  stats: {
    totalTasks: number;
    totalApplications: number;
    averageRating: number;
    reviewCount: number;
  };
}
```

### 3. Tasksコレクション（Festivalsのサブコレクション）

```typescript
interface Task {
  id: string; // ドキュメントID
  title: string;
  description: string;
  date: string; // ISO形式
  time: string;
  location: string;
  capacity: number;
  currentParticipants: number;
  reward: string;
  createdBy: string; // organizerId (User参照)
  festivalId: string; // 親FestivalのID
  status: 'open' | 'closed' | 'completed';
  tags: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  // 拡張フィールド
  requirements?: string[]; // 参加要件
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedDuration: number; // 分単位
  // 地理情報
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}
```

### 4. Reviewsコレクション（Festivalsのサブコレクション）

```typescript
interface FestivalReview {
  id: string; // ドキュメントID
  festivalId: string; // 親FestivalのID
  userId: string; // User参照
  comment: string;
  rating: number; // 1-5
  createdAt: Timestamp;
  updatedAt: Timestamp;
  // 拡張フィールド
  images?: string[]; // 画像URL配列
  tags?: string[]; // レビュータグ
  helpfulCount: number; // 役に立った数
  reply?: { // 運営者からの返信
    content: string;
    repliedAt: Timestamp;
    repliedBy: string; // organizerId
  };
  // モデレーション
  isApproved: boolean;
  moderatedAt?: Timestamp;
  moderatedBy?: string;
}
```

### 5. Applicationsコレクション

```typescript
interface Application {
  id: string; // ドキュメントID
  taskId: string; // Task参照
  userId: string; // User参照
  festivalId: string; // Festival参照（検索用）
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: Timestamp;
  processedAt?: Timestamp;
  processedBy?: string; // organizerId
  // 応募時の追加情報
  message?: string; // 応募メッセージ
  experience?: string; // 経験・スキル
  availability?: string; // 参加可能時間
}
```

---

## 🔄 データ正規化の原則

### 1. 参照関係の整理

```typescript
// 正規化前（冗長）
interface Task {
  organizerName: string; // 冗長
  authorName: string; // 冗長
}

// 正規化後（参照）
interface Task {
  createdBy: string; // User ID参照
}

interface FestivalReview {
  userId: string; // User ID参照
}
```

### 2. サブコレクションの活用

```
/festivals/{festivalId}/tasks/{taskId}
/festivals/{festivalId}/reviews/{reviewId}
```

**メリット:**
- 祭り単位でのデータ管理が容易
- クエリの効率化
- セキュリティルールの簡素化

### 3. 統計情報の集約

```typescript
// リアルタイム計算を避けるため、統計情報を集約
interface Festival {
  stats: {
    totalTasks: number;
    totalApplications: number;
    averageRating: number;
    reviewCount: number;
  };
}

interface User {
  stats: {
    participatedTasks: number;
    organizedFestivals: number;
    totalReviews: number;
    averageRating: number;
  };
}
```

---

## 🔍 クエリパターン

### 1. 基本的なクエリ

```typescript
// 祭り一覧取得（作成日順）
const festivals = await db.collection('festivals')
  .where('status', '==', 'published')
  .orderBy('createdAt', 'desc')
  .limit(20)
  .get();

// 特定の祭りのタスク一覧
const tasks = await db.collection('festivals')
  .doc(festivalId)
  .collection('tasks')
  .where('status', '==', 'open')
  .orderBy('date', 'asc')
  .get();

// ユーザーの応募履歴
const applications = await db.collection('applications')
  .where('userId', '==', userId)
  .orderBy('appliedAt', 'desc')
  .get();
```

### 2. 複合クエリ

```typescript
// 特定の祭りのレビュー（高評価順）
const reviews = await db.collection('festivals')
  .doc(festivalId)
  .collection('reviews')
  .where('isApproved', '==', true)
  .orderBy('rating', 'desc')
  .orderBy('createdAt', 'desc')
  .get();

// 特定の運営者の祭り一覧
const organizerFestivals = await db.collection('festivals')
  .where('createdBy', '==', organizerId)
  .where('status', 'in', ['published', 'completed'])
  .orderBy('createdAt', 'desc')
  .get();
```

### 3. 集約クエリ

```typescript
// 祭りの統計情報更新
const updateFestivalStats = async (festivalId: string) => {
  const [tasks, reviews, applications] = await Promise.all([
    db.collection('festivals').doc(festivalId).collection('tasks').get(),
    db.collection('festivals').doc(festivalId).collection('reviews').get(),
    db.collection('applications').where('festivalId', '==', festivalId).get()
  ]);

  const averageRating = reviews.docs.reduce((sum, doc) => {
    return sum + doc.data().rating;
  }, 0) / reviews.docs.length || 0;

  await db.collection('festivals').doc(festivalId).update({
    stats: {
      totalTasks: tasks.size,
      totalApplications: applications.size,
      averageRating: Math.round(averageRating * 10) / 10,
      reviewCount: reviews.size
    }
  });
};
```

---

## 🔐 セキュリティルール

### 1. 基本的なセキュリティルール

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // ユーザー情報
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null; // 他のユーザー情報は読み取り可能
    }

    // 祭り情報
    match /festivals/{festivalId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && 
        request.auth.uid == resource.data.createdBy;
      allow update: if request.auth != null && 
        request.auth.uid == resource.data.createdBy;
      allow delete: if request.auth != null && 
        request.auth.uid == resource.data.createdBy;

      // 祭りのタスク
      match /tasks/{taskId} {
        allow read: if request.auth != null;
        allow create: if request.auth != null && 
          request.auth.uid == get(/databases/$(database)/documents/festivals/$(festivalId)).data.createdBy;
        allow update: if request.auth != null && 
          request.auth.uid == get(/databases/$(database)/documents/festivals/$(festivalId)).data.createdBy;
      }

      // 祭りのレビュー
      match /reviews/{reviewId} {
        allow read: if request.auth != null;
        allow create: if request.auth != null && 
          request.auth.uid == resource.data.userId;
        allow update: if request.auth != null && 
          request.auth.uid == resource.data.userId;
      }
    }

    // 応募情報
    match /applications/{applicationId} {
      allow read: if request.auth != null && 
        (request.auth.uid == resource.data.userId || 
         isOrganizer(resource.data.festivalId));
      allow create: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow update: if request.auth != null && 
        isOrganizer(resource.data.festivalId);
    }

    // 運営者判定関数
    function isOrganizer(festivalId) {
      return request.auth.uid == 
        get(/databases/$(database)/documents/festivals/$(festivalId)).data.createdBy;
    }
  }
}
```

---

## 🚀 移行手順

### 1. 準備フェーズ

1. **Firebase プロジェクト作成**
   ```bash
   npm install firebase
   ```

2. **Firebase設定**
   ```typescript
   // src/lib/firebase.ts
   import { initializeApp } from 'firebase/app';
   import { getFirestore } from 'firebase/firestore';
   import { getAuth } from 'firebase/auth';

   const firebaseConfig = {
     // 設定値
   };

   const app = initializeApp(firebaseConfig);
   export const db = getFirestore(app);
   export const auth = getAuth(app);
   ```

### 2. データ移行スクリプト

```typescript
// scripts/migrate-data.ts
import { db } from '../src/lib/firebase';
import { collection, doc, setDoc, writeBatch } from 'firebase/firestore';

const migrateDummyData = async () => {
  const batch = writeBatch(db);

  // ユーザーデータ移行
  dummyUsers.forEach(user => {
    const userRef = doc(db, 'users', user.id);
    batch.set(userRef, {
      ...user,
      createdAt: new Date(),
      updatedAt: new Date(),
      stats: {
        participatedTasks: 0,
        organizedFestivals: 0,
        totalReviews: 0,
        averageRating: 0
      }
    });
  });

  // 祭りデータ移行
  dummyFestivals.forEach(festival => {
    const festivalRef = doc(db, 'festivals', festival.id);
    batch.set(festivalRef, {
      ...festival,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'published',
      currentParticipants: 0,
      stats: {
        totalTasks: 0,
        totalApplications: 0,
        averageRating: 0,
        reviewCount: 0
      }
    });
  });

  await batch.commit();
  console.log('データ移行完了');
};
```

### 3. 段階的移行

1. **フェーズ1: 読み取り専用移行**
   - Firestoreからデータを読み取り
   - 既存のダミーデータは保持

2. **フェーズ2: 書き込み移行**
   - 新規データ作成をFirestoreに
   - 既存データの更新もFirestoreに

3. **フェーズ3: 完全移行**
   - ダミーデータを完全に削除
   - Firestoreのみを使用

---

## 📊 パフォーマンス最適化

### 1. インデックス設計

```javascript
// 必要なインデックス
// festivals: status, createdAt (複合)
// festivals: createdBy, status (複合)
// applications: userId, appliedAt (複合)
// applications: festivalId, status (複合)
```

### 2. データ取得の最適化

```typescript
// 必要なデータのみ取得
const getFestivalWithTasks = async (festivalId: string) => {
  const [festival, tasks] = await Promise.all([
    db.collection('festivals').doc(festivalId).get(),
    db.collection('festivals').doc(festivalId).collection('tasks').get()
  ]);

  return {
    festival: festival.data(),
    tasks: tasks.docs.map(doc => doc.data())
  };
};
```

### 3. リアルタイム更新

```typescript
// リアルタイムリスナー
const subscribeToFestivalUpdates = (festivalId: string) => {
  return db.collection('festivals').doc(festivalId)
    .onSnapshot(doc => {
      console.log('祭り情報が更新されました:', doc.data());
    });
};
```

---

## 🧪 テスト戦略

### 1. 単体テスト

```typescript
// Firestore操作のモック
import { mockFirestore } from 'firestore-jest-mock';

describe('FestivalService', () => {
  beforeEach(() => {
    mockFirestore({
      database: {
        festivals: [
          { id: '1', name: 'Test Festival', status: 'published' }
        ]
      }
    });
  });

  test('祭り一覧を取得できる', async () => {
    const festivals = await getFestivals();
    expect(festivals).toHaveLength(1);
  });
});
```

### 2. 統合テスト

```typescript
// Firebase Emulator使用
import { initializeTestEnvironment } from '@firebase/rules-unit-testing';

describe('Firestore Integration', () => {
  let testEnv: any;

  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: 'test-project',
      firestore: {
        rules: fs.readFileSync('firestore.rules', 'utf8'),
      },
    });
  });

  afterAll(() => testEnv.cleanup());
});
```

---

## 📝 移行チェックリスト

### 準備段階
- [ ] Firebase プロジェクト作成
- [ ] Firestore セキュリティルール設定
- [ ] 必要なインデックス作成
- [ ] データ移行スクリプト作成

### 移行段階
- [ ] ユーザーデータ移行
- [ ] 祭りデータ移行
- [ ] タスクデータ移行
- [ ] レビューデータ移行
- [ ] 応募データ移行

### テスト段階
- [ ] データ整合性確認
- [ ] パフォーマンステスト
- [ ] セキュリティテスト
- [ ] ユーザビリティテスト

### 本番移行
- [ ] 段階的リリース
- [ ] 監視・ログ設定
- [ ] ロールバック計画
- [ ] ユーザーサポート準備

---

*最終更新: 2024年12月*
