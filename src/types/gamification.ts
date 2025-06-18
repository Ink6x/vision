export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
}

export interface UserStats {
  level: number;
  experience: number;
  experienceToNext: number;
  totalGoalsCompleted: number;
  currentStreak: number;
  longestStreak: number;
  totalSessionsCompleted: number;
  achievements: Achievement[];
}

export interface SessionLog {
  id: string;
  date: Date;
  duration: number; // minutes
  type: 'face-to-face' | 'online' | 'phone';
  summary: string;
  coachComments: string;
  studentReflection?: string;
  nextSteps: string[];
  rating?: number; // 1-5
}

export interface TodoItem {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  isCompleted: boolean;
  completedAt?: Date;
  experienceReward: number;
  category: string;
  estimatedTime?: number; // minutes
  isDaily?: boolean;
  recurringDays?: number[]; // 0=Sunday, 1=Monday, etc.
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  assignedDate: Date;
  dueDate: Date;
  type: 'reflection' | 'action' | 'research' | 'practice';
  isSubmitted: boolean;
  submittedAt?: Date;
  submission?: string;
  coachFeedback?: string;
  experienceReward: number;
  status: 'pending' | 'submitted' | 'reviewed' | 'completed';
}

export interface MainGoal {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  targetDate: Date;
  progress: number;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  experienceReward: number;
  milestones: Milestone[];
  isCompleted: boolean;
  completedAt?: Date;
  coachNotes: string;
}

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  progress: number;
  isCompleted: boolean;
  experienceReward: number;
  completedAt?: Date;
  targetDate?: Date;
}

export interface JournalEntry {
  id: string;
  date: Date;
  title: string;
  content: string;
  mood: 'excellent' | 'good' | 'neutral' | 'challenging' | 'difficult';
  achievements: string[];
  challenges: string[];
  coachComment?: string;
  rating?: number; // 1-5
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: 'session' | 'assignment' | 'milestone' | 'goal' | 'todo';
  description?: string;
  status?: 'completed' | 'pending' | 'overdue';
}