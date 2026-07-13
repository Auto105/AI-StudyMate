import type { CachedPlan, CachedSummary, PlanInput, StudyPlan, SummaryResult } from '@/types/study';

export function createTextHash(text: string) {
  return createHash(text.trim().replace(/\s+/g, ' '));
}

export function createSummaryCache(text: string, result: SummaryResult): CachedSummary {
  return {
    textHash: createTextHash(text),
    result,
    updatedAt: new Date().toISOString(),
  };
}

export function isSummaryCacheHit(text: string, cache: CachedSummary | null) {
  return Boolean(cache && cache.textHash === createTextHash(text));
}

export function createPlanInputHash(input: PlanInput) {
  return createHash(
    JSON.stringify({
      subject: input.subject.trim(),
      examDate: input.examDate,
      keywords: [...input.keywords].map((keyword) => keyword.trim()).sort(),
      concepts: [...input.concepts].map((concept) => concept.trim()).sort(),
    }),
  );
}

export function createPlanCache(input: PlanInput, result: StudyPlan): CachedPlan {
  return {
    inputHash: createPlanInputHash(input),
    input,
    result,
    updatedAt: new Date().toISOString(),
  };
}

export function isPlanCacheHit(input: PlanInput, cache: CachedPlan | null) {
  return Boolean(cache && cache.inputHash === createPlanInputHash(input));
}

function createHash(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }

  return Math.abs(hash).toString(36);
}
