import type { QuizResponse } from '@/types/api';

export const mockQuiz: QuizResponse = {
  mcq: [
    {
      id: 'mcq-process-thread',
      question: '프로세스와 스레드에 대한 설명으로 가장 적절한 것은?',
      choices: [
        '프로세스는 실행 중인 프로그램이고 스레드는 프로세스 안의 실행 단위이다.',
        '스레드는 항상 독립적인 주소 공간을 가진다.',
        '프로세스는 운영체제와 관계없이 실행된다.',
        '스레드는 파일 시스템만 관리한다.',
      ],
      answer: '프로세스는 실행 중인 프로그램이고 스레드는 프로세스 안의 실행 단위이다.',
      explanation: '프로세스는 독립적인 자원을 가지며, 스레드는 프로세스 내부에서 작업을 나누어 실행한다.',
    },
  ],
  ox: [
    {
      id: 'ox-os-resource',
      statement: '운영체제는 CPU, 메모리 같은 컴퓨터 자원을 관리한다.',
      answer: true,
      explanation: '운영체제의 핵심 역할 중 하나는 시스템 자원 관리이다.',
    },
  ],
};
