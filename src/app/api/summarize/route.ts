import { NextResponse } from 'next/server';
import { invalidJsonBodyResponse, readJsonBody } from '@/lib/api/request';
import { isMockApiEnabled } from '@/lib/mock/config';
import { getMockSummary } from '@/lib/mock/summary';
import { createJsonCompletion, truncateText } from '@/lib/openai';
import { summarizePrompt } from '@/lib/prompts';
import type { ApiErrorResponse, SummarizeRequest, SummarizeResponse } from '@/types/api';

export async function POST(request: Request) {
  try {
    const result = await readJsonBody<Partial<SummarizeRequest>>(request);

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
      return NextResponse.json<SummarizeResponse>(getMockSummary(body.text));
    }

    const prompt = summarizePrompt(truncateText(body.text));
    const summary = await createJsonCompletion<SummarizeResponse>({
      system: prompt.system,
      user: prompt.user,
      parse: parseSummarizeResponse,
    });

    return NextResponse.json<SummarizeResponse>(summary);
  } catch (error) {
    const message = error instanceof Error ? error.message : '요약 요청을 처리하지 못했습니다.';

    return NextResponse.json<ApiErrorResponse>({ error: message }, { status: 500 });
  }
}

function parseSummarizeResponse(raw: string): SummarizeResponse {
  const parsed = JSON.parse(raw) as Partial<SummarizeResponse>;

  if (
    !Array.isArray(parsed.keywords) ||
    parsed.keywords.some((keyword) => typeof keyword !== 'string') ||
    !Array.isArray(parsed.concepts) ||
    parsed.concepts.some((concept) => typeof concept !== 'string') ||
    typeof parsed.easyExplain !== 'string'
  ) {
    throw new Error('OpenAI 응답 형식이 올바르지 않습니다.');
  }

  return {
    keywords: parsed.keywords,
    concepts: parsed.concepts,
    easyExplain: parsed.easyExplain,
  };
}
