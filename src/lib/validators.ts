import type {
  ApiChatResponse,
  ApiErrorResponse,
  ApiUploadResponse,
  PlanInput,
  QuizResult,
  StudyProfile,
  StudyPlan,
  SummaryResult,
} from '@/types/study';
import { isValidIsoDate } from '@/lib/date';

export type ValidationResult = { ok: true; error: null } | { ok: false; error: string };

export function validateRequiredText(value: string, fieldName: string): ValidationResult {
  return value.trim()
    ? { ok: true, error: null }
    : { ok: false, error: `${fieldName}은 비어 있을 수 없습니다.` };
}

export function validateStudyProfile(profile: StudyProfile): ValidationResult {
  const subjectResult = validateRequiredText(profile.subject, '과목');

  if (!subjectResult.ok) {
    return subjectResult;
  }

  if (!isValidIsoDate(profile.examDate)) {
    return { ok: false, error: '시험일은 YYYY-MM-DD 형식의 올바른 날짜여야 합니다.' };
  }

  return { ok: true, error: null };
}

export function validatePlanInput(input: PlanInput): ValidationResult {
  const profileResult = validateStudyProfile({
    subject: input.subject,
    examDate: input.examDate,
  });

  if (!profileResult.ok) {
    return profileResult;
  }

  if (!isStringArray(input.keywords)) {
    return { ok: false, error: 'keywords는 문자열 배열이어야 합니다.' };
  }

  if (!isStringArray(input.concepts)) {
    return { ok: false, error: 'concepts는 문자열 배열이어야 합니다.' };
  }

  return { ok: true, error: null };
}

export function validateStudyText(text: string): ValidationResult {
  return validateRequiredText(text, '학습자료');
}

export function validateQuestion(question: string): ValidationResult {
  return validateRequiredText(question, '질문');
}

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
