import type {
  ChatRequest,
  ChatResponse,
  PlanRequest,
  PlanResponse,
  QuizRequest,
  QuizResponse,
  SummarizeRequest,
  SummarizeResponse,
  UploadResponse,
} from '@/types/api';

async function postJson<TResponse, TRequest>(url: string, body: TRequest): Promise<TResponse> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(payload?.error ?? 'API 요청에 실패했습니다.');
  }

  return response.json() as Promise<TResponse>;
}

export function uploadMaterial(formData: FormData) {
  return fetch('/api/upload', {
    method: 'POST',
    body: formData,
  }).then(async (response) => {
    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      throw new Error(payload?.error ?? '업로드 요청에 실패했습니다.');
    }

    return response.json() as Promise<UploadResponse>;
  });
}

export function summarizeMaterial(body: SummarizeRequest) {
  return postJson<SummarizeResponse, SummarizeRequest>('/api/summarize', body);
}

export function askQuestion(body: ChatRequest) {
  return postJson<ChatResponse, ChatRequest>('/api/chat', body);
}

export function createStudyPlan(body: PlanRequest) {
  return postJson<PlanResponse, PlanRequest>('/api/plan', body);
}

export function createQuiz(body: QuizRequest) {
  return postJson<QuizResponse, QuizRequest>('/api/quiz', body);
}
