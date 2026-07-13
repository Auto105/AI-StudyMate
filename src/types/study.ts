export type StudyTabId = 'today' | 'materials' | 'questions' | 'quiz';

export interface StudyTask {
  id: string;
  title: string;
  description?: string;
}

export interface PlanDay {
  date: string;
  label: string;
  tasks: StudyTask[];
}

export interface TodayPlan {
  subject: string;
  examDate: string;
  today: StudyTask[];
  days: PlanDay[];
}

export interface StudyProfile {
  subject: string;
  examDate: string;
}

export interface StudyMaterial {
  text: string;
  preview: string;
  summary?: StudySummary;
}

export interface StudySummary {
  keywords: string[];
  concepts: string[];
  easyExplain: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  grounded?: boolean;
}
