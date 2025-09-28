import { Task, User, Feedback, OrganizerTask, Applicant, OrganizerEvaluation, Application, FestivalReview, Festival } from '@/types';

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
  },
  {
    id: '5',
    name: '高橋美咲',
    age: 18,
    profile: '高校生です。地域のイベントに参加したいです。',
    level: 1,
    badges: ['学生'],
    appliedAt: '2024-08-11',
    status: 'approved'
  },
  {
    id: '6',
    name: '田中健太',
    age: 32,
    profile: '会社員です。ボランティア活動に興味があります。',
    level: 4,
    badges: ['社会人'],
    appliedAt: '2024-08-08',
    status: 'approved'
  },
  {
    id: '7',
    name: '佐々木花子',
    age: 45,
    profile: '主婦です。地域の祭りを盛り上げたいです。',
    level: 3,
    badges: ['主婦'],
    appliedAt: '2024-08-07',
    status: 'pending'
  },
  {
    id: '8',
    name: '伊藤太郎',
    age: 19,
    profile: '大学生です。新しい経験を求めています。',
    level: 2,
    badges: ['学生'],
    appliedAt: '2024-08-13',
    status: 'approved'
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


// 運営者から参加者への評価データ
export const dummyOrganizerEvaluations: OrganizerEvaluation[] = [
  {
    id: 'eval1',
    participantId: '1', // 田中太郎
    organizerId: 'org1',
    organizerName: '中央区まつり実行委員会',
    taskId: '1',
    taskTitle: '夏祭り 屋台設営のお手伝い',
    rating: 5,
    comment: 'とても積極的で、他の参加者とも協力して作業を進めてくれました。また機会があれば一緒に活動したいです。',
    status: 'excellent',
    createdAt: '2024-08-15',
    skills: ['協調性', '積極性', '責任感'],
    improvements: []
  },
  {
    id: 'eval2',
    participantId: '1', // 田中太郎
    organizerId: 'org2',
    organizerName: '花火大会実行委員会',
    taskId: '2',
    taskTitle: '花火大会 会場整理',
    rating: 4,
    comment: '時間通りに集合し、最後まで責任を持って作業を完了してくれました。',
    status: 'good',
    createdAt: '2024-08-20',
    skills: ['時間管理', '責任感'],
    improvements: ['より積極的な提案ができると良い']
  },
  {
    id: 'eval3',
    participantId: '2', // 佐藤花子
    organizerId: 'org1',
    organizerName: '中央区まつり実行委員会',
    taskId: '1',
    taskTitle: '夏祭り 屋台設営のお手伝い',
    rating: 4,
    comment: '丁寧な作業で、細かいところまで気を配ってくれました。',
    status: 'good',
    createdAt: '2024-08-15',
    skills: ['丁寧さ', '注意力'],
    improvements: []
  }
];

// 応募データ
export const dummyApplications: Application[] = [
  {
    id: 'app1',
    taskId: '1',
    userId: '1',
    status: 'approved',
    appliedAt: '2024-08-10'
  },
  {
    id: 'app2',
    taskId: '2',
    userId: '1',
    status: 'approved',
    appliedAt: '2024-08-12'
  },
  {
    id: 'app3',
    taskId: '1',
    userId: '2',
    status: 'approved',
    appliedAt: '2024-08-11'
  },
  {
    id: 'app4',
    taskId: '3',
    userId: '2',
    status: 'pending',
    appliedAt: '2024-08-13'
  },
  {
    id: 'app5',
    taskId: '2',
    userId: '3',
    status: 'approved',
    appliedAt: '2024-08-14'
  }
];

// 祭りレビューデータ
export const dummyFestivalReviews: FestivalReview[] = [
  {
    id: 'review1',
    festivalId: '1',
    userId: '1',
    authorName: '田中太郎',
    comment: 'とても楽しい祭りでした！屋台の料理も美味しくて、また来年も参加したいです。',
    rating: 5,
    createdAt: '2024-08-16',
    helpfulCount: 3
  },
  {
    id: 'review2',
    festivalId: '1',
    userId: '2',
    authorName: '佐藤花子',
    comment: '家族で参加しました。子供も楽しそうで、良い思い出になりました。',
    rating: 4,
    createdAt: '2024-08-17',
    helpfulCount: 1
  },
  {
    id: 'review3',
    festivalId: '2',
    userId: '1',
    authorName: '田中太郎',
    comment: '花火がとても綺麗でした！来年も絶対参加します。',
    rating: 5,
    createdAt: '2024-08-21',
    helpfulCount: 2
  },
  {
    id: 'review4',
    festivalId: '2',
    userId: '3',
    authorName: '山田次郎',
    comment: '会場が少し混雑していましたが、花火は素晴らしかったです。',
    rating: 4,
    createdAt: '2024-08-22',
    helpfulCount: 0
  }
];
