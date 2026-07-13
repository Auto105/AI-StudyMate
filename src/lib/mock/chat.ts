import type { ChatResponse } from '@/types/api';

export function getMockChatResponse(question: string): ChatResponse {
  const normalizedQuestion = question.toLowerCase();

  if (normalizedQuestion.includes('프로세스') || normalizedQuestion.includes('스레드')) {
    return {
      answer:
        '프로세스는 실행 중인 프로그램 단위이고, 스레드는 프로세스 안에서 실행되는 작업 단위입니다. 같은 프로세스의 스레드는 메모리 일부를 공유합니다.',
      grounded: true,
    };
  }

  return {
    answer: '자료에 없습니다.',
    grounded: false,
  };
}
