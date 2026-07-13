import { NextResponse } from 'next/server';
import { validatePdfFile } from '@/lib/pdf';
import { extractTextFromPdfFile } from '@/lib/server/pdf';
import type { ApiErrorResponse, UploadResponse } from '@/types/api';

const MAX_TEXT_LENGTH = 12_000;

export const runtime = 'nodejs';

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
      const validation = await validatePdfFile(fileValue);

      if (!validation.valid) {
        return NextResponse.json<ApiErrorResponse>({ error: validation.error }, { status: 400 });
      }

      const text = await extractTextFromPdfFile(fileValue);

      return NextResponse.json<UploadResponse>({
        text: text.slice(0, MAX_TEXT_LENGTH),
        truncated: text.length > MAX_TEXT_LENGTH,
      });
    }

    return NextResponse.json<ApiErrorResponse>(
      { error: 'text or file field is required.' },
      { status: 400 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to process upload request.';

    return NextResponse.json<ApiErrorResponse>({ error: message }, { status: 500 });
  }
}
