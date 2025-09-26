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
  createdBy: string;
  organizerName: string;
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
