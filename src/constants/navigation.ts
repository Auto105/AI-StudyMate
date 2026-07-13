import type { StudyTabId } from '@/types/study';

export const NAVIGATION_ITEMS: Array<{
  id: StudyTabId;
  label: string;
  description: string;
}> = [
  { id: 'today', label: '오늘', description: '오늘의 학습 계획' },
  { id: 'materials', label: '자료', description: '자료 업로드와 요약' },
  { id: 'questions', label: '질문', description: '자료 기반 질문' },
  { id: 'quiz', label: '퀴즈', description: '보너스 문제 생성' },
];
