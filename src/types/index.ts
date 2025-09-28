export interface User {
  id: string;
  name: string;
  age: number;
  role: 'participant' | 'organizer';
  profile: string;
  level: number;
  badges: string[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  currentParticipants: number;
  reward: string;
  createdBy: string; // organizerId (Firestore移行時に正規化)
  organizerName: string; // 冗長だが、現在のダミーデータ用（移行時削除予定）
  festivalId?: string; // 祭りとの関連付け
  status: 'open' | 'closed' | 'completed';
  tags: string[];
}

export interface Application {
  id: string;
  taskId: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
}

export interface Feedback {
  id: string;
  taskId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
  userName: string;
}

export interface OrganizerTask extends Task {
  applicants: Application[];
  createdAt: string;
  updatedAt: string;
}

// 応募者情報（Applicationと組み合わせて使用）
export interface Applicant {
  id: string;
  name: string;
  age: number;
  profile: string;
  level: number;
  badges: string[];
  appliedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  // 将来的にはApplication + User情報の組み合わせで表現
  // 現在はダミーデータ用として保持
}

// 応募者情報の統合型（Firestore移行時の推奨構造）
export interface ApplicantWithApplication {
  application: Application;
  user: User;
}

export interface Festival {
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

export interface FestivalReview {
  id: string;
  festivalId: string;
  userId: string; // 正規化: authorNameの代わりにuserId参照
  authorName: string; // 冗長だが、現在のダミーデータ用（移行時削除予定）
  comment: string;
  rating: number;
  createdAt: string;
  // 拡張性を考慮した追加フィールド
  images?: string[]; // 画像URL配列
  tags?: string[]; // レビュータグ
  helpfulCount?: number; // 役に立った数
  reply?: { // 運営者からの返信
    content: string;
    repliedAt: string;
    repliedBy: string;
  };
}
