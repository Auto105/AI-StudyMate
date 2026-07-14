import { NextResponse } from 'next/server';
import { invalidJsonBodyResponse, readJsonBody } from '@/lib/api/request';
import { isMockApiEnabled } from '@/lib/mock/config';
import { getMockSummary } from '@/lib/mock/summary';
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

    return NextResponse.json<ApiErrorResponse>(
      { error: '실제 OpenAI 요약 구현은 아직 연결되지 않았습니다.' },
      { status: 501 },
    );
  } catch {
    return NextResponse.json<ApiErrorResponse>(
      { error: '요약 요청을 처리하지 못했습니다.' },
      { status: 500 },
    );
  }
}
