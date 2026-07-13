import { NextResponse } from 'next/server';
import { invalidJsonBodyResponse, readJsonBody } from '@/lib/api/request';
import { isValidIsoDate } from '@/lib/date';
import { isMockApiEnabled } from '@/lib/mock/config';
import { getMockPlan } from '@/lib/mock/plan';
import type { ApiErrorResponse, PlanRequest, PlanResponse } from '@/types/api';

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

    if (isMockApiEnabled()) {
      return NextResponse.json<PlanResponse>(
        getMockPlan(body.subject, body.examDate, body.keywords, body.concepts ?? []),
      );
    }

    return NextResponse.json<ApiErrorResponse>(
      { error: '실제 학습 계획 생성 구현은 아직 연결되지 않았습니다.' },
      { status: 501 },
    );
  } catch {
    return NextResponse.json<ApiErrorResponse>(
      { error: '학습 계획 요청을 처리하지 못했습니다.' },
      { status: 500 },
    );
  }
}
