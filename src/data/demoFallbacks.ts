import { DEMO_MATERIAL_TEXT } from '@/constants/demo';
import { getMockChatResponse } from '@/lib/mock/chat';
import { getMockPlan } from '@/lib/mock/plan';
import { mockQuiz } from '@/lib/mock/quiz';
import { mockSummary } from '@/lib/mock/summary';
import { selectFallbackPlanByDday } from '@/lib/plan';
import type { ApiUploadResponse, PlanInput, QuizResult } from '@/types/study';

export const DEMO_EXTRACTED_TEXT = DEMO_MATERIAL_TEXT;

export const FALLBACK_UPLOAD_RESPONSE: ApiUploadResponse = {
  extractedText: DEMO_EXTRACTED_TEXT,
};

export const FALLBACK_SUMMARY = mockSummary;

export const FALLBACK_CHAT_RESPONSE = getMockChatResponse('프로세스와 스레드 차이?');

export const FALLBACK_PLAN_INPUT: PlanInput = {
  subject: '운영체제',
  examDate: getDateAfterDays(5),
  keywords: mockSummary.keywords,
  concepts: mockSummary.concepts,
};

export const FALLBACK_PLAN = selectFallbackPlanByDday(FALLBACK_PLAN_INPUT);

export const FALLBACK_LEGACY_PLAN = getMockPlan(
  FALLBACK_PLAN_INPUT.subject,
  FALLBACK_PLAN_INPUT.examDate,
  FALLBACK_PLAN_INPUT.keywords,
  FALLBACK_PLAN_INPUT.concepts,
);

export const FALLBACK_QUIZ: QuizResult = {
  mcq: mockQuiz.mcq.map((question) => ({
    question: question.question,
    options: question.choices,
    answer: question.answer,
    explanation: question.explanation,
  })),
  ox: mockQuiz.ox.map((question) => ({
    question: question.statement,
    answer: question.answer,
    explanation: question.explanation,
  })),
};

function getDateAfterDays(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}
