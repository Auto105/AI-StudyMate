# AI StudyMate Team Handoff

## Quick Start

```bash
npm install
npm run dev
```

기본 환경변수:

```env
USE_MOCK_API=true
OPENAI_API_KEY=
```

프로덕션 빌드:

```bash
npm run build
```

---

## 1. Project Goal

이번 POC의 목표는 다음과 같습니다.

> **텍스트 + PDF 기반 AI 요약 / 자료 기반 Q&A / 문제 생성 / 시험일 기반 일정 관리**

### 포함

- 텍스트 붙여넣기
- PDF 업로드 및 텍스트 추출
- AI Summary
- 자료 기반 Q&A
- Quiz
- Today D-Day Plan

### 제외

- 음성 직접 녹음
- STT
- DOCX
- 로그인
- Supabase
- RAG
- LMS
- OCR

---

## 2. Current Runtime Policy

### Mock Mode

```env
USE_MOCK_API=true
```

- 실제 OpenAI 요청 없음
- 안정적인 개발 및 발표 fallback 용도

### OpenAI Mode

```env
USE_MOCK_API=false
OPENAI_API_KEY=...
```

- 실제 지원 Route는 `docs/API_CONTRACT.md`를 기준으로 확인
- API 키는 서버에서만 사용
- `.env.local`은 Git에 커밋하지 않음

---

## 3. Shared Rules

- `src/app/page.tsx`는 `<AppShell />`만 렌더링합니다.
- Today를 기본 탭으로 유지합니다.
- UI 컴포넌트에서 localStorage를 직접 호출하지 않습니다.
- API 호출은 공통 client를 사용합니다.
- API 실패 응답은 `{ "error": "message" }` 형식을 유지합니다.
- malformed JSON은 400으로 처리합니다.
- PDF validation은 공통 validator를 사용합니다.
- 기능보다 발표 시연 안정성을 우선합니다.
- 새로운 기능은 발표 전날 추가하지 않습니다.

---

## 4. Ownership

### Frontend/UI

담당 범위:

```text
src/components/*
src/app/globals.css
src/components/layout/*
```

우선 확인:

- 실제 summary 상태 렌더링
- PDF 업로드 UI
- Loading / Error / Empty State
- 모바일 레이아웃
- Demo Message 제거 또는 초기화

### AI/API

담당 범위:

```text
src/app/api/*
src/lib/openai.ts
src/lib/prompts.ts
src/lib/mock/*
src/lib/server/*
```

우선 확인:

- `/api/upload`
- `/api/summarize`
- `/api/chat`
- `/api/plan`
- `/api/quiz`
- Mock/OpenAI 모드
- API 계약
- 모든 StudyTask의 `id`, `title`

### State/Data

담당 범위:

```text
src/hooks/*
src/lib/storage/*
src/types/*
src/lib/api/client.ts
```

우선 확인:

- 과목, 시험일, 자료, 요약 저장
- 새로고침 유지
- API 응답과 UI 상태 연결
- 타입과 API 계약 일치

### Integration/QA

담당 범위:

```text
README.md
.env.example
docs/*
GitHub PR
Vercel
QA
발표 시연
```

우선 확인:

- PR 리뷰
- build
- 실제 PDF 테스트
- Chrome DevTools
- 문서 최신화
- 배포
- 발표 리허설

---

## 5. Final Development Priority

```text
1. 실제 상태 렌더링
2. Mock 데이터 일관성
3. 실제 OpenAI Summary / Q&A
4. Today Plan 데이터 계약
5. Loading / Error State
6. 배포
7. 발표 리허설
```

새 기능 추가보다 아래 흐름을 안정화합니다.

```text
PDF/Text
  ↓
Summary
  ↓
Q&A
  ↓
Quiz
  ↓
Today Plan
```

---

## 6. Git Workflow

```text
작업
  ↓
Commit & Push
  ↓
Draft PR
  ↓
Integration Review
  ↓
수정 반영
  ↓
Ready for Review
  ↓
develop Merge
  ↓
develop 기준 QA
```

- `main`: 발표 및 배포 안정 버전
- `develop`: 통합 테스트 버전
- `feature`: 기능 개발
- `integration`: 문서, QA, 배포 준비

---

## 7. Final Handoff Checklist

- [ ] 현재 브랜치와 최신 develop 상태 확인
- [ ] `npm install`
- [ ] `npm run build`
- [ ] PDF 업로드
- [ ] 실제 텍스트 추출
- [ ] Summary 상태 렌더링
- [ ] 자료 기반 Q&A
- [ ] Quiz 생성
- [ ] Today Plan 생성
- [ ] D-Day 변화 확인
- [ ] Mock/OpenAI 모드 확인
- [ ] API 키 보안 확인
- [ ] README와 PRD 최신화
- [ ] 발표자료 및 Demo Script 확인
- [ ] 배포 URL 확인
