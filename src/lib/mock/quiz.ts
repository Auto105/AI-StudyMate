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
