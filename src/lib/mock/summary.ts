import type { SummarizeResponse } from '@/types/api';

export const mockSummary: SummarizeResponse = {
  keywords: ['운영체제', '프로세스', '스레드', 'CPU 스케줄링'],
  concepts: [
    '운영체제는 컴퓨터 자원을 관리하고 프로그램 실행 환경을 제공한다.',
    '프로세스는 실행 중인 프로그램으로 독립적인 자원을 할당받는 단위다.',
    '스레드는 프로세스 안에서 실행되는 작업 흐름이며 메모리 일부를 공유한다.',
  ],
  easyExplain:
    '운영체제는 여러 프로그램이 동시에 실행되도록 CPU와 메모리 같은 자원을 조율합니다. 프로세스는 실행 중인 프로그램이고, 스레드는 그 안에서 실제 작업을 나누어 수행하는 단위입니다.',
};
