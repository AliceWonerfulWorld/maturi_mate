import { Task, User, Feedback } from '@/types';

export const dummyUser: User = {
  id: '1',
  name: '田中太郎',
  age: 22,
  role: 'participant',
  profile: '地域のまつりに興味があります！',
  level: 3,
  badges: ['初参加', '積極的']
};

export const dummyTasks: Task[] = [
  {
    id: '1',
    title: '夏祭り 屋台設営のお手伝い',
    description: '夏祭りの屋台設営をお手伝いいただける方を募集しています。重いものはありませんので、体力に自信がない方でも大丈夫です。',
    date: '2024-08-15',
    time: '09:00-12:00',
    location: '中央公園',
    capacity: 5,
    currentParticipants: 3,
    reward: 'お弁当付き',
    createdBy: 'org1',
    organizerName: '中央区まつり実行委員会',
    status: 'open',
    tags: ['屋台', '設営', '軽作業']
  },
  {
    id: '2',
    title: '花火大会 会場整理',
    description: '花火大会終了後の会場整理をお手伝いいただける方を募集しています。',
    date: '2024-08-20',
    time: '20:00-22:00',
    location: '河川敷',
    capacity: 10,
    currentParticipants: 7,
    reward: '交通費支給',
    createdBy: 'org2',
    organizerName: '花火大会実行委員会',
    status: 'open',
    tags: ['整理', '清掃', '夜間']
  },
  {
    id: '3',
    title: '秋祭り 神輿担ぎ手',
    description: '秋祭りの神輿担ぎ手を募集しています。経験者歓迎ですが、未経験者も大歓迎です。',
    date: '2024-10-10',
    time: '14:00-17:00',
    location: '神社境内',
    capacity: 20,
    currentParticipants: 15,
    reward: '記念品付き',
    createdBy: 'org3',
    organizerName: '秋祭り保存会',
    status: 'open',
    tags: ['神輿', '伝統', '体力']
  }
];

export const dummyFeedbacks: Feedback[] = [
  {
    id: '1',
    taskId: '1',
    userId: '2',
    rating: 5,
    comment: 'とても楽しい体験でした！地域の方々と交流できて良かったです。',
    createdAt: '2024-08-16',
    userName: '佐藤花子'
  },
  {
    id: '2',
    taskId: '1',
    userId: '3',
    rating: 4,
    comment: '重労働でしたが、達成感がありました。また参加したいです。',
    createdAt: '2024-08-16',
    userName: '山田次郎'
  }
];
