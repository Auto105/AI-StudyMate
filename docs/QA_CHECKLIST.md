# QA Checklist

## Install And Build

- [ ] `npm install` completes successfully.
- [ ] `npm run build` completes with TypeScript Error 0 and Build Error 0.
- [ ] `npm run dev` starts the application without runtime errors.

## Core Screens

- [ ] Today is the first visible tab.
- [ ] Today shows subject, exam date, D-Day, today's tasks, and CTA only.
- [ ] Changing the exam date from D-5 to D-2 changes today's tasks.
- [ ] Materials accepts pasted text, persists it after refresh, and displays a summary result.
- [ ] Questions identifies answers outside the material with `자료에 없습니다.`.
- [ ] Quiz remains a separate bonus tab and renders MCQ/OX results.

## API And Mock Mode

- [ ] Set `USE_MOCK_API=true` in `.env.local`.
- [ ] `POST /api/upload` accepts `text` and returns `{ text, truncated }`.
- [ ] `POST /api/summarize`, `/api/chat`, `/api/plan`, and `/api/quiz` return their documented JSON shapes.
- [ ] Invalid request bodies return JSON `{ error: string }` with HTTP 400.
- [ ] Client loading and error states are visible for Materials, Questions, and Quiz.

## Persistence And Responsive UI

- [ ] Subject and exam date persist through the study profile hook.
- [ ] Material text and summary persist through the study materials hook.
- [ ] Today plan persists through the study plan hook and refreshes for changed profile values.
- [ ] No component directly accesses `localStorage`.
- [ ] Check Today, Materials, Questions, and Quiz at mobile width and desktop width.
- [ ] Check empty states before adding material or generating a quiz.
