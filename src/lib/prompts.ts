import { getPlanLengthByDday } from '@/lib/plan';

const OUT_OF_MATERIAL_ANSWER = '자료에 없습니다.';

export function summarizePrompt(text: string) {
  return {
    system: [
      '당신은 대학 강의자료 요약 도우미입니다.',
      '제공된 강의자료 텍스트만 근거로 요약하세요.',
      '반드시 JSON 객체만 반환하세요.',
      '스키마:',
      '{',
      '  "keywords": string[],',
      '  "concepts": string[],',
      '  "easyExplain": string',
      '}',
      'keywords는 3~6개, concepts는 2~4개의 짧은 문장, easyExplain은 한 문단으로 작성하세요.',
    ].join('\n'),
    user: `강의자료:\n${text}`,
  };
}

export function chatPrompt(text: string, question: string) {
  return {
    system: [
      '당신은 강의자료 기반 Q&A 도우미입니다.',
      '제공된 강의자료 안에서만 답하세요.',
      `자료에 없는 내용이면 answer를 반드시 "${OUT_OF_MATERIAL_ANSWER}"로 하고 grounded를 false로 하세요.`,
      '자료에 근거해 답할 수 있으면 grounded를 true로 하세요.',
      '답변은 시연 속도를 위해 2~4문장 안에서 명확하게 작성하세요.',
      '반드시 JSON 객체만 반환하세요.',
      '스키마:',
      '{',
      '  "answer": string,',
      '  "grounded": boolean',
      '}',
    ].join('\n'),
    user: `강의자료:\n${text}\n\n질문:\n${question}`,
  };
}

export function planPrompt(
  subject: string,
  examDate: string,
  keywords: string[],
  concepts: string[],
  dday: number | null,
  today = new Date().toISOString().slice(0, 10),
) {
  const ddayLabel =
    dday === null ? '시험일 미정' : dday === 0 ? 'D-Day' : dday > 0 ? `D-${dday}` : `D+${Math.abs(dday)}`;
  const planDays = getPlanLengthByDday(examDate, today);

  return {
    system: [
      '당신은 시험 대비 학습 계획을 세우는 도우미입니다.',
      '시험일까지 남은 일수(D-day)에 따라 계획 길이와 우선순위를 반드시 바꾸세요.',
      `현재 ${ddayLabel}이며 days 배열 길이는 정확히 ${planDays}개여야 합니다.`,
      'D-5 부근: 자료 훑기 → 개념 정리 → 비교 → 질문 → 압축 복습처럼 단계적으로 구성하세요.',
      'D-2~D-3: 비교 복습, 약점 확인, 최종 암기 중심으로 today와 tasks를 더 압축하세요.',
      'D-1~D-Day: 핵심 확인과 헷갈리는 개념 점검만 남기세요.',
      'keywords와 concepts가 있으면 today와 days.tasks 문구에 직접 반영하세요.',
      'today는 오늘 할 일 2~3개입니다. days[0].tasks와 today는 같은 내용이어야 합니다.',
      'days[i].date는 오늘부터 하루씩 증가하고, 마지막 날 date는 시험일과 같아야 합니다.',
      'days.label은 "자료 훑기", "비교 복습", "최종 점검"처럼 학습 주제여야 하며 "D-5" 같은 D-day 표기는 쓰지 마세요.',
      '반드시 JSON 객체만 반환하세요.',
      '스키마:',
      '{',
      '  "today": [',
      '    { "id": string, "title": string }',
      '  ],',
      '  "days": [',
      '    {',
      '      "date": string,',
      '      "label": string,',
      '      "tasks": [',
      '        { "id": string, "title": string }',
      '      ]',
      '    }',
      '  ]',
      '}',
      'date는 YYYY-MM-DD 형식이어야 합니다.',
      '모든 task는 반드시 id와 title 문자열을 포함해야 합니다.',
      '문자열만 있는 task (예: "오늘 할 일")는 허용되지 않습니다.',
    ].join('\n'),
    user: [
      `과목: ${subject}`,
      `오늘 날짜: ${today}`,
      `시험일: ${examDate}`,
      `D-day: ${ddayLabel}`,
      `계획 일수: ${planDays}`,
      `keywords: ${keywords.join(', ') || '(없음)'}`,
      `concepts: ${concepts.join(' | ') || '(없음)'}`,
    ].join('\n'),
  };
}

export function quizPrompt(text: string) {
  return {
    system: [
      '당신은 강의자료 기반 퀴즈 생성 도우미입니다.',
      '제공된 강의자료 텍스트만 근거로 문제를 만드세요.',
      '객관식(mcq)은 3개 이상, OX(ox)는 2개 이상 생성하세요.',
      '반드시 JSON 객체만 반환하세요.',
      '스키마:',
      '{',
      '  "mcq": [',
      '    {',
      '      "question": string,',
      '      "options": string[],',
      '      "answer": string,',
      '      "explanation": string',
      '    }',
      '  ],',
      '  "ox": [',
      '    {',
      '      "question": string,',
      '      "answer": boolean,',
      '      "explanation": string',
      '    }',
      '  ]',
      '}',
      'mcq 필드명은 options, ox 필드명은 question을 사용하세요.',
      'mcq.answer는 options 중 하나와 정확히 일치해야 합니다.',
    ].join('\n'),
    user: `강의자료:\n${text}`,
  };
}

export { OUT_OF_MATERIAL_ANSWER };
