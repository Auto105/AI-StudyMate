import { getMockQuiz } from '@/lib/mock/quiz';
import { getMockSummary } from '@/lib/mock/summary';
import { normalizePlanInput, selectFallbackPlanByDday } from '@/lib/plan';
import type { QuizResponse } from '@/types/api';
import type { PlanInput, StudyPlan, SummaryResult } from '@/types/study';

export function getSummarizeFallback(text = ''): SummaryResult {
  return getMockSummary(text);
}

export function getPlanFallback(input: PlanInput): StudyPlan {
  return selectFallbackPlanByDday(normalizePlanInput(input));
}

export function getQuizFallback(text = ''): QuizResponse {
  return getMockQuiz(text);
}
