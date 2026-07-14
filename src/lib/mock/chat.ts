import { detectMockStudyTopic } from '@/lib/mock/summary';
import type { ChatResponse } from '@/types/api';

export function getMockChatResponse(textOrQuestion: string, maybeQuestion?: string): ChatResponse {
  const text = maybeQuestion === undefined ? textOrQuestion : textOrQuestion;
  const question = maybeQuestion ?? textOrQuestion;
  const normalizedQuestion = question.toLowerCase();
  const topic = detectMockStudyTopic(`${text} ${question}`);

  if (topic === 'network') {
    if (
      normalizedQuestion.includes('tcp') ||
      normalizedQuestion.includes('wireless') ||
      normalizedQuestion.includes('mobility') ||
      normalizedQuestion.includes('network') ||
      normalizedQuestion.includes('핵심') ||
      normalizedQuestion.includes('용어') ||
      normalizedQuestion.includes('네트워크') ||
      normalizedQuestion.includes('무선')
    ) {
      return {
        answer:
          '자료에 따르면 핵심은 TCP의 신뢰성 보장과 무선 네트워크의 이동성 관리입니다. TCP는 순서 보장, 재전송, 흐름 제어로 데이터를 안정적으로 전달하고, wireless/mobility 환경에서는 단말이 이동해도 handoff를 통해 연결을 유지하는 점이 중요합니다.',
        grounded: true,
      };
    }

    return {
      answer: '자료에 없습니다.',
      grounded: false,
    };
  }

  if (topic === 'os') {
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

  if (
    normalizedQuestion.includes('핵심') ||
    normalizedQuestion.includes('요약') ||
    normalizedQuestion.includes('용어') ||
    normalizedQuestion.includes('정리')
  ) {
    return {
      answer:
        '이 자료는 일반 학습자료로 분류됩니다. 핵심 주제, 주요 개념, 예시, 복습 포인트를 먼저 정리하고 각 개념을 자신의 말로 설명해 보세요.',
      grounded: true,
    };
  }

  return {
    answer: '자료에 없습니다.',
    grounded: false,
  };
}
