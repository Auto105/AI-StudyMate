import OpenAI from 'openai';

export const MAX_STUDY_TEXT_LENGTH = 12_000;

export class OpenAIConfigError extends Error {
  constructor(message = 'OPENAI_API_KEY가 설정되지 않았습니다.') {
    super(message);
    this.name = 'OpenAIConfigError';
  }
}

export function truncateText(text: string, maxLength = MAX_STUDY_TEXT_LENGTH): string {
  const trimmed = text.trim();

  if (trimmed.length <= maxLength) {
    return trimmed;
  }

  return trimmed.slice(0, maxLength);
}

export function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY?.trim();

  if (!apiKey) {
    throw new OpenAIConfigError();
  }

  return new OpenAI({ apiKey });
}

export async function parseJsonWithRetry<T>(
  request: () => Promise<string>,
  parse: (raw: string) => T,
  retries = 1,
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const raw = await request();
      return parse(raw);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error ? lastError : new Error('JSON 파싱에 실패했습니다.');
}

export async function createJsonCompletion<T>(options: {
  system: string;
  user: string;
  parse: (raw: string) => T;
  model?: string;
  retries?: number;
}): Promise<T> {
  const client = getOpenAIClient();
  const model = options.model ?? 'gpt-4o-mini';
  const retries = options.retries ?? 1;

  return parseJsonWithRetry(
    async () => {
      const response = await client.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: options.system },
          { role: 'user', content: options.user },
        ],
        response_format: { type: 'json_object' },
      });

      const content = response.choices[0]?.message?.content;

      if (!content) {
        throw new Error('OpenAI 응답이 비어 있습니다.');
      }

      return content;
    },
    options.parse,
    retries,
  );
}
