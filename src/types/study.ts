export type Difficulty = 'easy' | 'medium' | 'hard';
export type StudyType = 'theory' | 'questions' | 'revision';
export type BlockStatus = 'pending' | 'completed' | 'skipped';

export interface Topic {
  id: string;
  name: string;
  subjectId: string;
  difficulty: Difficulty;
  completed: boolean;
  lastStudied?: Date;
  nextRevision?: Date;
}

export interface Subject {
  id: string;
  name: string;
  color: string;
  topics: Topic[];
  weight: number;
}

export interface StudyBlock {
  id: string;
  subjectId: string;
  topicId: string;
  duration: number; // in minutes
  type: StudyType;
  status: BlockStatus;
  scheduledFor: Date;
  completedAt?: Date;
}

export interface DaySchedule {
  date: Date;
  blocks: StudyBlock[];
  isRestDay: boolean;
}

export interface WeekSchedule {
  weekNumber: number;
  days: DaySchedule[];
  summary: WeekSummary;
}

export interface WeekSummary {
  totalBlocks: number;
  completedBlocks: number;
  hoursStudied: number;
  topicsCompleted: number;
}

export interface SubjectProgress {
  subjectId: string;
  totalTopics: number;
  completedTopics: number;
  percentage: number;
}

export interface Alert {
  id: string;
  type: 'revision' | 'delay' | 'overload' | 'achievement';
  message: string;
  createdAt: Date;
  read: boolean;
}
