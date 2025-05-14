// User data model with progress tracking for each feature

export interface User {
  id: string;
  username: string;
  email: string;
  name?: string;
  createdAt: string;
  lastLogin: string;
}

export interface WrongAnswer {
  id: string;
  date: string;
  section: string;
  questionType: string;
  question: string;
  yourAnswer: string;
  correctAnswer: string;
  explanation: string;
  tags: string[];
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'daily' | 'weekly' | 'monthly' | 'test-day';
  completed: boolean;
  dueDate?: string;
  createdDate: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  startTime?: string;
  endTime?: string;
  description?: string;
  category: string;
}

export interface ScoreRecord {
  id: string;
  date: string;
  score: number;
  totalPossible: number;
  section?: string;
  notes?: string;
}

export interface UserData {
  userId: string;
  wrongAnswers: WrongAnswer[];
  goals: Goal[];
  calendarEvents: CalendarEvent[];
  scoreRecords: ScoreRecord[];
  lastUpdated: string;
}

// MongoDB document types
export interface UserDocument extends User {
  passwordHash: string;
}

export interface UserDataDocument extends UserData {
  _id: string;
} 