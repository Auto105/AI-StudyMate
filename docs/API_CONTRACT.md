# API Contract

모든 API는 일관되게 JSON 응답을 반환합니다. 입력값 검증 실패는 `400`, 아직 실제 구현이 연결되지 않은 경우는 `501`, 서버 처리 실패는 `500`을 사용합니다.

## Phase 매핑

필수 Phase 순서는 `P0 → P1 → P2 → P4 → P5`입니다. `P3 Quiz`는 보너스입니다.

| API | Phase | 담당 화면 | Request | Response | fallback |
| --- | --- | --- | --- | --- | --- |
| `/api/upload` | P1 | 자료 | `multipart`의 `file` 또는 `text` | `{ text: string; truncated: boolean }` | PDF 미구현 시 Mock 텍스트 또는 텍스트 붙여넣기 |
| `/api/summarize` | P2 | 자료 | `{ text: string }` | `{ keywords: string[]; concepts: string[]; easyExplain: string }` | Mock summary, 추후 `cache/summarize.json` |
| `/api/chat` | P2 | 질문 | `{ text: string; question: string }` | `{ answer: string; grounded: boolean }` | 자료 밖 질문은 `자료에 없습니다` |
| `/api/plan` | P4 | 오늘 | `{ subject: string; examDate: string; keywords: string[] }` | `{ today: StudyTask[]; days: PlanDay[] }` | D-5/D-2 Mock plan, 추후 `cache/plan.json` |
| `/api/quiz` | P3 보너스 | 시험 | `{ text: string }` | `{ mcq: QuizQuestion[]; ox: OxQuestion[] }` | Mock quiz, 추후 `cache/quiz.json` |

## 제한

| 항목 | 제한 |
| --- | --- |
| PDF 파일 크기 | 5MB 이하 |
| 추출 텍스트 길이 | 12,000자 |
| Q&A 근거 | 업로드/붙여넣기 된 자료 내부로 제한 |
| 응답 목표 | 5초 이내를 목표로 설계 |

## 공통 오류 응답

```ts
{
  error: string;
}
```

## 자료 밖 질문 응답 규칙

자료에 근거가 없으면 다음 의미의 응답을 반환합니다.

```ts
{
  answer: "자료에 없습니다. 업로드한 학습자료에는 해당 질문에 답할 근거가 충분하지 않습니다.",
  grounded: false
}
```

## 타입 위치

- API 타입: `src/types/api.ts`
- 학습 계획 타입: `src/types/study.ts`
- 퀴즈 타입: `src/types/quiz.ts`

## Mock 응답 위치

- 요약: `src/lib/mock/summary.ts`
- 질문: `src/lib/mock/chat.ts`
- 계획: `src/lib/mock/plan.ts`
- 퀴즈: `src/lib/mock/quiz.ts`
