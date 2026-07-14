import { getTodayIso } from '@/lib/date';
import type { PlanInput } from '@/types/study';

export function getStudyTextHash(text: string) {
  return hashValue(text.trim());
}

export function getPlanInputHash(input: PlanInput) {
  return hashValue(
    JSON.stringify({
      subject: input.subject.trim(),
      examDate: input.examDate,
      today: getTodayIso(),
      keywords: input.keywords.map((keyword) => keyword.trim()),
      concepts: input.concepts.map((concept) => concept.trim()),
    }),
  );
}

function hashValue(value: string) {
  let hash = 0x811c9dc5;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }

  return (hash >>> 0).toString(36);
}
