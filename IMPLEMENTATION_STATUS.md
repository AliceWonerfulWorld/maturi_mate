# Matsuri Mate 実装状況詳細

## 📋 プロジェクト概要

**Matsuri Mate** は、まつりの準備運営における人手不足を解消するジョブマッチングアプリです。運営者（祭り主催者）と参加者（若者）の2つのユーザータイプに対応し、祭りを中心とした包括的なマッチングプラットフォームを提供します。

---

## 🎯 実装済み画面一覧

### 1. ロール選択画面
- **URL**: `/`
- **ファイル**: `src/app/page.tsx`
- **機能**:
  - 運営者・参加者のロール選択
  - 各ロールの説明と特徴表示
  - 落ち着いたスレート・グレー系のデザイン
  - レスポンシブレイアウト（横並び・縦並び対応）

### 2. 参加者側画面

#### 2.1 タスク一覧画面（ホーム）
- **URL**: `/participant`
- **ファイル**: `src/app/participant/page.tsx`
- **機能**:
  - タスク一覧のカード形式表示
  - 検索機能（タイトル・説明で検索）
  - タグフィルター機能
  - タスク詳細画面への遷移
  - パフォーマンス最適化（React.memo, useMemo, useCallback）
  - 落ち着いたスレート・グレー系のデザイン

#### 2.2 タスク詳細画面
- **URL**: `/participant/task/[id]`
- **ファイル**: `src/app/participant/task/[id]/page.tsx`
- **機能**:
  - タスクの詳細情報表示
  - 応募ボタン
  - 運営者情報表示

#### 2.3 プロフィール画面
- **URL**: `/participant/profile`
- **ファイル**: `src/app/participant/profile/page.tsx`
- **機能**:
  - ユーザープロフィール表示
  - レベル・バッジシステム
  - 参加履歴表示
  - 投稿した口コミ履歴表示
  - 運営者からの評価表示
  - 統計情報（参加回数・口コミ投稿数・平均評価）
  - 落ち着いたスレート・グレー系のデザイン

#### 2.4 祭り一覧画面
- **URL**: `/participant/festivals`
- **ファイル**: `src/app/participant/festivals/page.tsx`
- **機能**:
  - 祭り一覧のカード形式表示
  - 検索機能（祭り名・場所・説明で検索）
  - 星評価とレビュー数の表示
  - 祭り詳細画面への遷移
  - ブルー・パープル系のデザイン

#### 2.5 祭り詳細画面
- **URL**: `/participant/festivals/[festivalId]`
- **ファイル**: `src/app/participant/festivals/[festivalId]/page.tsx`
- **機能**:
  - 祭り基本情報表示（名前・日時・場所・詳細）
  - 関連タスク一覧表示
  - 口コミ一覧表示（検索・フィルタ・並び替え機能付き）
  - 口コミ投稿フォーム（投稿者名・コメント・星評価）
  - 星評価フィルタ（1-5星）
  - 並び替え機能（最新・高評価順）
  - 動的ルートで祭りIDを受け取り

### 3. 運営者側画面

#### 3.1 ダッシュボード画面（ホーム）
- **URL**: `/organizer/dashboard`
- **ファイル**: `src/app/organizer/dashboard/page.tsx`
- **機能**:
  - 統計情報表示（祭り数・タスク数・応募者数・未承認数）
  - クイックアクション（新規祭り登録・祭り一覧・タスク管理）
  - 最近の祭り一覧
  - 承認待ちの応募者一覧
  - 統合ビューとして各機能への導線を提供
  - アンバー・オレンジ系のデザイン

#### 3.2 タスク管理画面
- **URL**: `/organizer/tasks`
- **ファイル**: `src/app/organizer/tasks/page.tsx`
- **機能**:
  - 登録済みタスク一覧表示
  - タスククリックで応募者一覧表示
  - 応募者の承認・却下機能
  - 応募者情報表示（名前・年齢・プロフィール・レベル・バッジ）
  - ブルー・パープル系のデザイン

#### 3.3 祭り一覧画面
- **URL**: `/organizer/festivals`
- **ファイル**: `src/app/organizer/festivals/page.tsx`
- **機能**:
  - 登録済み祭りのカード形式表示
  - 検索機能（祭り名・場所・説明で検索）
  - 新規祭り登録ボタン
  - 祭り詳細画面への遷移
  - アンバー・オレンジ系のデザイン

