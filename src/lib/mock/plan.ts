import { DEMO_D2_TODAY_TASKS, DEMO_D5_TODAY_TASKS, getDemoTodayTasks } from '@/constants/demo';
import type { PlanResponse } from '@/types/api';

export function getMockPlan(subject: string, examDate: string): PlanResponse {
  const today = new Date();
  const d2Date = new Date(today);
  const d5Date = new Date(today);
  d2Date.setDate(today.getDate() + 2);
  d5Date.setDate(today.getDate() + 5);

  const todayTasks = getDemoTodayTasks(examDate);

  return {
    today: todayTasks,
    days: [
      {
        date: today.toISOString().slice(0, 10),
        label: '오늘',
        tasks: todayTasks,
      },
      {
        date: d5Date.toISOString().slice(0, 10),
        label: 'D-5 예시',
        tasks: DEMO_D5_TODAY_TASKS,
      },
      {
        date: d2Date.toISOString().slice(0, 10),
        label: 'D-2 예시',
        tasks: DEMO_D2_TODAY_TASKS,
      },
      {
        date: examDate,
        label: '시험일 최종 점검',
        tasks: [{ id: 'final-review', title: `${subject} 핵심 개념만 적어보기` }],
      },
    ],
  };
}
