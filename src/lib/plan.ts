import { calculateDday, getTodayIso, toIsoDate } from '@/lib/date';
import type { PlanDay, PlanInput, StudyPlan, StudyTask, SummaryResult } from '@/types/study';

const DEFAULT_KEYWORDS = ['프로세스', '스레드', 'CPU 스케줄링'];
const DEFAULT_CONCEPTS = [
  '프로세스는 독립적인 실행 단위이다.',
  '스레드는 프로세스 내부의 실행 흐름이다.',
  'CPU 스케줄링은 실행 순서를 정해 자원을 효율적으로 쓰게 한다.',
];

export function normalizePlanInput(input: PlanInput): PlanInput {
  return {
    subject: input.subject.trim() || '운영체제',
    examDate: input.examDate,
    keywords: normalizeStringList(input.keywords),
    concepts: normalizeStringList(input.concepts),
  };
}

export function createPlanInput(
  subject: string,
  examDate: string,
  summary?: SummaryResult | null,
): PlanInput {
  return normalizePlanInput({
    subject,
    examDate,
    keywords: summary?.keywords ?? [],
    concepts: summary?.concepts ?? [],
  });
}

export function getPlanLengthByDday(examDate: string, today = getTodayIso()) {
  const dday = calculateDday(examDate, today);

  if (dday === null || dday < 1) {
    return 1;
  }

  return Math.min(dday, 7);
}

export function selectFallbackPlanByDday(input: PlanInput, today = getTodayIso()): StudyPlan {
  const normalized = normalizePlanInput(input);
  const dday = calculateDday(normalized.examDate, today);
  const length = getPlanLengthByDday(normalized.examDate, today);
  const keywords = normalized.keywords.length > 0 ? normalized.keywords : DEFAULT_KEYWORDS;
  const concepts = normalized.concepts.length > 0 ? normalized.concepts : DEFAULT_CONCEPTS;

  if (dday !== null && dday <= 1) {
    return createFallbackPlan(normalized.subject, normalized.examDate, today, 1, [
      {
        title: '시험 직전 핵심 확인',
        tasks: [
          `${keywords[0]}와 ${keywords[1] ?? '핵심 개념'} 차이를 말로 설명한다.`,
          '요약의 핵심 개념만 빠르게 다시 읽는다.',
          '헷갈리는 질문 1개를 Questions에서 확인한다.',
        ],
      },
    ]);
  }

  if (dday !== null && dday <= 3) {
    return createFallbackPlan(normalized.subject, normalized.examDate, today, length, [
      {
        title: '핵심 개념 압축 정리',
        tasks: [`${keywords[0]} 중심으로 개념을 3줄 요약한다.`, concepts[0]],
      },
      {
        title: '비교 개념 복습',
        tasks: [`${keywords[0]}와 ${keywords[1] ?? '관련 개념'}를 표로 비교한다.`, concepts[1]],
      },
      {
        title: '최종 점검',
        tasks: ['요약 키워드를 보지 않고 설명한다.', '자료 기반 질문으로 약점을 확인한다.'],
      },
    ]);
  }

  if (dday !== null && dday <= 5) {
    return createFallbackPlan(normalized.subject, normalized.examDate, today, length, [
      {
        title: '자료 훑기와 요약 확인',
        tasks: ['강의자료 미리보기를 읽고 큰 흐름을 잡는다.', `${keywords[0]} 정의를 정리한다.`],
      },
      {
        title: '핵심 개념 정리',
        tasks: [concepts[0], concepts[1] ?? `${keywords[1] ?? '핵심 개념'}를 예시와 함께 정리한다.`],
      },
      {
        title: '연결 관계 이해',
        tasks: [`${keywords.slice(0, 3).join(', ')}의 관계를 도식화한다.`, concepts[2] ?? '중요 개념을 다시 설명한다.'],
      },
      {
        title: '자료 기반 질문',
        tasks: ['Questions 탭에서 헷갈리는 개념을 질문한다.', '답변이 자료에 근거하는지 확인한다.'],
      },
      {
        title: '시험 전 압축 복습',
        tasks: ['요약 키워드만 보고 전체 내용을 설명한다.', `${normalized.subject} 예상 질문 2개를 만들어 답한다.`],
      },
    ]);
  }

  return createFallbackPlan(normalized.subject, normalized.examDate, today, length, [
    {
      title: '전체 범위 파악',
      tasks: ['자료를 훑고 시험 범위를 나눈다.', `${keywords[0]}부터 가볍게 정리한다.`],
    },
    {
      title: '핵심 키워드 정리',
      tasks: [`${keywords.slice(0, 3).join(', ')}를 노트에 정리한다.`, concepts[0]],
    },
    {
      title: '개념 간 차이 비교',
      tasks: [`${keywords[0]}와 ${keywords[1] ?? '관련 개념'}의 차이를 표로 쓴다.`, concepts[1]],
    },
    {
      title: '예시로 설명하기',
      tasks: ['각 개념을 실제 예시 하나로 설명한다.', concepts[2]],
    },
    {
      title: '자료 기반 Q&A',
      tasks: ['Questions 탭에서 모르는 내용을 질문한다.', '자료에 없는 질문과 있는 질문을 구분한다.'],
    },
    {
      title: '약점 보완',
      tasks: ['틀리거나 헷갈린 개념만 다시 정리한다.', '요약 키워드를 암기한다.'],
    },
    {
      title: '최종 압축 복습',
      tasks: [`${normalized.subject} 핵심 개념을 10분 안에 설명한다.`, '시험 전 확인 목록을 만든다.'],
    },
  ]);
}

export function toLegacyPlanDays(plan: StudyPlan): PlanDay[] {
  return plan.days.map((day) => ({
    date: day.date,
    label: day.title,
    tasks: day.tasks.map((task, index) => ({
      id: `day-${day.day}-task-${index + 1}`,
      title: task,
    })),
  }));
}

export function toLegacyStudyTasks(tasks: string[]): StudyTask[] {
  return tasks.map((task, index) => ({
    id: `today-task-${index + 1}`,
    title: task,
  }));
}

function createFallbackPlan(
  subject: string,
  examDate: string,
  today: string,
  length: number,
  templates: Array<{ title: string; tasks: string[] }>,
): StudyPlan {
  const start = new Date(`${today}T00:00:00`);
  const days = Array.from({ length }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    const template = templates[Math.min(index, templates.length - 1)];

    return {
      day: index + 1,
      date: toIsoDate(date),
      title: index === length - 1 ? `${subject} 시험 전 정리` : template.title,
      tasks: template.tasks,
    };
  });

  if (days.length > 0) {
    days[days.length - 1] = {
      ...days[days.length - 1],
      date: examDate,
    };
  }

  return {
    today: days[0]?.tasks ?? [],
    days,
  };
}

function normalizeStringList(values: string[]) {
  return values.map((value) => value.trim()).filter(Boolean);
}
