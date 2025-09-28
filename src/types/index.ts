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

export interface OrganizerTask extends Task {
  applicants: Application[];
  createdAt: string;
  updatedAt: string;
}

export interface Applicant {
  id: string;
  name: string;
  age: number;
  profile: string;
  level: number;
  badges: string[];
  appliedAt: string;
  status: 'pending' | 'approved' | 'rejected';
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
  authorName: string;
  comment: string;
  rating: number;
  createdAt: string;
}
