# AGENTS.md

# AI StudyMate

> AI StudyMate는 대학생을 위한 AI 학습 도우미입니다.
>
> 이 프로젝트의 핵심은 AI 채팅이 아니라,
> **사용자가 앱을 열었을 때 오늘 무엇을 공부해야 하는지 먼저 제안하는 것**입니다.

---

# Project Vision

## Tagline

> **오늘 무엇을 공부할지 먼저 알려주는 AI 학습 도우미**

---

## Product Goal

학생은 매번 ChatGPT를 열고 질문하는 것이 아니라,

앱을 열면 저장된

- 과목
- 시험일
- 강의자료

를 기반으로

**오늘 가장 먼저 해야 할 공부를 제안받는다.**

---

## Core Principle

AI는 기능이 아니라 엔진이다.

사용자가 보는 것은

```
Today
↓
Today's Action
↓
Study
```

이며

```
Summary
Chat
Plan
Quiz
```

는 내부 AI 기능이다.

---

# Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS v4
- Route Handlers
- OpenAI API
- pdf-parse
- localStorage
- Vercel

---

# Folder Structure

```
src
 ├── app
 ├── components
 ├── hooks
 ├── lib
 ├── types
 ├── constants

docs
```

새로운 기능은 기존 구조를 유지한다.

폴더 구조를 크게 변경하지 않는다.

---

# Current Scope (POC)

현재 구현 대상

- Today
- Materials
- Questions
- Quiz (Bonus)

현재 구현하지 않는 기능

- Login
- Multi User
- Supabase
- LMS
- Assignment Sync
- RAG
- pgvector
- Embedding
- Progress Dashboard
- Analytics

---

# Development Priority

반드시 아래 순서를 따른다.

```
Phase 0
↓

Phase 1
PDF Upload

↓

Phase 2
Summary
Chat

↓

Phase 4
Today
Plan

↓

Phase 5
Deployment

↓

Phase 3
Quiz (Bonus)
```

Quiz는 시간이 남을 경우에만 구현한다.

Today 화면보다 우선하지 않는다.

---

# UI Principles

앱의 첫 화면은 반드시

```
Today
```

이다.

Today 화면에는

- Subject
- Exam Date
- D-Day
- Today's Tasks
- CTA

만 표시한다.

아래 요소는 현재 구현하지 않는다.

- Progress %
- AI Score
- Study Time
- Mandatory Quiz
- Fancy Dashboard

---

# Component Rules

page.tsx에는 로직을 작성하지 않는다.

page.tsx는

```
<AppShell />
```

만 렌더링한다.

탭별 UI는 각각 독립적인 컴포넌트로 작성한다.

예)

```
TodayPage

MaterialsPage

QuestionsPage

QuizPage
```

---

# API Rules

API는 Route Handler를 사용한다.

```
/api/upload

/api/summarize

/api/chat

/api/plan

/api/quiz
```

응답은 항상 JSON이다.

TypeScript 타입과 반드시 일치해야 한다.

---

# Mock First

실제 OpenAI보다

Mock API를 먼저 작성한다.

순서

```
Mock Data

↓

UI 연결

↓

OpenAI 연결
```

Mock 데이터는

```
src/lib/mock
```

에 작성한다.

---

# State Management

localStorage 접근은

```
hooks
```

를 통해 수행한다.

컴포넌트에서 직접

```
localStorage.getItem()
```

를 호출하지 않는다.

---

# Type Rules

공통 타입은

```
src/types
```

에 정의한다.

컴포넌트 내부에서 타입를 중복 정의하지 않는다.

---

# Styling Rules

Tailwind CSS를 사용한다.

기존 디자인을 최대한 유지한다.

불필요한 UI 리뉴얼을 하지 않는다.

애니메이션은 최소화한다.

---

# Git Strategy

```
main
```

배포 가능한 코드

```
develop
```

통합 브랜치

```
feature/*
```

기능 개발

```
fix/*
```

버그 수정

```
docs/*
```

문서 수정

```
chore/*
```

환경 설정

---

# Pull Request Rules

모든 PR은

```
develop
```

으로 생성한다.

하나의 브랜치에는

하나의 기능만 구현한다.

---

# Collaboration

권장 담당

### Team Member 1

Today

Plan

UI

---

### Team Member 2

Upload

Summary

PDF Parsing

---

### Team Member 3

Question

OpenAI

Chat

---

### Team Member 4

Deployment

Documentation

Cache

QA

---

# Coding Guidelines

Prefer

- Small Components
- Reusable Components
- Readable Code
- Explicit Types

Avoid

- Huge Components
- Duplicated Code
- Magic Numbers
- Inline API Logic

---

# Error Handling

모든 API는

- Validation
- Error Response
- Loading State

를 고려한다.

자료에 없는 질문은

```
자료에 없습니다.
```

를 반환한다.

---

# Environment Variables

환경 변수는

```
.env.local
```

에 저장한다.

Git에는

```
.env.example
```

만 포함한다.

API Key를 코드에 직접 작성하지 않는다.

---

# Build Requirements

커밋 전 반드시 확인

```
npm install

npm run build
```

TypeScript Error

```
0
```

Build Error

```
0
```

---

# Documentation

README는 항상 최신 상태를 유지한다.

새로운 API가 추가되면

```
docs/API_CONTRACT.md
```

도 함께 수정한다.

협업 규칙이 변경되면

```
docs/CONTRIBUTING.md
```

도 함께 수정한다.

---

# Codex Instructions

Codex는 다음 원칙을 따른다.

- 기존 코드를 불필요하게 전면 재작성하지 않는다.
- 현재 프로젝트 구조를 최대한 유지한다.
- 새로운 라이브러리는 반드시 필요한 경우에만 추가한다.
- 기존 디자인을 존중한다.
- Mock API 계약을 먼저 유지한다.
- 타입 안정성을 유지한다.
- README와 문서를 함께 갱신한다.
- 하나의 PR에서 너무 많은 변경을 하지 않는다.
- 기능 구현보다 프로젝트 구조를 우선한다.
- 구현 범위를 벗어난 기능은 추가하지 않는다.
- Quiz는 Bonus 기능으로 간주한다.
- Today 화면의 UX를 최우선으로 유지한다.

---

# Success Criteria

이번 POC의 성공 기준은

- PDF 업로드
- Summary
- Question
- Today
- D-Day 기반 Plan
- 안정적인 시연

이다.

새로운 기능을 많이 만드는 것보다

**오늘 무엇을 공부해야 하는지 먼저 보여주는 경험**을 완성하는 것이 가장 중요하다.