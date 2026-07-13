# AI StudyMate Team Handoff

이 문서는 C 담당 작업 이후 A, B, D 팀원이 이어서 작업할 때 확인해야 할 요구사항과 인수인계 사항을 정리합니다.

## Current Status

C 범위의 데이터 레이어, 상태관리, 캐시, fallback, API client, 문서 보강은 완료되었습니다.

검증 결과:

```bash
npx.cmd tsc --noEmit
npm.cmd run build
```

두 명령 모두 통과했습니다.

PowerShell에서 `npm run build`는 로컬 실행 정책 때문에 `npm.ps1`이 차단될 수 있습니다. 이 경우 `npm.cmd run build`를 사용하세요.

## C Deliverables

추가/보강된 주요 파일:

```txt
src/hooks/useStudyData.ts
src/lib/api.ts
src/lib/cache.ts
src/lib/date.ts
src/lib/pdf.ts
src/lib/plan.ts
src/lib/storage.ts
src/lib/validators.ts
src/data/demoFallbacks.ts
docs/API_CONTRACT.md
docs/DATA_LAYER.md
docs/QA_CHECKLIST.md
```

기존 mock 데이터의 깨진 한글 문구도 정상 한국어로 정리했습니다.

## Shared Rules

- `src/app/page.tsx`는 `<AppShell />`만 렌더링하는 구조를 유지합니다.
- UI 컴포넌트에서 `localStorage`를 직접 호출하지 않습니다.
- API 호출은 새 작업에서는 `src/lib/api.ts`를 우선 사용합니다.
- Route Handler 응답은 `docs/API_CONTRACT.md`의 계약을 맞춥니다.
- Quiz는 bonus 기능입니다. Today, PDF upload, Summary, Q&A, Plan보다 먼저 작업하지 않습니다.
- 폴더 구조는 크게 바꾸지 않습니다. `frontend/`, `backend/`를 별도 앱처럼 분리하지 않습니다.
- Backend 담당자는 별도 `backend/` 폴더보다 `src/app/api/*`, `src/lib/openai.ts`, `src/lib/prompts.ts` 중심으로 작업합니다.

## Requests for A: Frontend/UI

A는 화면과 사용자 흐름 연결을 담당합니다.

작업 대상:

```txt
src/app/page.tsx
src/components/*
```

가능하면 수정하지 말 파일:

```txt
src/app/api/*
src/types/*
src/hooks/useStudyData.ts
src/lib/cache.ts
src/lib/api.ts
src/lib/validators.ts
src/data/*
```

필수 요청사항:

1. 첫 화면은 반드시 Today로 유지합니다.
2. Today 화면에는 `Subject`, `Exam Date`, `D-Day`, `Today's Tasks`, `CTA`만 우선 표시합니다.
3. fancy dashboard, progress %, AI score, study time은 추가하지 않습니다.
4. 자료 탭에서는 PDF 업로드와 텍스트 붙여넣기 fallback을 모두 제공합니다.
5. 질문 탭은 업로드/붙여넣기 된 자료 기반 Q&A 흐름만 다룹니다.
6. Quiz는 시간이 남을 때만 연결합니다.

권장 연결 방식:

```ts
const {
  profile,
  setProfile,
  extractedText,
  setExtractedText,
  summaryResult,
  setSummary,
  chatHistory,
  appendChatMessage,
  planInput,
  planResult,
  setPlan,
  quiz,
  setQuiz,
} = useStudyData();
```

자료 탭 연결:

```ts
validatePdfFile(file);
uploadPdf(file, { fallbackOnError: true });
setExtractedText(result.extractedText);
summarizeText(extractedText, { fallbackOnError: true });
setSummary(summary);
```

질문 탭 연결:

```ts
askQuestion(extractedText, question, { fallbackOnError: true });
appendChatMessage(message);
```

Today 탭 연결:

```ts
createStudyPlan(planInput, { fallbackOnError: true });
setPlan(planInput, result);
```

확인해야 할 UX:

- D-5 시험일에서 5일 계획이 보이는지 확인합니다.
- 시험일을 바꾸면 계획이 달라지는 경험이 보여야 합니다.
- 새로고침 후 과목, 시험일, 자료, 요약이 유지되어야 합니다.

## Requests for B: AI/API

B는 Route Handler와 OpenAI 연결을 담당합니다.

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

가능하면 수정하지 말 파일:

```txt
src/components/*
src/hooks/*
src/types/*
src/lib/api.ts
src/lib/cache.ts
src/lib/plan.ts
src/data/*
```

필수 요청사항:

1. API 응답은 `docs/API_CONTRACT.md`와 일치해야 합니다.
2. 모든 API는 JSON만 반환해야 합니다.
3. 입력 validation과 `{ "error": "message" }` 실패 응답을 유지합니다.
4. `OPENAI_API_KEY`는 서버 코드에서만 사용합니다.
5. API key를 코드에 직접 작성하지 않습니다.
6. 긴 PDF 텍스트는 truncate 기준을 둡니다.
7. `/api/plan`은 `/api/quiz`보다 먼저 완성합니다.
8. 자료에 없는 질문은 `"자료에 없습니다."` 의미로 답합니다.

우선순위:

```txt
1. /api/upload
2. /api/summarize
3. /api/chat
4. /api/plan
5. /api/quiz
```

특히 `/api/plan` 요구사항:

- `subject`, `examDate`, `keywords`, `concepts`를 모두 반영합니다.
- 시험일까지 남은 날짜에 따라 계획 길이와 우선순위가 달라져야 합니다.
- D-5 시연에서는 5일 plan이 나오는 것이 좋습니다.
- 요약 결과의 keyword/concept가 today task에 반영되어야 합니다.

## Requests for D: Integration/QA/Deployment

D는 통합, QA, 문서, 배포를 담당합니다.

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
2. C가 추가한 데이터 레이어 파일을 보존합니다.
3. 팀 브랜치 흐름에 맞춰 `feature -> develop -> main` 순서로 통합합니다.
4. 통합 후 최소 `npm.cmd run build`를 실행합니다.
5. 배포 전 `.env.example`와 Vercel 환경변수를 확인합니다.

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
9. Today에서 학습 계획이 생성된다.
10. D-5 조건에서 5일 계획이 나온다.
11. 시험일 변경 시 계획이 달라진다.
12. API 실패 시 fallback으로 데모 흐름이 유지된다.
```

## Branch Guidance

현재 팀 방식:

```txt
feature
↓
develop
↓
main
```

C 작업은 별도 하위 feature 브랜치가 필수는 아닙니다. 팀이 `feature`를 작업 통합 브랜치로 쓰고 있다면 C 변경사항도 `feature`에 커밋하면 됩니다.

커밋 전 확인:

```bash
git status --short
npx.cmd tsc --noEmit
npm.cmd run build
```

권장 커밋 메시지:

```txt
Add study data layer and team handoff docs
```

## Demo Script Reminder

5분 시연 흐름:

```txt
1. ChatGPT는 PDF만 보지만 StudyMate는 시험 일정도 반영한다고 설명한다.
2. Today에서 과목을 "운영체제"로 입력한다.
3. 시험일을 D-5로 설정한다.
4. Materials에서 PDF 업로드 또는 텍스트 붙여넣기를 한다.
5. 요약하기를 실행한다.
6. Questions에서 "프로세스와 스레드 차이?"를 질문한다.
7. Today에서 오늘의 학습 계획을 생성한다.
8. 시험 일정이 들어가니 오늘 할 일이 달라진다는 점을 설명한다.
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
