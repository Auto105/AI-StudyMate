import { getDemoTodayTasks } from '@/constants/demo';
import { selectFallbackPlanByDday, toLegacyPlanDays, toLegacyStudyTasks } from '@/lib/plan';
import type { PlanResponse } from '@/types/api';

export function getMockPlan(
  subject: string,
  examDate: string,
  keywords: string[] = [],
  concepts: string[] = [],
): PlanResponse {
  const plan = selectFallbackPlanByDday({
    subject,
    examDate,
    keywords,
    concepts,
  });

  return {
    today: plan.today.length > 0 ? toLegacyStudyTasks(plan.today) : getDemoTodayTasks(examDate),
    days: toLegacyPlanDays(plan),
  };
}
