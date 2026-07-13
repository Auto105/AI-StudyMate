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
        '자료에 따르면 프로세스는 운영체제로부터 자원을 할당받는 실행 단위이고, 스레드는 프로세스 안에서 실행되는 작업 흐름입니다. 프로세스는 독립적인 메모리 공간을 가지지만, 같은 프로세스 안의 스레드들은 Code, Data, Heap 영역을 공유합니다. 그래서 스레드는 통신이 빠른 대신 동기화 문제를 주의해야 합니다.',
      grounded: true,
    };
  }

  if (normalizedQuestion.includes('핵심') || normalizedQuestion.includes('용어')) {
    return {
      answer:
        '이 자료에서 핵심은 운영체제, 프로세스, 스레드, CPU 스케줄링입니다. 시험 전에는 프로세스와 스레드의 자원 공유 차이, 문맥 교환 비용, PCB에 저장되는 정보를 우선 확인하세요.',
      grounded: true,
    };
  }

  return {
    answer: '자료에 없습니다.',
    grounded: false,
  };
}
