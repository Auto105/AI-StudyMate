import { NextResponse } from 'next/server';
import { invalidJsonBodyResponse, readJsonBody } from '@/lib/api/request';
import { getQuizFallback } from '@/lib/fallbacks';
import { isMockApiEnabled } from '@/lib/mock/config';
import { getMockQuiz } from '@/lib/mock/quiz';
import { createJsonCompletion, truncateText } from '@/lib/openai';
import { quizPrompt } from '@/lib/prompts';
import { isQuizResult } from '@/lib/validators';
import type { ApiErrorResponse, QuizRequest, QuizResponse } from '@/types/api';
import type { QuizResult } from '@/types/study';
import type { OxQuestion, QuizQuestion } from '@/types/quiz';

const MIN_MCQ_COUNT = 3;
const MIN_OX_COUNT = 2;

export async function POST(request: Request) {
  try {
    const result = await readJsonBody<Partial<QuizRequest>>(request);

    if (!result.success) {
      return invalidJsonBodyResponse();
    }

    const body = result.data;

    if (typeof body.text !== 'string' || !body.text.trim()) {
      return NextResponse.json<ApiErrorResponse>(
        { error: 'text는 비어 있지 않은 문자열이어야 합니다.' },
        { status: 400 },
      );
    }

    if (isMockApiEnabled()) {
      return NextResponse.json<QuizResponse>(getMockQuiz(body.text));
    }

    try {
      const prompt = quizPrompt(truncateText(body.text));
      const quiz = await createJsonCompletion<QuizResponse>({
        system: prompt.system,
        user: prompt.user,
        parse: parseQuizResponse,
      });

      return NextResponse.json<QuizResponse>(quiz);
    } catch {
      return NextResponse.json<QuizResponse>(getQuizFallback(body.text));
    }
  } catch {
    return NextResponse.json<ApiErrorResponse>(
      { error: '퀴즈 요청을 처리하지 못했습니다.' },
      { status: 500 },
    );
  }
}

function parseQuizResponse(raw: string): QuizResponse {
  const parsed = JSON.parse(raw) as unknown;
  return toQuizResponse(toQuizResult(parsed));
}

/**
 * OpenAI / validator 계약(options, question)과
 * mock·문서 예시(choices, statement)를 모두 받아 QuizResult로 정규화한다.
 */
function toQuizResult(value: unknown): QuizResult {
  if (!isRecord(value) || !Array.isArray(value.mcq) || !Array.isArray(value.ox)) {
    throw new Error('OpenAI 응답 형식이 올바르지 않습니다.');
  }

  const quizResult: QuizResult = {
    mcq: value.mcq.map((item, index) => normalizeMcq(item, index)),
    ox: value.ox.map((item, index) => normalizeOx(item, index)),
  };

  if (!isQuizResult(quizResult)) {
    throw new Error('OpenAI 응답 형식이 올바르지 않습니다.');
  }

  if (quizResult.mcq.length < MIN_MCQ_COUNT) {
    throw new Error(`객관식 문제는 ${MIN_MCQ_COUNT}개 이상이어야 합니다.`);
  }

  if (quizResult.ox.length < MIN_OX_COUNT) {
    throw new Error(`OX 문제는 ${MIN_OX_COUNT}개 이상이어야 합니다.`);
  }

  for (const question of quizResult.mcq) {
    if (question.options.length < 2) {
      throw new Error('객관식 선택지는 2개 이상이어야 합니다.');
    }

    if (!question.options.includes(question.answer)) {
      throw new Error('객관식 정답은 options 중 하나와 일치해야 합니다.');
    }
  }

  return quizResult;
}

/** 프론트·API_CONTRACT 계약(choices, statement, id)으로 변환한다. */
function toQuizResponse(result: QuizResult): QuizResponse {
  return {
    mcq: result.mcq.map((question, index): QuizQuestion => ({
      id: `mcq-${index + 1}`,
      question: question.question,
      choices: question.options,
      answer: question.answer,
      explanation: question.explanation,
    })),
    ox: result.ox.map((question, index): OxQuestion => ({
      id: `ox-${index + 1}`,
      statement: question.question,
      answer: question.answer,
      explanation: question.explanation,
    })),
  };
}

function normalizeMcq(value: unknown, index: number) {
  if (!isRecord(value) || typeof value.question !== 'string' || typeof value.answer !== 'string') {
    throw new Error(`mcq[${index}] 형식이 올바르지 않습니다.`);
  }

  const options = Array.isArray(value.options)
    ? value.options
    : Array.isArray(value.choices)
      ? value.choices
      : null;

  if (!options || options.some((option) => typeof option !== 'string')) {
    throw new Error(`mcq[${index}] options가 올바르지 않습니다.`);
  }

  if (typeof value.explanation !== 'string') {
    throw new Error(`mcq[${index}] explanation이 올바르지 않습니다.`);
  }

  return {
    question: value.question.trim(),
    options: options.map((option) => option.trim()),
    answer: value.answer.trim(),
    explanation: value.explanation.trim(),
  };
}

function normalizeOx(value: unknown, index: number) {
  if (!isRecord(value) || typeof value.answer !== 'boolean' || typeof value.explanation !== 'string') {
    throw new Error(`ox[${index}] 형식이 올바르지 않습니다.`);
  }

  const question =
    typeof value.question === 'string'
      ? value.question
      : typeof value.statement === 'string'
        ? value.statement
        : null;

  if (!question?.trim()) {
    throw new Error(`ox[${index}] question이 올바르지 않습니다.`);
  }

  return {
    question: question.trim(),
    answer: value.answer,
    explanation: value.explanation.trim(),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
