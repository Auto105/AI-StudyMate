# AI StudyMate

> **강의 전사 텍스트와 PDF 자료를 기반으로 AI 요약, 자료 기반 Q&A, 문제 생성, 그리고 시험일까지의 학습 계획을 제공하는 대학생용 학습 도우미**

AI StudyMate는 단순히 질문에 답하는 챗봇이 아니라, 학생이 학습 자료를 입력하면 **무엇을 이해해야 하고, 오늘 무엇을 공부해야 하는지**까지 연결해 주는 AI 학습 서비스 POC입니다.

---

## 1. 문제 정의

대학생은 강의자료, 필기, 시험일 정보를 여러 곳에서 따로 관리합니다.

그 결과 다음과 같은 문제가 발생합니다.

- 강의자료가 길어 핵심 내용을 빠르게 파악하기 어렵습니다.
- PDF, 필기, 전사 텍스트가 흩어져 있어 복습 흐름이 끊깁니다.
- 시험일까지 무엇을 언제 공부해야 할지 직접 계획해야 합니다.
- 생성형 AI를 사용하더라도 매번 자료를 다시 설명하고 질문해야 합니다.

---

## 2. 해결 방법

AI StudyMate는 다음 흐름으로 학습을 지원합니다.

```text
전사 텍스트 붙여넣기 또는 PDF 업로드
                ↓
        자료 텍스트 통합
                ↓
      AI 요약 · 핵심 개념 추출
                ↓
      자료 기반 Q&A · 문제 생성
                ↓
     시험일까지의 Today 학습 계획
```

사용자는 자료를 모두 읽지 않아도 핵심 내용을 빠르게 확인하고, 시험일까지 남은 기간에 맞춰 오늘의 학습 행동을 정할 수 있습니다.

---

## 3. 핵심 기능

### 자료 입력

- 강의 전사 텍스트 붙여넣기
- PDF 업로드 및 서버 텍스트 추출
- 추출 텍스트 최대 12,000자 사용
- PDF 최대 5MB 지원

### AI 학습 기능

- 강의자료 요약
- 핵심 키워드와 개념 추출
- 쉬운 설명 생성
- 자료 범위 안에서 Q&A
- 객관식 및 OX 문제 생성

### Today 학습 관리

- 과목명과 시험일 저장
- D-Day 자동 계산
- 시험일까지 남은 기간에 따른 학습 계획 생성
- D-5, D-2 등 날짜 변화에 따라 다른 학습 태스크 제공

---

## 4. 차별점

일반적인 AI 챗봇은 사용자가 먼저 질문해야 동작합니다.

AI StudyMate는 다음 행동까지 제안합니다.

```text
자료를 이해한다
        ↓
핵심 내용을 복습한다
        ↓
문제로 확인한다
        ↓
오늘 공부할 내용을 실행한다
```

즉, **자료 분석 결과를 일정 관리까지 연결하는 것**이 핵심 차별점입니다.

---

## 5. MVP 범위

### 이번 POC에 포함

- 텍스트 붙여넣기
- PDF 업로드 및 텍스트 추출
- AI 요약
- 자료 기반 Q&A
- 문제 생성
- 시험일 기반 Today Plan
- localStorage 기반 상태 저장
- Mock API와 실제 OpenAI 전환 구조

### 이번 POC에서 제외

- 음성 직접 녹음
- 음성 자동 텍스트 변환(STT)
- DOCX 업로드
- 로그인 및 멀티유저
- Supabase 데이터베이스
- RAG 및 Embedding
- LMS 연동
- OCR 기반 스캔 PDF 처리

---

## 6. 기술 스택

- **Frontend:** Next.js App Router, React, TypeScript, Tailwind CSS
- **Backend:** Next.js Route Handlers
- **AI:** OpenAI API
- **Document Processing:** pdf-parse
- **State:** React Hooks, localStorage
- **Deployment:** Vercel
- **Collaboration:** GitHub, Pull Request, Draft PR

---

## 7. API 실행 모드

기본값은 Mock 모드입니다.

```env
USE_MOCK_API=true
```

Mock 모드에서는 실제 OpenAI API 요청이 발생하지 않습니다.

실제 OpenAI 연결을 사용할 때는 다음과 같이 설정합니다.

```env
USE_MOCK_API=false
OPENAI_API_KEY=your_api_key
```

실제 지원되는 Route 범위는 `docs/API_CONTRACT.md`를 기준으로 확인합니다.

---

## 8. 설치 및 실행

### 의존성 설치

```bash
npm install
```

### 환경변수 설정

프로젝트 루트에 `.env.local`을 생성합니다.

```env
OPENAI_API_KEY=
USE_MOCK_API=true
```

실제 API 키와 `.env.local`은 Git에 커밋하지 않습니다.

### 개발 서버 실행

```bash
npm run dev
```

### 프로덕션 빌드

```bash
npm run build
```

---

## 9. 프로젝트 구조

```text
src/
├─ app/
│  ├─ api/
│  │  ├─ upload/
│  │  ├─ summarize/
│  │  ├─ chat/
│  │  ├─ plan/
│  │  └─ quiz/
│  ├─ layout.tsx
│  ├─ page.tsx
│  └─ globals.css
├─ components/
│  ├─ common/
│  ├─ layout/
│  ├─ materials/
│  ├─ questions/
│  ├─ quiz/
│  └─ today/
├─ hooks/
├─ lib/
│  ├─ api/
│  ├─ mock/
│  ├─ server/
│  ├─ storage/
│  └─ utils/
└─ types/

docs/
├─ PRD.md
├─ API_CONTRACT.md
├─ QA_CHECKLIST.md
├─ TEAM_HANDOFF.md
└─ DEMO_SCRIPT.md
```

---

## 10. 발표 시연 흐름

```text
1. Today 화면 소개
2. 과목명과 시험일 설정
3. Materials에서 PDF 업로드
4. 추출된 텍스트 확인
5. AI Summary 생성
6. 자료 기반 질문
7. Quiz 생성
8. Today Plan 확인
9. 시험일 변경 후 계획 변화 확인
```

자세한 시연 순서는 `docs/DEMO_SCRIPT.md`를 참고합니다.

---

## 11. 평가 기준과 프로젝트 대응

| 평가 항목 | 프로젝트에서 보여줄 내용 |
| --- | --- |
| 문제 정의·기획 | 학습자료 분산과 복습 계획 문제, PRD 완성도 |
| 구현 완성도 | PDF 업로드부터 요약·질문·문제·일정까지의 동작 흐름 |
| AI 활용도 | 자료 기반 요약, Q&A, 문제 생성, 학습 계획 |
| 창의성·실용성 | AI 결과를 Today 행동으로 연결하는 구조 |
| 발표·전달력 | 짧고 안정적인 데모, 명확한 화면 전환, Q&A 대비 |

---

## 12. 향후 발전 방향

- 음성 파일 직접 업로드 및 STT
- DOCX 지원
- 스캔 PDF OCR
- Supabase 기반 사용자별 학습 기록
- RAG 기반 대용량 문서 검색
- LMS 및 학교 공지 연동
- 개인화 복습 주기 추천
- 모바일 앱 또는 PWA
- 학습 통계와 장기 성과 분석

---

## 13. 브랜치 전략

- `main`: 발표 및 배포 가능한 안정 버전
- `develop`: 통합 테스트 브랜치
- `feature`: 팀 기능 개발 브랜치
- `integration`: QA, 문서, 배포 준비 브랜치

모든 기능은 Pull Request와 리뷰를 거쳐 `develop`에 병합합니다.
