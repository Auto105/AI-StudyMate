import { NextResponse } from 'next/server';
import { isMockApiEnabled } from '@/lib/mock/config';
import { mockQuiz } from '@/lib/mock/quiz';
import type { ApiErrorResponse, QuizRequest, QuizResponse } from '@/types/api';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<QuizRequest>;

    if (typeof body.text !== 'string' || !body.text.trim()) {
      return NextResponse.json<ApiErrorResponse>(
        { error: 'text는 비어 있지 않은 문자열이어야 합니다.' },
        { status: 400 },
      );
    }

    if (isMockApiEnabled()) {
      return NextResponse.json<QuizResponse>(mockQuiz);
    }

    return NextResponse.json<ApiErrorResponse>(
      { error: '실제 퀴즈 생성 구현은 아직 연결되지 않았습니다.' },
      { status: 501 },
    );
  } catch {
    return NextResponse.json<ApiErrorResponse>(
      { error: '퀴즈 요청을 처리하지 못했습니다.' },
      { status: 500 },
    );
  }
}
