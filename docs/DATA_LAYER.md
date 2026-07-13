# Data Layer

C 담당 범위는 타입, 기존 hook 기반 상태관리, validation, 날짜/계획 helper, mock/fallback 데이터, API client 계약입니다.

이번 PR에서는 기존 구조를 기준으로 통합합니다.

## Hooks

UI 컴포넌트는 `localStorage`를 직접 호출하지 않고 기존 hook을 사용합니다.

```ts
const { profile, setProfile } = useStudyProfile();
const { material, setMaterial } = useStudyMaterials();
```

- `useStudyProfile()`은 과목과 시험일을 관리합니다.
- `useStudyMaterials()`는 학습자료 텍스트, 미리보기, 요약 결과를 관리합니다.
- 실제 `window.localStorage` 접근은 `useLocalStorage()` 내부에만 둡니다.

## Storage Keys

Defined in `src/lib/storage/keys.ts`.

```txt
ai-studymate:study-profile
ai-studymate:study-materials
```

## API Client

기존 client를 기준으로 사용합니다.

```ts
import {
  uploadMaterial,
  summarizeMaterial,
  askQuestion,
  createStudyPlan,
  createQuiz,
} from '@/lib/api/client';
```

```ts
uploadMaterial(formData);
summarizeMaterial({ text });
askQuestion({ text, question });
createStudyPlan({ subject, examDate, keywords, concepts });
createQuiz({ text });
```

## Date And Plan Helpers

Implemented in `src/lib/date.ts` and `src/lib/plan.ts`.

- `calculateDday(examDate)`
- `formatDday(examDate)`
- `isValidIsoDate(value)`
- `createPlanInput(subject, examDate, summary)`
- `getPlanLengthByDday(examDate)`
- `selectFallbackPlanByDday(input)`
- `toLegacyStudyTasks(tasks)`
- `toLegacyPlanDays(plan)`

Date helpers use local calendar dates instead of UTC string slicing, so D-day and generated fallback plan dates do not shift by timezone. Invalid dates such as `2026-02-31` are rejected by `isValidIsoDate()`.

Fallback plans support D-1, D-3, D-5, and D-7 style demos. D-5 returns a 5-day plan.

## Validation Helpers

Implemented in `src/lib/validators.ts` and `src/lib/pdf.ts`.

```ts
validateRequiredText(value, fieldName);
validateStudyText(text);
validateQuestion(question);
validateStudyProfile(profile);
validatePlanInput(planInput);
validatePdfFile(file);
```

- Empty subject, material text, and question values fail validation.
- Exam dates must be valid `YYYY-MM-DD` calendar dates.
- Plan `keywords` and `concepts` must be string arrays.
- PDF files must have a `.pdf` name and `application/pdf` type, must be non-empty, must stay under the configured size limit, and must include the `%PDF-` signature when validated on the server upload route.

## C-Owned Files

```txt
src/types/*
src/hooks/useLocalStorage.ts
src/hooks/useStudyMaterials.ts
src/hooks/useStudyProfile.ts
src/lib/api/client.ts
src/lib/storage/keys.ts
src/lib/date.ts
src/lib/pdf.ts
src/lib/plan.ts
src/lib/validators.ts
src/lib/mock/*
src/data/*
docs/API_CONTRACT.md
docs/DATA_LAYER.md
docs/QA_CHECKLIST.md
```
