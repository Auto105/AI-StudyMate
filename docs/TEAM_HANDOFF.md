# AI StudyMate Team Handoff

이 문서는 feature 브랜치 리뷰 반영 후 A, B, D 팀원이 이어서 작업할 때 확인해야 할 현재 기준입니다.

## Current Status

C 범위에서 API 계약 문서, validation, 날짜/계획 helper, mock/fallback 데이터를 정리했습니다.

B 범위에서 환경 세팅(STEP 0), 공통 AI 인프라(STEP 1), PR 리뷰 반영 validation(STEP 1.5)을 완료했습니다. OpenAI Route 실구현(STEP 2~)은 아직 진행 전입니다.

검증 명령:

```bash
npx.cmd tsc --noEmit
npm.cmd run build
```

PowerShell에서 `npm run build`가 실행 정책 때문에 막히면 `npm.cmd run build`를 사용하세요.

## B Progress Log

| 항목 | 내용 |
| --- | --- |
| 담당 | B (근우) |
| 브랜치 | `feature` |
| 완료 단계 | STEP 0, STEP 1, STEP 1.5 (PR 리뷰 validation) |
| 마지막 업데이트 | 2026-07-13 15:10 (KST) |
| 최근 커밋 | `fix: align API validation with PR review feedback` |

### STEP 0 — 환경 세팅 (B)

- `feature` 브랜치 최신 동기화 (`git fetch` / `git pull origin feature`)
- `.env.local` 생성 (`USE_MOCK_API=false`, `OPENAI_API_KEY` — 로컬 전용, Git 제외)
- `openai` 패키지 설치
- `npx tsc --noEmit`, `npm run build`, `npm run dev` 기동 확인

### STEP 1 — 공통 인프라 (B)

추가된 파일:

```txt
src/lib/openai.ts    — OpenAI 클라이언트, truncateText, parseJsonWithRetry, createJsonCompletion
src/lib/prompts.ts   — summarize/chat/plan/quiz 프롬프트 (JSON 스키마 명시)
src/lib/fallbacks.ts — summarize·plan 데모용 fallback JSON (C plan helper 재사용)
```

수정된 파일:

```txt
package.json         — openai 의존성 추가
package-lock.json    — lockfile 갱신
```

로컬만 존재 (Git 미추적):

```txt
.env.local           — OPENAI_API_KEY, USE_MOCK_API
```

검증 결과:

- `npx tsc --noEmit` 통과
- `npm run build` 통과
- C 영역 파일(`src/hooks/*`, `src/types/*`, `src/lib/api/client.ts` 등) 미수정

### STEP 1.5 — PR 리뷰 validation 반영 (B)

추가된 파일:

```txt
src/lib/api/request.ts — readJsonBody(), invalidJsonBodyResponse(), INVALID_JSON_BODY_ERROR
```

수정된 파일:

```txt
src/lib/pdf.ts                  — PDF_UPLOAD_ERRORS, validatePdfFile() 통합 (빈 파일/MIME/크기/%PDF- 시그니처)
src/app/api/upload/route.ts     — validatePdfFile() 호출로 검증 통합
src/app/api/plan/route.ts       — readJsonBody + concepts 400 validation
src/app/api/chat/route.ts       — readJsonBody 적용
src/app/api/summarize/route.ts  — readJsonBody 적용
src/app/api/quiz/route.ts       — readJsonBody 적용
docs/API_CONTRACT.md            — 실제 Route 응답·validation 규칙 반영
docs/DATA_LAYER.md              — PDF 시그니처 검증 설명 추가
docs/QA_CHECKLIST.md            — malformed JSON·PDF 오류 메시지 체크 항목 추가
src/components/materials/MaterialsPage.tsx — accept="application/pdf,.pdf"
```

반영된 validation 규칙:

- malformed JSON → `400` + `{ "error": "Invalid JSON body." }`
- malformed JSON과 필드 누락 응답 분리 (예: `{}` → subject 오류, `{` → Invalid JSON body.)
- 빈 PDF → `400` + `{ "error": "빈 파일은 업로드할 수 없습니다." }`
- 비PDF / 빈 MIME → `400` + `{ "error": "PDF 파일만 업로드할 수 있습니다." }`
- 5MB 초과 → `400` + `{ "error": "PDF 파일은 5MB 이하만 업로드할 수 있습니다." }`
- 가짜 PDF → `400` + `{ "error": "올바른 PDF 파일이 아닙니다." }`
- `/api/plan` 잘못된 `concepts` → `400` (500 아님)

