import type { SummarizeResponse } from '@/types/api';

export const mockSummary: SummarizeResponse = {
  keywords: ['운영체제', '프로세스', '스레드', 'CPU 스케줄링'],
  concepts: [
    '운영체제는 컴퓨터 자원을 관리하고 프로그램 실행을 돕는다.',
    '프로세스는 실행 중인 프로그램의 독립적인 자원 단위이다.',
    '스레드는 프로세스 안에서 실행되는 작업 흐름이며 메모리 일부를 공유한다.',
  ],
  easyExplain:
    '운영체제는 여러 프로그램이 동시에 잘 실행되도록 CPU와 메모리 같은 자원을 관리합니다. 프로세스는 실행 중인 프로그램이고, 스레드는 그 안에서 실제 작업을 나누어 수행하는 단위입니다.',
};
