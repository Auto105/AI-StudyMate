import { detectMockStudyTopic } from '@/lib/mock/summary';
import type { QuizResponse } from '@/types/api';

export const mockQuiz: QuizResponse = {
  mcq: [
    {
      id: 'mcq-process-thread',
      question: '프로세스와 스레드의 주요 차이점은 무엇인가요?',
      choices: [
        '프로세스는 메모리를 공유하지만 스레드는 독립적인 메모리를 가진다.',
        '스레드는 프로세스 내의 실행 단위이며, 같은 프로세스의 스레드들은 메모리를 공유한다.',
        '프로세스는 운영체제에 의해 생성되고, 스레드는 하드웨어에 의해 생성된다.',
        '둘 사이에는 기술적인 차이가 없으며 단순히 용어의 차이이다.',
      ],
      answer: '스레드는 프로세스 내의 실행 단위이며, 같은 프로세스의 스레드들은 메모리를 공유한다.',
      explanation:
        '프로세스는 독립적인 자원을 할당받는 실행 단위이고, 스레드는 프로세스 안에서 실행되며 같은 프로세스의 자원 일부를 공유합니다.',
    },
  ],
  ox: [
    {
      id: 'ox-os-resource',
      statement: '운영체제는 CPU, 메모리 같은 컴퓨터 자원을 관리한다.',
      answer: true,
      explanation: '운영체제의 핵심 역할 중 하나는 시스템 자원 관리입니다.',
    },
  ],
};

const networkMockQuiz: QuizResponse = {
  mcq: [
    {
      id: 'mcq-network-tcp',
      question: 'TCP가 신뢰성 있는 전송을 제공하기 위해 사용하는 방법으로 가장 적절한 것은?',
      choices: [
        '패킷을 암호화해서 무조건 빠르게 전송한다.',
        '순서 번호, ACK, 재전송, 흐름 제어를 사용한다.',
        '무선 신호 세기를 높이기 위해 CPU 스케줄링을 수행한다.',
        '모든 데이터를 UDP로 변환해서 지연을 없앤다.',
      ],
      answer: '순서 번호, ACK, 재전송, 흐름 제어를 사용한다.',
      explanation:
        'TCP는 순서 보장, ACK 기반 확인, 손실 시 재전송, 흐름 제어를 통해 신뢰성 있는 전송을 제공합니다.',
    },
  ],
  ox: [
    {
      id: 'ox-network-mobility',
      statement: 'Mobility 환경에서는 단말이 이동해도 연결을 유지하기 위한 handoff 관리가 중요하다.',
      answer: true,
      explanation: '무선 네트워크에서는 사용자가 이동하면서 접속 지점이 바뀔 수 있으므로 handoff가 중요합니다.',
    },
  ],
};

const generalMockQuiz: QuizResponse = {
  mcq: [
    {
      id: 'mcq-general-study',
      question: '일반 학습자료를 복습할 때 가장 먼저 해야 할 일은 무엇인가요?',
      choices: [
        '모든 문장을 그대로 암기한다.',
        '핵심 주제와 주요 용어를 먼저 정리한다.',
        '자료와 관계없는 예상 문제만 푼다.',
        '어려운 부분을 건너뛰고 마지막 페이지만 본다.',
      ],
      answer: '핵심 주제와 주요 용어를 먼저 정리한다.',
      explanation: '핵심 주제와 주요 용어를 먼저 잡으면 세부 내용을 연결해서 이해하기 쉽습니다.',
    },
  ],
  ox: [
    {
      id: 'ox-general-example',
      statement: '중요 개념은 정의와 예시를 함께 정리하면 복습 효과가 높아진다.',
      answer: true,
      explanation: '정의만 암기하는 것보다 예시와 비교 기준을 함께 정리하는 편이 이해에 도움이 됩니다.',
    },
  ],
};

export function getMockQuiz(text: string): QuizResponse {
  const topic = detectMockStudyTopic(text);

  if (topic === 'network') {
    return cloneQuiz(networkMockQuiz);
  }

  if (topic === 'os') {
    return cloneQuiz(mockQuiz);
  }

  return cloneQuiz(generalMockQuiz);
}

function cloneQuiz(quiz: QuizResponse): QuizResponse {
  return {
    mcq: quiz.mcq.map((question) => ({
      ...question,
      choices: [...question.choices],
    })),
    ox: quiz.ox.map((question) => ({ ...question })),
  };
}
