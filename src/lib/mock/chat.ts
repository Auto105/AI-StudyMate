import type { ChatResponse } from '@/types/api';

export function getMockChatResponse(question: string): ChatResponse {
  const normalizedQuestion = question.toLowerCase();

  if (
    normalizedQuestion.includes('프로세스') ||
    normalizedQuestion.includes('스레드') ||
    normalizedQuestion.includes('process') ||
    normalizedQuestion.includes('thread')
  ) {
    return {
      answer:
        '프로세스는 실행 중인 프로그램의 독립적인 자원 단위이고, 스레드는 프로세스 안에서 실행되는 작업 흐름입니다. 같은 프로세스 안의 스레드는 메모리 일부를 공유할 수 있어 효율적이지만 동기화 문제가 생길 수 있습니다.',
      grounded: true,
    };
  }

  return {
    answer: '자료에 없습니다.',
    grounded: false,
  };
}
