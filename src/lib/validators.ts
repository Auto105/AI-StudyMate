import type {
  ApiChatResponse,
  ApiErrorResponse,
  ApiUploadResponse,
  QuizResult,
  StudyPlan,
  SummaryResult,
} from '@/types/study';

export function isUploadResponse(value: unknown): value is ApiUploadResponse {
  return isRecord(value) && typeof value.extractedText === 'string';
}

export function isSummaryResult(value: unknown): value is SummaryResult {
  return (
    isRecord(value) &&
    isStringArray(value.keywords) &&
    isStringArray(value.concepts) &&
    typeof value.easyExplain === 'string'
  );
}

export function isChatResponse(value: unknown): value is ApiChatResponse {
  return (
    isRecord(value) &&
    typeof value.answer === 'string' &&
    (value.grounded === undefined || typeof value.grounded === 'boolean')
  );
}

export function isStudyPlan(value: unknown): value is StudyPlan {
  return (
    isRecord(value) &&
    isStringArray(value.today) &&
    Array.isArray(value.days) &&
    value.days.every(
      (day) =>
        isRecord(day) &&
        typeof day.day === 'number' &&
        typeof day.date === 'string' &&
        typeof day.title === 'string' &&
        isStringArray(day.tasks),
    )
  );
}

export function isQuizResult(value: unknown): value is QuizResult {
  return (
    isRecord(value) &&
    Array.isArray(value.mcq) &&
    Array.isArray(value.ox) &&
    value.mcq.every(
      (question) =>
        isRecord(question) &&
        typeof question.question === 'string' &&
        isStringArray(question.options) &&
        typeof question.answer === 'string' &&
        typeof question.explanation === 'string',
    ) &&
    value.ox.every(
      (question) =>
        isRecord(question) &&
        typeof question.question === 'string' &&
        typeof question.answer === 'boolean' &&
        typeof question.explanation === 'string',
    )
  );
}

export function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  return isRecord(value) && typeof value.error === 'string';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}
