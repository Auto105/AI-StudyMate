# Data Layer

C 담당 범위는 타입, 상태관리, 캐시, fallback, API client입니다. UI 컴포넌트는 `localStorage`와 `fetch`를 직접 반복하지 않고 이 레이어를 통해 접근합니다.

## Main Hook

Use `useStudyData()` from `src/hooks/useStudyData.ts`.

```ts
const {
  profile,
  setProfile,
  extractedText,
  setExtractedText,
  summaryResult,
  setSummary,
  isSummaryCacheHit,
  chatHistory,
  appendChatMessage,
  planInput,
  planResult,
  setPlan,
  isPlanCacheHit,
  quiz,
  setQuiz,
  resetAiResults,
  clearAll,
} = useStudyData();
```

## Storage Keys

Defined in `src/lib/storage/keys.ts`.

```txt
ai-studymate:study-profile
ai-studymate:study-materials
study.extractedText
study.summary
study.chatHistory
study.plan
study.quiz
```

The first two keys keep compatibility with the current UI hooks. The `study.*` keys support the unified C data hook.

## Reset Rules

- `setExtractedText(text)` resets summary, plan, and quiz.
- `setSummary(result)` stores a cache tied to the current extracted text hash.
- `setPlan(input, result)` stores a cache tied to subject, exam date, keywords, and concepts.
- `resetAiResults()` clears summary, plan, and quiz but keeps profile, text, and chat.
- `clearAll()` returns the app to the demo initial state.

## Cache Rules

Implemented in `src/lib/cache.ts`.

- Summary cache hit: same normalized extracted text.
- Plan cache hit: same subject, exam date, keywords, and concepts.
- Changing exam date should invalidate the plan cache.
- Changing extracted text should invalidate summary, plan, and quiz.

## Plan Helpers

Implemented in `src/lib/plan.ts`.

- `createPlanInput(subject, examDate, summary)`
- `getPlanLengthByDday(examDate)`
- `selectFallbackPlanByDday(input)`
- `toLegacyStudyTasks(tasks)`
- `toLegacyPlanDays(plan)`

Fallback plans support D-1, D-3, D-5, and D-7 style demos. D-5 returns a 5-day plan.

## API Client

Use `src/lib/api.ts` for the handoff contract:

```ts
uploadPdf(file, { fallbackOnError: true });
summarizeText(text, { fallbackOnError: true });
askQuestion(text, question, { fallbackOnError: true });
createStudyPlan(planInput, { fallbackOnError: true });
generateQuiz(text, { fallbackOnError: true });
```

This wrapper validates API responses and falls back to `src/data/demoFallbacks.ts` when requested.

The older `src/lib/api/client.ts` remains available for the current UI, but new UI work should prefer `src/lib/api.ts`.

## C-Owned Files

```txt
src/types/*
src/hooks/useLocalStorage.ts
src/hooks/useStudyData.ts
src/lib/storage*
src/lib/cache.ts
src/lib/date.ts
src/lib/pdf.ts
src/lib/plan.ts
src/lib/api.ts
src/lib/validators.ts
src/lib/mock/*
src/data/*
docs/API_CONTRACT.md
docs/DATA_LAYER.md
docs/QA_CHECKLIST.md
```
