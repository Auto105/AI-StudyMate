import { NextResponse } from 'next/server';
import { invalidJsonBodyResponse, readJsonBody } from '@/lib/api/request';
import { getMockChatResponse } from '@/lib/mock/chat';
import { isMockApiEnabled } from '@/lib/mock/config';
import type { ApiErrorResponse, ChatRequest, ChatResponse } from '@/types/api';

export async function POST(request: Request) {
  try {
    const result = await readJsonBody<Partial<ChatRequest>>(request);

    if (!result.success) {
      return invalidJsonBodyResponse();
    }

    const body = result.data;

    if (typeof body.text !== 'string') {
      return NextResponse.json<ApiErrorResponse>(
        { error: 'text는 문자열이어야 합니다.' },
        { status: 400 },
      );
    }

    if (typeof body.question !== 'string' || !body.question.trim()) {
      return NextResponse.json<ApiErrorResponse>(
        { error: 'question은 비어 있지 않은 문자열이어야 합니다.' },
        { status: 400 },
      );
    }

    if (!body.text.trim()) {
      return NextResponse.json<ChatResponse>({
        answer: '자료에 없습니다. 먼저 학습자료를 추가하세요.',
        grounded: false,
      });
    }

    if (isMockApiEnabled()) {
      return NextResponse.json<ChatResponse>(getMockChatResponse(body.question));
    }

    return NextResponse.json<ApiErrorResponse>(
      { error: '실제 OpenAI 질문 답변 구현은 아직 연결되지 않았습니다.' },
      { status: 501 },
    );
  } catch {
    return NextResponse.json<ApiErrorResponse>(
      { error: '질문 요청을 처리하지 못했습니다.' },
      { status: 500 },
    );
  }
}
