import { Task, User, Feedback, OrganizerTask, Applicant } from '@/types';

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

// 運営者側ダミーデータ
export const dummyOrganizer: User = {
  id: 'org1',
  name: '中央区まつり実行委員会',
  age: 0,
  role: 'organizer',
  profile: '地域のまつりを盛り上げる実行委員会です',
  level: 10,
  badges: ['実行委員長', '地域貢献']
};

export const dummyOrganizerTasks: OrganizerTask[] = [
  {
    id: 'org1',
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
    tags: ['屋台', '設営', '軽作業'],
    applicants: [
      {
        id: 'app1',
        taskId: 'org1',
        userId: '2',
        status: 'pending',
        appliedAt: '2024-08-10'
      },
      {
        id: 'app2',
        taskId: 'org1',
        userId: '3',
        status: 'approved',
        appliedAt: '2024-08-09'
      }
    ],
    createdAt: '2024-08-01',
    updatedAt: '2024-08-10'
  },
  {
    id: 'org2',
    title: '花火大会 会場整理',
    description: '花火大会終了後の会場整理をお手伝いいただける方を募集しています。',
    date: '2024-08-20',
    time: '20:00-22:00',
    location: '河川敷',
    capacity: 10,
    currentParticipants: 7,
    reward: '交通費支給',
    createdBy: 'org1',
    organizerName: '中央区まつり実行委員会',
    status: 'open',
    tags: ['整理', '清掃', '夜間'],
    applicants: [
      {
        id: 'app3',
        taskId: 'org2',
        userId: '4',
        status: 'pending',
        appliedAt: '2024-08-12'
      }
    ],
    createdAt: '2024-08-05',
    updatedAt: '2024-08-12'
  }
];

export const dummyApplicants: Applicant[] = [
  {
    id: '2',
    name: '佐藤花子',
    age: 20,
    profile: 'まつりが大好きです！',
    level: 2,
    badges: ['初参加'],
    appliedAt: '2024-08-10',
    status: 'pending'
  },
  {
    id: '3',
    name: '山田次郎',
    age: 25,
    profile: '地域活動に積極的に参加しています',
    level: 5,
    badges: ['積極的', 'リーダー'],
    appliedAt: '2024-08-09',
    status: 'approved'
  },
  {
    id: '4',
    name: '鈴木一郎',
    age: 23,
    profile: '体力に自信があります',
    level: 3,
    badges: ['体力自慢'],
    appliedAt: '2024-08-12',
    status: 'pending'
  }
];

// 祭り関連ダミーデータ
export const dummyFestivals: Festival[] = [
  {
    id: 'festival1',
    name: '中央区夏祭り',
    date: '2024-08-15',
    time: '09:00-21:00',
    location: '中央公園',
    description: '地域の夏祭りです。屋台や花火、神輿など様々な催しがあります。',
    createdBy: 'org1',
    createdAt: '2024-08-01',
    updatedAt: '2024-08-01'
  },
  {
    id: 'festival2',
    name: '秋の収穫祭',
    date: '2024-10-10',
    time: '10:00-18:00',
    location: '神社境内',
    description: '秋の収穫を祝う祭りです。神輿担ぎや伝統的な踊りを楽しめます。',
    createdBy: 'org1',
    createdAt: '2024-09-01',
    updatedAt: '2024-09-01'
  }
];

export const dummyFestivalReviews: FestivalReview[] = [
  {
    id: 'review1',
    festivalId: 'festival1',
    authorName: '田中太郎',
    comment: 'とても楽しい祭りでした！屋台の料理も美味しく、花火も綺麗でした。',
    rating: 5,
    createdAt: '2024-08-16'
  },
  {
    id: 'review2',
    festivalId: 'festival1',
    authorName: '佐藤花子',
    comment: 'ボランティアとして参加しましたが、とても良い経験になりました。',
    rating: 4,
    createdAt: '2024-08-17'
  },
  {
    id: 'review3',
    festivalId: 'festival2',
    authorName: '山田次郎',
    comment: '神輿担ぎに参加して、地域の伝統を感じることができました。',
    rating: 5,
    createdAt: '2024-10-11'
  }
];
