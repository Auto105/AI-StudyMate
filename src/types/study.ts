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

export interface StudyProfile {
  subject: string;
  examDate: string;
}

export interface StudySummary {
  keywords: string[];
  concepts: string[];
  easyExplain: string;
}

export type SummaryResult = StudySummary;

export interface StudyMaterial {
  text: string;
  preview: string;
  summary?: StudySummary;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  grounded?: boolean;
}

export interface StudyPlanDay {
  day: number;
  date: string;
  title: string;
  tasks: string[];
}

export interface StudyPlan {
  today: string[];
  days: StudyPlanDay[];
}

export interface QuizMcq {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export interface QuizOx {
  question: string;
  answer: boolean;
  explanation: string;
}

export interface QuizResult {
  mcq: QuizMcq[];
  ox: QuizOx[];
}

export interface CachedSummary {
  textHash: string;
  result: SummaryResult;
  updatedAt: string;
}

export interface PlanInput {
  subject: string;
  examDate: string;
  keywords: string[];
  concepts: string[];
}

export interface CachedPlan {
  inputHash: string;
  input: PlanInput;
  result: StudyPlan;
  updatedAt: string;
}

export interface StudyData {
  profile: StudyProfile;
  extractedText: string;
  summary: CachedSummary | null;
  chatHistory: ChatMessage[];
  plan: CachedPlan | null;
  quiz: QuizResult | null;
}

export interface ApiChatResponse {
  answer: string;
  grounded?: boolean;
}

export interface ApiUploadResponse {
  extractedText: string;
}

export interface ApiErrorResponse {
  error: string;
}
