import { getDDay } from '@/lib/utils/date';
import { toIsoDate } from '@/lib/date';
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
  { id: 'review-core-concepts', title: '시험 전 핵심 개념 복습하기' },
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
  '운영체제는 컴퓨터 하드웨어와 응용 프로그램 사이에서 자원을 관리한다. 프로세스는 실행 중인 프로그램이고, 스레드는 프로세스 안에서 실행되는 작업 단위이다. CPU 스케줄링은 여러 프로세스 중 어떤 작업을 먼저 실행할지 정하는 방식이다.';

export const DEMO_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'assistant-empty',
    role: 'assistant',
    content: '자료를 추가하면 그 내용 안에서만 답할게요.',
    grounded: true,
  },
  {
    id: 'assistant-not-found',
    role: 'assistant',
    content: '자료에 없습니다. 업로드한 학습자료에는 해당 내용이 포함되어 있지 않습니다.',
    grounded: false,
  },
];
