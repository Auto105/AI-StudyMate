import { NextResponse } from 'next/server';
import { invalidJsonBodyResponse, readJsonBody } from '@/lib/api/request';
import { getMockChatResponse } from '@/lib/mock/chat';
import { isMockApiEnabled } from '@/lib/mock/config';
import { createJsonCompletion, truncateText } from '@/lib/openai';
import { chatPrompt } from '@/lib/prompts';
import type { ApiErrorResponse, ChatRequest, ChatResponse } from '@/types/api';

export async function POST(request: Request) {
  try {
    const result = await readJsonBody<Partial<ChatRequest>>(request);

    if (!result.success) {
      return invalidJsonBodyResponse();
    }

    const body = result.data;

    if (typeof body.text !== 'string') {
      return NextResponse.json<ApiErrorResponse>({ error: 'text는 문자열이어야 합니다.' }, { status: 400 });
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
      return NextResponse.json<ChatResponse>(getMockChatResponse(body.text, body.question));
    }

    const prompt = chatPrompt(truncateText(body.text), body.question.trim());
    const response = await createJsonCompletion<ChatResponse>({
      system: prompt.system,
      user: prompt.user,
      parse: parseChatResponse,
    });

    return NextResponse.json<ChatResponse>(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : '질문 요청을 처리하지 못했습니다.';

    return NextResponse.json<ApiErrorResponse>({ error: message }, { status: 500 });
  }
}

function parseChatResponse(raw: string): ChatResponse {
  const parsed = JSON.parse(raw) as Partial<ChatResponse>;

  if (typeof parsed.answer !== 'string' || typeof parsed.grounded !== 'boolean') {
    throw new Error('OpenAI 응답 형식이 올바르지 않습니다.');
  }

  return {
    answer: parsed.answer,
    grounded: parsed.grounded,
  };
}
