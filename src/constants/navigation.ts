import type { StudyTabId } from '@/types/study';

export const NAVIGATION_ITEMS: Array<{
  id: StudyTabId;
  label: string;
  description: string;
}> = [
  { id: 'today', label: 'Today', description: '오늘 할 공부' },
  { id: 'materials', label: 'Materials', description: '자료 업로드/요약' },
  { id: 'questions', label: 'Questions', description: '자료 기반 질문' },
  { id: 'quiz', label: 'Quiz', description: '보너스 문제 생성' },
];
