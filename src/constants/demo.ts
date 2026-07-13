import { toIsoDate } from '@/lib/date';
import { getDDay } from '@/lib/utils/date';
import type { ChatMessage, StudyProfile, StudyTask } from '@/types/study';

export const DEMO_SUBJECT = '운영체제';

export function getDemoExamDate() {
  const date = new Date();
  date.setDate(date.getDate() + 5);
  return toIsoDate(date);
}

export const DEMO_STUDY_PROFILE: StudyProfile = {
  subject: DEMO_SUBJECT,
  examDate: getDemoExamDate(),
};

export const DEMO_D5_TODAY_TASKS: StudyTask[] = [
  { id: 'read-os-summary', title: '운영체제 핵심 요약 읽기' },
  { id: 'compare-process-thread', title: '프로세스와 스레드 차이 정리하기' },
  { id: 'review-core-concepts', title: '시험 핵심 개념 복습하기' },
];

export const DEMO_D2_TODAY_TASKS: StudyTask[] = [
  { id: 'review-process-thread', title: '프로세스와 스레드 차이 10분 복습하기' },
  { id: 'check-keywords', title: '요약 키워드만 빠르게 다시 보기' },
  { id: 'final-question-check', title: '헷갈리는 개념 1개를 질문으로 확인하기' },
];

export function getDemoTodayTasks(examDate: string) {
  return getDDay(examDate) === 'D-2' ? DEMO_D2_TODAY_TASKS : DEMO_D5_TODAY_TASKS;
}

export const DEMO_MATERIAL_TEXT =
  '운영체제는 컴퓨터 하드웨어와 응용 프로그램 사이에서 자원을 관리한다. 프로세스는 실행 중인 프로그램이고, 스레드는 프로세스 안에서 실행되는 작업 단위다. CPU 스케줄링은 여러 프로세스 중 어떤 작업을 먼저 실행할지 정하는 방식이다.';

export const DEMO_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'assistant-empty',
    role: 'assistant',
    content: '반가워요! 자료의 어떤 부분이 궁금하신가요?',
    grounded: true,
  },
  {
    id: 'user-demo-process-thread',
    role: 'user',
    content: '프로세스와 스레드의 차이는 무엇인가요?',
  },
  {
    id: 'assistant-demo-process-thread',
    role: 'assistant',
    content:
      '자료 "운영체제 3주차 강의노트"에 따르면 프로세스는 운영체제로부터 자원을 할당받는 작업의 단위이고, 스레드는 프로세스가 할당받은 자원을 이용하는 실행의 단위입니다. 프로세스는 독립적인 메모리 영역을 가지지만, 같은 프로세스 안의 스레드는 Code, Data, Heap 영역을 공유합니다.',
    grounded: true,
  },
];
