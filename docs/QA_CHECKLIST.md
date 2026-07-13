# QA Checklist

## C Data Layer

- Profile persists after refresh.
- Material text persists after refresh.
- Material summary persists after refresh.
- `useStudyProfile()` owns subject and exam date storage.
- `useStudyMaterials()` owns material text, preview, and summary storage.
- UI components do not call `localStorage` directly.

## API Routes And Client

- `uploadMaterial(formData)` returns `{ text, truncated }`.
- `summarizeMaterial({ text })` returns `{ keywords, concepts, easyExplain }`.
- `askQuestion({ text, question })` returns `{ answer, grounded }`.
- Out-of-material answer uses `자료에 없습니다.`.
- `createStudyPlan({ subject, examDate, keywords, concepts })` returns `StudyTask[]` based `today` and `days`.
- D-5 plan returns 5 days.
- D-3 plan returns 3 days.
- D-1 plan returns 1 day.
- Invalid `/api/plan` `concepts` values return `400` and `{ "error": "..." }`.
- `createQuiz({ text })` returns MCQ `choices` and OX `statement` fields.

## Validation

- Empty study material text fails validation.
- Empty question text fails validation.
- Empty subject fails validation.
- Invalid exam date strings fail validation.
- Impossible calendar dates such as `2026-02-31` fail validation.
- Malformed JSON on JSON routes returns `400` and `{ "error": "Invalid JSON body." }`.
- Empty PDF files return `400` and `{ "error": "빈 파일은 업로드할 수 없습니다." }`.
- Non-PDF files return `400` and `{ "error": "PDF 파일만 업로드할 수 있습니다." }`.
- PDF files without `%PDF-` signature return `400` and `{ "error": "올바른 PDF 파일이 아닙니다." }`.
- Oversized PDF files return `400` and `{ "error": "PDF 파일은 5MB 이하만 업로드할 수 있습니다." }`.

## Demo Flow

- Set subject to `운영체제`.
- Set exam date to D-5.
- Add material by upload or text paste.
- Summarize material.
- Ask `프로세스와 스레드 차이?`.
- Generate Today plan.
- Confirm the plan length and priorities change when the exam date changes.

## Known Ownership Boundaries

- UI copy/layout issues belong to A.
- Route Handler OpenAI integration belongs to B.
- Build, deployment, and README ownership belongs to D.
- C should keep contracts, fallback, cache, and state behavior stable.