#### 3.4 祭り登録画面
- **URL**: `/organizer/festivals/register`
- **ファイル**: `src/app/organizer/festivals/register/page.tsx`
- **機能**:
  - 祭り情報入力フォーム（祭り名・開催日時・場所・詳細）
  - バリデーション機能
  - 登録完了後の祭り一覧への遷移
  - アンバー・オレンジ系のデザイン

#### 3.5 祭り詳細画面（運営者側）
- **URL**: `/organizer/festivals/[festivalId]`
- **ファイル**: `src/app/organizer/festivals/[festivalId]/page.tsx`
- **機能**:
  - 祭り基本情報表示
  - 新規タスク登録ボタン
  - 関連タスク一覧表示
  - タスク管理への遷移
  - 動的ルートで祭りIDを受け取り

#### 3.6 祭り別タスク登録画面
- **URL**: `/organizer/festivals/[festivalId]/tasks/register`
- **ファイル**: `src/app/organizer/festivals/[festivalId]/tasks/register/page.tsx`
- **機能**:
  - 祭りに紐づくタスクの登録
  - 入力項目（タスク名・内容・日時・場所・人数・報酬・タグ）
  - 祭りの場所情報を自動設定
  - 登録完了後の祭り詳細への遷移
  - パンくずリストで階層表示

#### 3.7 応募者一覧画面（祭り単位）
- **URL**: `/organizer/applications`
- **ファイル**: `src/app/organizer/applications/page.tsx`
- **機能**:
  - 祭り単位での応募者一覧表示
  - 祭り別フィルター機能
  - 検索機能（祭り名・場所で検索）
  - 応募者の承認・却下機能
  - 祭り全体での応募状況把握
  - ブルー・パープル系のデザイン

#### 3.8 従来のタスク管理画面（非推奨）
- **URL**: `/organizer`
- **ファイル**: `src/app/organizer/page.tsx`
- **機能**: ダッシュボードに統合され、`/organizer/tasks`に移動

---

## 🎨 デザインシステム

### カラーテーマ
- **参加者側**: ブルー・パープル系（落ち着いた印象）
- **運営者側**: アンバー・オレンジ系（温かみのある印象）
- **共通**: スレート・グレー系（落ち着いた背景色）

### UI/UX特徴
- **グラスモーフィズム**: 半透明効果でモダンな印象
- **レスポンシブデザイン**: モバイルファースト
- **アニメーション**: ホバー効果とスムーズな遷移
- **統一感**: shadcn/ui + Tailwind CSSで統一されたデザイン

---

## 🗂️ データ構造

### 型定義（`src/types/index.ts`）
```typescript
// ユーザー
interface User {
  id: string;
  name: string;
  age: number;
  role: 'participant' | 'organizer';
  profile: string;
  level: number;
  badges: string[];
}

// タスク
interface Task {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  currentParticipants: number;
  reward: string;
  createdBy: string;
  organizerName: string;
  status: 'open' | 'closed';
  tags: string[];
}

// 運営者タスク（応募者情報付き）
interface OrganizerTask extends Task {
  applicants: Application[];
  createdAt: string;
  updatedAt: string;
}

// 応募情報
interface Application {
  id: string;
  taskId: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
}

// 応募者情報
interface Applicant {
  id: string;
  name: string;
  age: number;
  profile: string;
  level: number;
  badges: string[];
  appliedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

// 祭り
interface Festival {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  description: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// 祭りレビュー
interface FestivalReview {
  id: string;
  festivalId: string;
  authorName: string;
  comment: string;
  rating: number;
  createdAt: string;
}
```

### ダミーデータ（`src/lib/dummy-data.ts`）
- **ユーザーデータ**: 参加者・運営者のサンプルデータ
- **タスクデータ**: 各種タスクのサンプルデータ
- **応募データ**: 応募・応募者情報のサンプルデータ
- **祭りデータ**: 祭り情報のサンプルデータ
- **レビューデータ**: 口コミ・評価のサンプルデータ

---

## 🚀 技術仕様

### フレームワーク・ライブラリ
- **Next.js 14.2.0**: React フレームワーク
- **React 18.2.0**: UI ライブラリ
- **TypeScript**: 型安全性
- **Tailwind CSS**: スタイリング
- **shadcn/ui**: UI コンポーネント
- **lucide-react**: アイコン

### パフォーマンス最適化
- **React.memo**: コンポーネントのメモ化
- **useMemo**: 計算結果のメモ化
- **useCallback**: 関数のメモ化
- **prefetch={false}**: 不要なプリフェッチを無効化
- **GPU加速**: CSS transform でハードウェアアクセラレーション
- **コード分割**: 動的インポート

