# AI StudyMate Team Handoff

이 문서는 feature 브랜치 리뷰 반영 후 A, B, D 팀원이 이어서 작업할 때 확인해야 할 현재 기준입니다.

## Current Status

C 범위에서 API 계약 문서, validation, 날짜/계획 helper, mock/fallback 데이터를 정리했습니다.

검증 명령:

```bash
npx.cmd tsc --noEmit
npm.cmd run build
```

PowerShell에서 `npm run build`가 실행 정책 때문에 막히면 `npm.cmd run build`를 사용하세요.

## C Deliverables

현재 유지하는 주요 파일:

```txt
src/hooks/useLocalStorage.ts
src/hooks/useStudyMaterials.ts
src/hooks/useStudyProfile.ts
src/lib/api/client.ts
src/lib/date.ts
src/lib/pdf.ts
src/lib/plan.ts
src/lib/storage/keys.ts
src/lib/validators.ts
src/lib/mock/*
src/data/demoFallbacks.ts
docs/API_CONTRACT.md
docs/DATA_LAYER.md
docs/QA_CHECKLIST.md
```

중복을 줄이기 위해 `src/lib/api.ts`, `src/hooks/useStudyData.ts`, `src/lib/storage.ts`는 사용하지 않습니다.

## Shared Rules

- `src/app/page.tsx`는 `<AppShell />`만 렌더링하는 구조를 유지합니다.
- UI 컴포넌트에서 `localStorage`를 직접 호출하지 않습니다.
- API 호출은 `src/lib/api/client.ts`를 사용합니다.
- Route Handler 응답은 `docs/API_CONTRACT.md`의 현재 실제 응답 형식과 맞춥니다.
- Quiz는 bonus 기능입니다. Today, PDF upload, Summary, Q&A, Plan보다 먼저 작업하지 않습니다.
- 폴더 구조는 크게 바꾸지 않습니다.

## Requests for A: Frontend/UI

작업 대상:

```txt
src/app/page.tsx
src/components/*
src/hooks/useStudyMaterials.ts
src/hooks/useStudyProfile.ts
```

필수 요청사항:

1. 첫 화면은 반드시 Today로 유지합니다.
2. Today 화면에는 `Subject`, `Exam Date`, `D-Day`, `Today's Tasks`, `CTA`만 우선 표시합니다.
3. fancy dashboard, progress %, AI score, study time은 추가하지 않습니다.
4. 자료 탭에서는 PDF 업로드와 텍스트 붙여넣기 흐름을 제공합니다.
5. 질문 탭은 저장된 자료 기반 Q&A 흐름만 다룹니다.
6. Quiz는 시간이 남을 때만 연결합니다.

권장 연결 방식:

```ts
const { profile, setProfile } = useStudyProfile();
const { material, setMaterial } = useStudyMaterials();
```

API 연결:

```ts
uploadMaterial(formData);
summarizeMaterial({ text });
askQuestion({ text, question });
createStudyPlan({ subject, examDate, keywords, concepts });
createQuiz({ text });
```

확인해야 할 UX:

- D-5 시험일에서 5일 계획이 보이는지 확인합니다.
- 시험일을 바꾸면 계획이 달라지는 경험이 보여야 합니다.
- 새로고침 후 과목, 시험일, 자료, 요약이 유지되어야 합니다.

## Requests for B: AI/API

작업 대상:

```txt
src/app/api/upload/route.ts
src/app/api/summarize/route.ts
src/app/api/chat/route.ts
src/app/api/plan/route.ts
src/app/api/quiz/route.ts
src/lib/openai.ts
src/lib/prompts.ts
```

필수 요청사항:

1. API 응답은 `docs/API_CONTRACT.md`와 일치해야 합니다.
2. 모든 API는 JSON만 반환해야 합니다.
3. 입력 validation과 `{ "error": "message" }` 실패 응답을 유지합니다.
4. 잘못된 입력은 500이 아니라 400으로 처리합니다.
5. `OPENAI_API_KEY`는 서버 코드에서만 사용합니다.
6. `/api/plan`은 `/api/quiz`보다 먼저 완성합니다.
7. 자료에 없는 질문은 `"자료에 없습니다."` 의미로 답합니다.

특히 `/api/plan` 요구사항:

- `subject`, `examDate`, `keywords`, `concepts`를 반영합니다.
- `concepts`가 문자열 배열이 아니면 `400`을 반환합니다.
- 시험일까지 남은 날짜에 따라 계획 길이와 우선순위가 달라져야 합니다.
- D-5 시연에서는 5일 plan이 나오는 것이 좋습니다.

## Requests for D: Integration/QA/Deployment

작업 대상:

```txt
package.json
README.md
.env.example
next.config.ts
docs/*
Vercel settings
```

필수 요청사항:

1. 현재 `src/`와 `docs/`를 삭제하지 않습니다.
2. 팀 브랜치 흐름에 맞춰 `feature -> develop -> main` 순서로 통합합니다.
3. 통합 후 최소 `npm.cmd run build`를 실행합니다.
4. 배포 전 `.env.example`와 Vercel 환경변수를 확인합니다.

권장 QA:

```txt
1. 앱이 실행된다.
2. Today가 첫 화면이다.
3. 과목과 시험일 입력이 가능하다.
4. D-day가 표시된다.
5. 새로고침 후 과목과 시험일이 유지된다.
6. 자료 탭에서 PDF 업로드 또는 텍스트 붙여넣기가 가능하다.
7. 요약하기가 동작한다.
8. 질문 탭에서 "프로세스와 스레드 차이?"에 답한다.
9. /api/plan에 잘못된 concepts 요청을 보내면 400이 나온다.
10. D-5 조건에서 5일 계획이 나온다.
11. docs/API_CONTRACT.md와 실제 응답 형식이 일치한다.
```

## Final Priority

새 기능을 늘리는 것보다 아래 흐름을 안정화하는 것이 우선입니다.

```txt
PDF/Text input
↓
Summary
↓
Q&A
↓
Today D-day Plan
```