검증 결과:

- `npx tsc --noEmit` 통과
- `npm run build` 통과
- curl 기준 malformed JSON / empty PDF / fake PDF / non-PDF 테스트 통과

### B 다음 작업

```txt
STEP 2  POST /api/upload   — pdf-parse 실구현, { text, truncated } 또는 canonical 응답 정리
STEP 3  POST /api/summarize — OpenAI 연결
STEP 4  POST /api/chat      — OpenAI 연결
STEP 5  POST /api/plan      — OpenAI 연결 (시연 핵심)
STEP 6  POST /api/quiz      — bonus, 마지막
```

※ STEP 1.5에서 validation 골격은 완료됨. STEP 2~6은 Mock/501 → OpenAI·pdf-parse 실구현이 남음.

## C Deliverables

현재 유지하는 주요 파일:

```txt
src/hooks/useLocalStorage.ts
src/hooks/useStudyMaterials.ts
src/hooks/useStudyProfile.ts
src/lib/api/client.ts
src/lib/api/request.ts
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
- malformed JSON은 `400`과 `{ "error": "Invalid JSON body." }`로 통일합니다.
- PDF 업로드 검증은 `src/lib/pdf.ts`의 `validatePdfFile()`을 `/api/upload`에서 사용합니다.
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
src/lib/fallbacks.ts
src/lib/api/request.ts
src/lib/pdf.ts
```

완료 (STEP 1):

```txt
src/lib/openai.ts
src/lib/prompts.ts
src/lib/fallbacks.ts
```

완료 (STEP 1.5 — validation):

```txt
src/lib/api/request.ts
src/lib/pdf.ts
src/app/api/upload/route.ts      — validatePdfFile 연결, 빈 파일/MIME/시그니처 검증
src/app/api/plan/route.ts        — readJsonBody, concepts 400 validation
src/app/api/chat/route.ts        — readJsonBody
src/app/api/summarize/route.ts   — readJsonBody
src/app/api/quiz/route.ts        — readJsonBody
```

미완료 (STEP 2~6 — OpenAI/pdf-parse 실구현):

```txt
src/app/api/upload/route.ts      — pdf-parse 실구현 대기 (현재 Mock 응답)
src/app/api/summarize/route.ts   — OpenAI 실구현 대기
src/app/api/chat/route.ts        — OpenAI 실구현 대기
src/app/api/plan/route.ts        — OpenAI 실구현 대기
src/app/api/quiz/route.ts        — OpenAI 실구현 대기
```

필수 요청사항:

1. API 응답은 `docs/API_CONTRACT.md`와 일치해야 합니다.
2. 모든 API는 JSON만 반환해야 합니다.
3. 입력 validation과 `{ "error": "message" }` 실패 응답을 유지합니다.
4. 잘못된 입력은 500이 아니라 400으로 처리합니다.
5. malformed JSON은 `readJsonBody()` + `invalidJsonBodyResponse()`로 처리합니다.
6. `OPENAI_API_KEY`는 서버 코드에서만 사용합니다.
7. `/api/plan`은 `/api/quiz`보다 먼저 완성합니다.
8. 자료에 없는 질문은 `"자료에 없습니다."` 의미로 답합니다.
9. PDF 업로드는 `validatePdfFile()`로만 검증합니다 (Route 내부 중복 검증 금지).

특히 `/api/plan` 요구사항:

- `subject`, `examDate`, `keywords`, `concepts`를 반영합니다.
- `concepts`가 문자열 배열이 아니면 `400`을 반환합니다.
- 시험일까지 남은 날짜에 따라 계획 길이와 우선순위가 달라져야 합니다.
- D-5 시연에서는 5일 plan이 나오는 것이 좋습니다.

특히 `/api/upload` 요구사항:

- 빈 파일, 비PDF, 빈 MIME, 5MB 초과, `%PDF-` 시그니처 없음 → 각각 `400` + 고정 오류 메시지
- 오류 메시지는 `src/lib/pdf.ts`의 `PDF_UPLOAD_ERRORS` 기준

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
9. /api/plan에 malformed JSON 요청을 내면 400 + "Invalid JSON body."가 나온다.
10. /api/plan에 잘못된 concepts 요청을 내면 400이 나온다.
11. 빈 PDF / 비PDF / 가짜 PDF 업로드 시 400이 나온다.
12. D-5 조건에서 5일 계획이 나온다.
13. docs/API_CONTRACT.md와 실제 응답 형식이 일치한다.
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
