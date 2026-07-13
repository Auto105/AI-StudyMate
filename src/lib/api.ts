import {
  FALLBACK_CHAT_RESPONSE,
  FALLBACK_PLAN,
  FALLBACK_QUIZ,
  FALLBACK_SUMMARY,
  FALLBACK_UPLOAD_RESPONSE,
} from '@/data/demoFallbacks';
import { selectFallbackPlanByDday } from '@/lib/plan';
import {
  isChatResponse,
  isQuizResult,
  isStudyPlan,
  isSummaryResult,
  isUploadResponse,
} from '@/lib/validators';
import type {
  ApiChatResponse,
  ApiUploadResponse,
  PlanInput,
  QuizResult,
  StudyPlan,
  SummaryResult,
} from '@/types/study';

interface ApiClientOptions {
  fallbackOnError?: boolean;
}

export async function uploadPdf(file: File, options: ApiClientOptions = {}): Promise<ApiUploadResponse> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    const payload = await parseJson(response);
    const normalized = normalizeUploadResponse(payload);

    if (!normalized) {
      throw new Error('Upload API response does not match the expected contract.');
    }

    return normalized;
  } catch (error) {
    if (options.fallbackOnError) {
      return FALLBACK_UPLOAD_RESPONSE;
    }

    throw error;
  }
}

export async function summarizeText(text: string, options: ApiClientOptions = {}): Promise<SummaryResult> {
  try {
    const payload = await postJson('/api/summarize', { text });

    if (!isSummaryResult(payload)) {
      throw new Error('Summary API response does not match the expected contract.');
    }

    return payload;
  } catch (error) {
    if (options.fallbackOnError) {
      return FALLBACK_SUMMARY;
    }

    throw error;
  }
}

export async function askQuestion(
  text: string,
  question: string,
  options: ApiClientOptions = {},
): Promise<ApiChatResponse> {
  try {
    const payload = await postJson('/api/chat', { text, question });

    if (!isChatResponse(payload)) {
      throw new Error('Chat API response does not match the expected contract.');
    }

    return payload;
  } catch (error) {
    if (options.fallbackOnError) {
      return FALLBACK_CHAT_RESPONSE;
    }

    throw error;
  }
}

export async function createStudyPlan(
  input: PlanInput,
  options: ApiClientOptions = {},
): Promise<StudyPlan> {
  try {
    const payload = await postJson('/api/plan', input);
    const normalized = normalizeStudyPlanResponse(payload);

    if (!normalized) {
      throw new Error('Plan API response does not match the expected contract.');
    }

    return normalized;
  } catch (error) {
    if (options.fallbackOnError) {
      return input.examDate ? selectFallbackPlanByDday(input) : FALLBACK_PLAN;
    }

    throw error;
  }
}

export async function generateQuiz(text: string, options: ApiClientOptions = {}): Promise<QuizResult> {
  try {
    const payload = await postJson('/api/quiz', { text });
    const normalized = normalizeQuizResponse(payload);

    if (!normalized) {
      throw new Error('Quiz API response does not match the expected contract.');
    }

    return normalized;
  } catch (error) {
    if (options.fallbackOnError) {
      return FALLBACK_QUIZ;
    }

    throw error;
  }
}

async function postJson(url: string, body: unknown) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  return parseJson(response);
}

async function parseJson(response: Response) {
  const payload = (await response.json().catch(() => null)) as unknown;

  if (!response.ok) {
    const errorMessage =
      payload && typeof payload === 'object' && 'error' in payload && typeof payload.error === 'string'
        ? payload.error
        : 'API 요청에 실패했습니다.';
    throw new Error(errorMessage);
  }

  return payload;
}

function normalizeUploadResponse(value: unknown): ApiUploadResponse | null {
  if (isUploadResponse(value)) {
    return value;
  }

  if (value && typeof value === 'object' && 'text' in value && typeof value.text === 'string') {
    return { extractedText: value.text };
  }

  return null;
}

function normalizeStudyPlanResponse(value: unknown): StudyPlan | null {
  if (isStudyPlan(value)) {
    return value;
  }

  if (!value || typeof value !== 'object' || !('today' in value) || !('days' in value)) {
    return null;
  }

  const legacy = value as {
    today?: Array<{ title?: unknown }>;
    days?: Array<{ date?: unknown; label?: unknown; tasks?: Array<{ title?: unknown }> }>;
  };

  if (!Array.isArray(legacy.today) || !Array.isArray(legacy.days)) {
    return null;
  }

  return {
    today: legacy.today.map((task) => (typeof task.title === 'string' ? task.title : '')).filter(Boolean),
    days: legacy.days.map((day, index) => ({
      day: index + 1,
      date: typeof day.date === 'string' ? day.date : '',
      title: typeof day.label === 'string' ? day.label : `Day ${index + 1}`,
      tasks: Array.isArray(day.tasks)
        ? day.tasks.map((task) => (typeof task.title === 'string' ? task.title : '')).filter(Boolean)
        : [],
    })),
  };
}

function normalizeQuizResponse(value: unknown): QuizResult | null {
  if (isQuizResult(value)) {
    return value;
  }

  if (!value || typeof value !== 'object' || !('mcq' in value) || !('ox' in value)) {
    return null;
  }

  const legacy = value as {
    mcq?: Array<{ question?: unknown; choices?: unknown; answer?: unknown; explanation?: unknown }>;
    ox?: Array<{ statement?: unknown; answer?: unknown; explanation?: unknown }>;
  };

  if (!Array.isArray(legacy.mcq) || !Array.isArray(legacy.ox)) {
    return null;
  }

  return {
    mcq: legacy.mcq.map((question) => ({
      question: typeof question.question === 'string' ? question.question : '',
      options: Array.isArray(question.choices)
        ? question.choices.filter((choice): choice is string => typeof choice === 'string')
        : [],
      answer: typeof question.answer === 'string' ? question.answer : '',
      explanation: typeof question.explanation === 'string' ? question.explanation : '',
    })),
    ox: legacy.ox.map((question) => ({
      question: typeof question.statement === 'string' ? question.statement : '',
      answer: typeof question.answer === 'boolean' ? question.answer : false,
      explanation: typeof question.explanation === 'string' ? question.explanation : '',
    })),
  };
}
