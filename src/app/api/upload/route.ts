import { NextResponse } from 'next/server';
import type { ApiErrorResponse, UploadResponse } from '@/types/api';

const MAX_TEXT_LENGTH = 12_000;
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const textValue = formData.get('text');
    const fileValue = formData.get('file');

    if (typeof textValue === 'string' && textValue.trim()) {
      const text = textValue.trim();

      return NextResponse.json<UploadResponse>({
        text: text.slice(0, MAX_TEXT_LENGTH),
        truncated: text.length > MAX_TEXT_LENGTH,
      });
    }

    if (fileValue instanceof File) {
      if (fileValue.size > MAX_FILE_SIZE_BYTES) {
        return NextResponse.json<ApiErrorResponse>(
          { error: 'PDF 파일은 5MB 이하만 업로드할 수 있습니다.' },
          { status: 400 },
        );
      }

      return NextResponse.json<UploadResponse>({
        text: 'PDF 텍스트 추출은 아직 구현되지 않았습니다. 현재는 Mock 업로드 응답입니다.',
        truncated: false,
      });
    }

    return NextResponse.json<ApiErrorResponse>(
      { error: 'text 또는 file 필드가 필요합니다.' },
      { status: 400 },
    );
  } catch {
    return NextResponse.json<ApiErrorResponse>(
      { error: '업로드 요청을 처리하지 못했습니다.' },
      { status: 500 },
    );
  }
}
