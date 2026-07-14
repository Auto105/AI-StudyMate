import type { SummarizeResponse } from '@/types/api';

export type MockStudyTopic = 'network' | 'os' | 'general';

const NETWORK_TERMS = [
  'network',
  'networks',
  'mobility',
  'mobile',
  'wireless',
  'wifi',
  'wi-fi',
  'tcp',
  'udp',
  'ip',
  'routing',
  'router',
  'handoff',
  'latency',
  'bandwidth',
  '네트워크',
  '무선',
  '이동성',
  '모빌리티',
  '라우팅',
  '라우터',
  '대역폭',
  '지연',
];

const OS_TERMS = [
  'process',
  'thread',
  'operating system',
  'os',
  'cpu scheduling',
  'scheduler',
  'context switch',
  'memory',
  '프로세스',
  '스레드',
  '운영체제',
  '스케줄링',
  '문맥 교환',
  '메모리',
];

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

export const networkMockSummary: SummarizeResponse = {
  keywords: ['컴퓨터네트워크', 'TCP', '무선 네트워크', 'Mobility'],
  concepts: [
    'TCP는 신뢰성 있는 전송을 위해 연결 관리, 순서 보장, 재전송, 흐름 제어를 제공한다.',
    '무선 네트워크는 이동 단말의 위치 변화와 신호 세기 변화 때문에 handoff와 연결 품질 관리가 중요하다.',
    'Mobility는 사용자가 이동해도 IP 연결과 세션을 유지하도록 네트워크가 경로와 접속 지점을 조정하는 개념이다.',
  ],
  easyExplain:
    '컴퓨터네트워크 자료의 핵심은 데이터를 안정적으로 보내는 TCP와, 이동 중에도 연결을 유지하는 무선 네트워크/Mobility입니다. 시험 전에는 TCP의 신뢰성 보장 방식과 이동 환경에서 handoff가 필요한 이유를 우선 정리하세요.',
};

export const generalMockSummary: SummarizeResponse = {
  keywords: ['핵심 주제', '주요 개념', '예시', '복습 포인트'],
  concepts: [
    '자료의 핵심 주제를 먼저 파악하고 관련 용어를 연결해서 이해한다.',
    '중요 개념은 정의, 예시, 비교 기준을 함께 정리하면 기억하기 쉽다.',
    '시험 전에는 요약 키워드를 보고 전체 내용을 직접 설명하는 방식으로 복습한다.',
  ],
  easyExplain:
    '이 자료는 특정 키워드가 강하게 드러나지 않아 일반 학습자료로 분류했습니다. 먼저 핵심 주제와 주요 용어를 뽑고, 각 개념을 예시와 함께 설명할 수 있는지 확인하는 것이 좋습니다.',
};

export function getMockSummary(text: string): SummarizeResponse {
  const topic = detectMockStudyTopic(text);

  if (topic === 'network') {
    return cloneSummary(networkMockSummary);
  }

  if (topic === 'os') {
    return cloneSummary(mockSummary);
  }

  return cloneSummary(generalMockSummary);
}

export function detectMockStudyTopic(text: string): MockStudyTopic {
  const normalizedText = text.toLowerCase();

  if (includesAnyTerm(normalizedText, NETWORK_TERMS)) {
    return 'network';
  }

  if (includesAnyTerm(normalizedText, OS_TERMS)) {
    return 'os';
  }

  return 'general';
}

function includesAnyTerm(text: string, terms: string[]) {
  return terms.some((term) => text.includes(term));
}

function cloneSummary(summary: SummarizeResponse): SummarizeResponse {
  return {
    keywords: [...summary.keywords],
    concepts: [...summary.concepts],
    easyExplain: summary.easyExplain,
  };
}
