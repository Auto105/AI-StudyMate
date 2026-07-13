import { mockSummary } from '@/lib/mock/summary';
import { normalizePlanInput, selectFallbackPlanByDday } from '@/lib/plan';
import type { PlanInput, StudyPlan, SummaryResult } from '@/types/study';

export function getSummarizeFallback(): SummaryResult {
  return {
    keywords: [...mockSummary.keywords],
    concepts: [...mockSummary.concepts],
    easyExplain: mockSummary.easyExplain,
  };
}

export function getPlanFallback(input: PlanInput): StudyPlan {
  return selectFallbackPlanByDday(normalizePlanInput(input));
}
