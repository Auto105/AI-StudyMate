import type { OxQuestion, QuizQuestion } from './quiz';
import type { PlanDay, StudyPlan, StudyTask } from './study';

export interface ApiErrorResponse {
  error: string;
}

export interface UploadResponse {
  text: string;
  truncated: boolean;
}

export interface SummarizeRequest {
  text: string;
}

export interface SummarizeResponse {
  keywords: string[];
  concepts: string[];
  easyExplain: string;
}

export interface ChatRequest {
  text: string;
  question: string;
}

export interface ChatResponse {
  answer: string;
  grounded: boolean;
}

export interface PlanRequest {
  subject: string;
  examDate: string;
  keywords: string[];
  concepts?: string[];
}

export interface PlanResponse {
  today: StudyTask[];
  days: PlanDay[];
}

export type StudyPlanResponse = StudyPlan;

export interface QuizRequest {
  text: string;
}

export interface QuizResponse {
  mcq: QuizQuestion[];
  ox: OxQuestion[];
}
