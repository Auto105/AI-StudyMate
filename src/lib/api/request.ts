import { NextResponse } from 'next/server';
import type { ApiErrorResponse } from '@/types/api';

export const INVALID_JSON_BODY_ERROR = 'Invalid JSON body.' as const;

export type ReadJsonBodyResult<T> =
  | { success: true; data: T }
  | { success: false };

export async function readJsonBody<T>(request: Request): Promise<ReadJsonBodyResult<T>> {
  try {
    return {
      success: true,
      data: (await request.json()) as T,
    };
  } catch {
    return { success: false };
  }
}

export function invalidJsonBodyResponse() {
  return NextResponse.json<ApiErrorResponse>(
    { error: INVALID_JSON_BODY_ERROR },
    { status: 400 },
  );
}