### 設定ファイル
- **next.config.js**: Next.js設定（CSS最適化、画像最適化、圧縮）
- **tailwind.config.js**: Tailwind設定（shadcn/ui対応）
- **tsconfig.json**: TypeScript設定
- **postcss.config.js**: PostCSS設定

---

## 🔗 ナビゲーション構造

### 参加者側ナビゲーション
```
/participant (タスク一覧)
├── /participant/festivals (祭り一覧)
│   └── /participant/festivals/[festivalId] (祭り詳細)
├── /participant/task/[id] (タスク詳細)
├── /participant/profile (プロフィール)
└── /participant/feedback (口コミ投稿)
```

### 運営者側ナビゲーション
```
/organizer/dashboard (ダッシュボード - ホーム)
├── /organizer/festivals (祭り一覧)
│   ├── /organizer/festivals/register (祭り登録)
│   ├── /organizer/festivals/[festivalId] (祭り詳細)
│   └── /organizer/festivals/[festivalId]/tasks/register (祭り別タスク登録)
├── /organizer/tasks (タスク管理)
└── /organizer/applications (応募者一覧 - 祭り単位)
```

---

## 📱 レスポンシブ対応

### ブレークポイント
- **モバイル**: < 640px
- **タブレット**: 640px - 1024px
- **デスクトップ**: > 1024px

### 対応状況
- **ロール選択画面**: 横並び・縦並びのレスポンシブレイアウト
- **カード表示**: 適切な間隔とサイズ調整
- **ナビゲーション**: モバイルファーストのボトムナビゲーション
- **フォーム**: モバイルでの入力しやすさを考慮

---

## 🔄 画面遷移フロー

### 参加者側フロー
1. **ロール選択** → **参加者ホーム**（タスク一覧）
2. **参加者ホーム** → **祭り一覧** → **祭り詳細**（口コミ投稿・関連タスク確認）
3. **参加者ホーム** → **タスク詳細**（応募）
4. **参加者ホーム** → **プロフィール**（ユーザー情報・過去口コミ一覧）

### 運営者側フロー
1. **ロール選択** → **ダッシュボード**（統合ビュー）
2. **ダッシュボード** → **祭り一覧** → **祭り登録**
3. **祭り一覧** → **祭り詳細** → **祭り別タスク登録**
4. **ダッシュボード** → **タスク管理** → **応募者管理**（承認・却下）
5. **ダッシュボード** → **応募者一覧**（祭り単位での応募状況把握）

---

## ✅ 実装完了機能

### 基本機能
- [x] ロール選択
- [x] タスク一覧・詳細・管理
- [x] 祭り登録・一覧・詳細
- [x] 口コミ投稿・表示（祭り詳細画面に統合）
- [x] 応募・承認システム
- [x] 検索・フィルター機能
- [x] 運営者ダッシュボード（統合ビュー）
- [x] 祭り単位応募者管理
- [x] パンくずリスト（深い階層の画面）
- [x] 口コミ検索・フィルタ・並び替え機能
- [x] プロフィール機能拡張（口コミ履歴・運営者評価）

### UI/UX機能
- [x] レスポンシブデザイン
- [x] パフォーマンス最適化
- [x] アニメーション効果
- [x] 統一されたデザインシステム
- [x] アクセシビリティ対応

### 技術機能
- [x] TypeScript型安全性
- [x] コンポーネント最適化
- [x] 状態管理
- [x] ルーティング
- [x] エラーハンドリング

---

## 🎯 今後の拡張予定

### 機能拡張
- [ ] リアルタイム通知
- [ ] チャット機能
- [ ] 決済システム
- [ ] マップ連携
- [ ] 画像アップロード

### 技術拡張
- [ ] Firebase連携
- [ ] 認証システム
- [ ] データベース設計
- [ ] API設計
- [ ] テスト実装

---

## 📝 開発ノート

### 設計思想
- **ユーザビリティ重視**: 直感的な操作で使いやすさを追求
- **パフォーマンス重視**: 高速な画面遷移とレスポンス
- **保守性重視**: 型安全性とコンポーネント設計
- **拡張性重視**: 将来的な機能追加に対応できる設計

### 技術選択理由
- **Next.js**: SEO対応とパフォーマンス
- **TypeScript**: 型安全性と開発効率
- **Tailwind CSS**: 高速開発と一貫性
- **shadcn/ui**: 高品質なUIコンポーネント

---

*最終更新: 2024年12月*
