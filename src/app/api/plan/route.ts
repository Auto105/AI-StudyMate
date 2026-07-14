import { NextResponse } from 'next/server';
import { invalidJsonBodyResponse, readJsonBody } from '@/lib/api/request';
import { calculateDday, isValidIsoDate } from '@/lib/date';
import { getPlanFallback } from '@/lib/fallbacks';
import { isMockApiEnabled } from '@/lib/mock/config';
import { getMockPlan } from '@/lib/mock/plan';
import { createJsonCompletion } from '@/lib/openai';
import { toLegacyPlanDays, toLegacyStudyTasks } from '@/lib/plan';
import { planPrompt } from '@/lib/prompts';
import type { ApiErrorResponse, PlanRequest, PlanResponse } from '@/types/api';
import type { PlanDay, StudyPlan, StudyTask } from '@/types/study';

export async function POST(request: Request) {
  try {
    const result = await readJsonBody<Partial<PlanRequest>>(request);

    if (!result.success) {
      return invalidJsonBodyResponse();
    }

    const body = result.data;
    if (typeof body.subject !== 'string' || !body.subject.trim()) {
      return NextResponse.json<ApiErrorResponse>(
        { error: 'subject는 비어 있지 않은 문자열이어야 합니다.' },
        { status: 400 },
      );
    }

    if (typeof body.examDate !== 'string' || !body.examDate.trim()) {
      return NextResponse.json<ApiErrorResponse>(
        { error: 'examDate는 비어 있지 않은 문자열이어야 합니다.' },
        { status: 400 },
      );
    }

    if (!isValidIsoDate(body.examDate)) {
      return NextResponse.json<ApiErrorResponse>(
        { error: 'examDate는 YYYY-MM-DD 형식의 올바른 날짜여야 합니다.' },
        { status: 400 },
      );
    }

    if (!Array.isArray(body.keywords) || body.keywords.some((keyword) => typeof keyword !== 'string')) {
      return NextResponse.json<ApiErrorResponse>(
        { error: 'keywords는 문자열 배열이어야 합니다.' },
        { status: 400 },
      );
    }

    if (
      body.concepts !== undefined &&
      (!Array.isArray(body.concepts) || body.concepts.some((concept) => typeof concept !== 'string'))
    ) {
      return NextResponse.json<ApiErrorResponse>(
        { error: 'concepts는 문자열 배열이어야 합니다.' },
        { status: 400 },
      );
    }

    const subject = body.subject.trim();
    const examDate = body.examDate.trim();
    const keywords = body.keywords;
    const concepts = body.concepts ?? [];

    if (isMockApiEnabled()) {
      return NextResponse.json<PlanResponse>(
        normalizePlanResponse(getMockPlan(subject, examDate, keywords, concepts)),
      );
    }

    try {
      const prompt = planPrompt(subject, examDate, keywords, concepts, calculateDday(examDate));
      const plan = await createJsonCompletion<PlanResponse>({
        system: prompt.system,
        user: prompt.user,
        parse: parsePlanResponse,
      });

      return NextResponse.json<PlanResponse>(normalizePlanResponse(plan));
    } catch {
      const fallback = getPlanFallback({ subject, examDate, keywords, concepts });
      return NextResponse.json<PlanResponse>(normalizePlanResponse(studyPlanToResponse(fallback)));
    }
  } catch {
    return NextResponse.json<ApiErrorResponse>(
      { error: '학습 계획 요청을 처리하지 못했습니다.' },
      { status: 500 },
    );
  }
}

function studyPlanToResponse(plan: StudyPlan): PlanResponse {
  return {
    today: toLegacyStudyTasks(plan.today),
    days: toLegacyPlanDays(plan),
  };
}

function parsePlanResponse(raw: string): PlanResponse {
  const parsed = JSON.parse(raw) as Partial<PlanResponse> & {
    today?: unknown;
    days?: unknown;
  };

  return normalizePlanResponse(parsed);
}

function normalizePlanResponse(value: {
  today?: unknown;
  days?: unknown;
}): PlanResponse {
  if (!Array.isArray(value.today) || !Array.isArray(value.days)) {
    throw new Error('OpenAI 응답 형식이 올바르지 않습니다.');
  }

  const today = value.today.map((task, index) => normalizeStudyTask(task, `today-task-${index + 1}`));

  if (today.length === 0) {
    throw new Error('today에는 1개 이상의 task가 필요합니다.');
  }

  const days: PlanDay[] = value.days.map((day, dayIndex) => normalizePlanDay(day, dayIndex));

  if (days.length === 0) {
    throw new Error('days에는 1개 이상의 날짜가 필요합니다.');
  }

  return { today, days };
}

function normalizePlanDay(value: unknown, dayIndex: number): PlanDay {
  if (!value || typeof value !== 'object') {
    throw new Error('OpenAI 응답 형식이 올바르지 않습니다.');
  }

  const day = value as {
    date?: unknown;
    label?: unknown;
    title?: unknown;
    day?: unknown;
    tasks?: unknown;
  };

  if (typeof day.date !== 'string' || !day.date.trim()) {
    throw new Error('days.date는 YYYY-MM-DD 문자열이어야 합니다.');
  }

  const label =
    typeof day.label === 'string' && day.label.trim()
      ? day.label.trim()
      : typeof day.title === 'string' && day.title.trim()
        ? day.title.trim()
        : `Day ${dayIndex + 1}`;

  if (!Array.isArray(day.tasks) || day.tasks.length === 0) {
    throw new Error('days.tasks에는 1개 이상의 task가 필요합니다.');
  }

  const dayNumber = typeof day.day === 'number' ? day.day : dayIndex + 1;

  return {
    date: day.date.trim(),
    label,
    tasks: day.tasks.map((task, taskIndex) =>
      normalizeStudyTask(task, `day-${dayNumber}-task-${taskIndex + 1}`),
    ),
  };
}

function normalizeStudyTask(value: unknown, fallbackId: string): StudyTask {
  if (typeof value === 'string') {
    const title = value.trim();

    if (!title) {
      throw new Error('StudyTask.title이 없는 task가 있습니다.');
    }

    return { id: fallbackId, title };
  }

  if (!value || typeof value !== 'object') {
    throw new Error('StudyTask.title이 없는 task가 있습니다.');
  }

  const task = value as Partial<StudyTask> & { text?: unknown };

  const title =
    typeof task.title === 'string' && task.title.trim()
      ? task.title.trim()
      : typeof task.text === 'string' && task.text.trim()
        ? task.text.trim()
        : '';

  if (!title) {
    throw new Error('StudyTask.title이 없는 task가 있습니다.');
  }

  const id = typeof task.id === 'string' && task.id.trim() ? task.id.trim() : fallbackId;

  return {
    id,
    title,
    ...(typeof task.description === 'string' && task.description.trim()
      ? { description: task.description.trim() }
      : {}),
  };
}
