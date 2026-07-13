# QA Checklist

## C Data Layer

- Profile persists after refresh.
- Extracted text persists after refresh.
- Summary persists after refresh when text is unchanged.
- Plan persists after refresh when subject, exam date, keywords, and concepts are unchanged.
- Quiz persists after refresh.
- `setExtractedText()` clears summary, plan, and quiz.
- Same extracted text produces a summary cache hit.
- Different extracted text produces a summary cache miss.
- Same subject, exam date, keywords, and concepts produce a plan cache hit.
- Changing exam date produces a plan cache miss.
- Changing summary keywords or concepts produces a plan cache miss.

## API Wrapper

- `uploadPdf(..., { fallbackOnError: true })` returns demo extracted text when upload fails.
- `summarizeText(..., { fallbackOnError: true })` returns demo summary when API fails.
- `askQuestion(..., { fallbackOnError: true })` returns a grounded demo answer for process/thread questions.
- Out-of-material fallback answer is `자료에 없습니다.`
- `createStudyPlan(..., { fallbackOnError: true })` returns a D-day based fallback plan.
- D-5 plan returns 5 days.
- D-3 plan returns 3 days.
- D-1 plan returns 1 day.
- `generateQuiz(..., { fallbackOnError: true })` returns demo MCQ/OX data.

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
