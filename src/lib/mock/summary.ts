import type { SummarizeResponse } from '@/types/api';

export const mockSummary: SummarizeResponse = {
  keywords: ['운영체제', '프로세스', '스레드', '자원 관리'],
  concepts: ['운영체제의 역할', '프로세스와 스레드의 차이', '시험 전 핵심 개념 정리'],
  easyExplain:
    '운영체제는 컴퓨터 자원을 관리하는 기본 소프트웨어입니다. 프로세스는 실행 중인 프로그램이고, 스레드는 프로세스 안에서 실제 작업을 나누어 수행하는 단위입니다.',
};
