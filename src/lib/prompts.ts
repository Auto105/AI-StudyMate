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
      'keywords는 3~6개, concepts는 2~4개의 짧은 문장, easyExplain은 한 단락으로 작성하세요.',
    ].join('\n'),
    user: `강의자료:\n${text}`,
  };
}

export function chatPrompt(text: string, question: string) {
  return {
    system: [
      '당신은 강의자료 기반 Q&A 도우미입니다.',
      '제공된 강의자료 안에서만 답변하세요.',
      `자료에 없는 내용이면 answer는 반드시 "${OUT_OF_MATERIAL_ANSWER}" 로 하고 grounded는 false 입니다.`,
      '자료에 근거한 답변이면 grounded는 true 입니다.',
      '답변은 시연 속도를 위해 2~4문장 이내로 짧게 작성하세요.',
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
) {
  const ddayLabel = dday === null ? '시험일 미정' : `D-${dday}`;
  const planDays = dday === null ? 3 : Math.min(Math.max(dday, 1), 7);

  return {
    system: [
      '당신은 시험 대비 학습 계획을 세우는 도우미입니다.',
      '시험일까지 남은 일수(D-day)에 따라 계획 길이와 우선순위를 조정하세요.',
      `현재 ${ddayLabel} 이며 days 배열 길이는 ${planDays}일이어야 합니다.`,
      'D-day가 짧을수록 압축·최종 점검 톤으로 today와 tasks를 구성하세요.',
      'keywords와 concepts가 있으면 today와 days.tasks에 반영하세요.',
      'today는 오늘 할 일 2~3개의 문자열 배열입니다.',
      '반드시 JSON 객체만 반환하세요.',
      '스키마:',
      '{',
      '  "today": string[],',
      '  "days": [',
      '    {',
      '      "day": number,',
      '      "date": string,',
      '      "title": string,',
      '      "tasks": string[]',
      '    }',
      '  ]',
      '}',
      'date는 YYYY-MM-DD 형식이어야 합니다.',
      'legacy { id, title } 형식은 사용하지 마세요.',
    ].join('\n'),
    user: [
      `과목: ${subject}`,
      `시험일: ${examDate}`,
      `D-day: ${ddayLabel}`,
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
      'mcq 필드명은 options (choices 아님), ox 필드명은 question (statement 아님) 입니다.',
      'mcq.answer는 options 중 하나와 정확히 일치해야 합니다.',
    ].join('\n'),
    user: `강의자료:\n${text}`,
  };
}

export { OUT_OF_MATERIAL_ANSWER };
