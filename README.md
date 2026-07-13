# AI-StudyMate

AI-StudyMate는 대학생을 위한 AI 학습 도우미 POC입니다. 핵심은 단순한 AI 채팅이 아니라, 과목·시험일·학습자료 상태를 바탕으로 앱을 열었을 때 “오늘 무엇을 공부해야 하는지” 먼저 제안하는 것입니다.

## 핵심 차별점

- 기본 진입 화면은 `오늘` 탭입니다.
- 질문보다 먼저 다음 행동을 제안합니다.
- D-day 변화에 따라 오늘 할 일이 달라지는 구조를 갖습니다. 데모 기준은 D-5와 D-2입니다.
- Quiz는 필수 동선이 아니라 보너스 기능입니다.
- Today 화면에는 진도율, 학습량 %, AI 점수, 중요도 별점, 필수 퀴즈를 넣지 않습니다.

## Phase 우선순위

필수 구현 순서는 다음입니다.

```text
P0 → P1 → P2 → P4 → P5
```

`P3 Quiz`는 보너스이며, P4/P5 이후 시간이 남을 때만 다룹니다.

| Phase | 목표 | 상태 |
| --- | --- | --- |
| P0 | 범위·기반 고정, IA/API 이름 확정 | 기본 구조 반영 |
| P1 | PDF 수집, 텍스트 추출 진입점 | Mock Route와 UI 골격 |
| P2 | 요약 + 자료 근거 Q&A | Mock Route와 fallback |
| P3 | Quiz 보너스 | 별도 탭의 최소 골격 |
| P4 | Today/다음 행동/plan | 기본 진입 화면과 D-5/D-2 Mock |
| P5 | 시연·배포·fallback | 문서와 Mock fallback 정리 |

## 기술 스택

- Next.js App Router
- TypeScript
- Tailwind CSS
- Route Handlers
- OpenAI API 연결 예정
- pdf-parse 연결 예정
- localStorage
- Vercel 배포 기준
- npm

## 설치 방법

```bash
npm install
```

## `.env.local` 설정 방법

`.env.example`을 참고해 `.env.local`을 생성합니다.

```env
OPENAI_API_KEY=
USE_MOCK_API=true
```

실제 API 키와 `.env.local`은 커밋하지 않습니다.

## 개발 서버 실행 방법

```bash
npm run dev
```

## 빌드 방법

```bash
npm run build
```

## 폴더 구조

```text
src/
├─ app/
│  ├─ api/              # Route Handlers
│  ├─ layout.tsx
│  ├─ page.tsx          # AppShell만 렌더링
│  └─ globals.css
├─ components/
│  ├─ common/
│  ├─ layout/
│  ├─ materials/
│  ├─ questions/
│  ├─ quiz/
│  └─ today/
├─ constants/
├─ hooks/
├─ lib/
│  ├─ api/
│  ├─ mock/
│  ├─ storage/
│  └─ utils/
└─ types/
```

## Mock 모드와 fallback

`USE_MOCK_API=true`이면 upload, summarize, chat, plan, quiz가 POC용 Mock 응답을 반환합니다.

- `summary`: 요약 키워드·개념·쉬운 설명 Mock 반환
- `chat`: 자료 근거 질문만 답변하고, 자료 밖 질문은 `자료에 없습니다` 반환
- `plan`: D-5와 D-2에서 서로 다른 오늘 할 일을 반환
- `quiz`: 보너스 기능용 MCQ/OX Mock 반환

Today plan은 과목명·시험일·요약 키워드를 `/api/plan`으로 전달하고, 마지막 정상 응답을 localStorage에 저장합니다. 동일한 과목과 시험일에서는 저장된 plan을 먼저 표시하고 새 응답으로 갱신합니다.

캐시 파일 기반 fallback은 로드맵의 P5 범위이지만, 이번 작업에서는 실제 `cache/*.json` 파일과 캐시 로직을 구현하지 않았습니다.

## 자료 제한

- PDF 파일: 5MB 이하
- 추출 텍스트: 최대 12,000자
- 현재 실제 PDF 파싱은 구현하지 않았고 Mock 업로드 응답과 제한 검증만 둡니다.

## 브랜치 전략

- `main`: 발표와 배포가 가능한 안정 버전
- `develop`: 팀 기능 통합 브랜치
- `feature/*`: 기능별 작업 브랜치

## 현재 구현 범위

- 4개 탭 기본 구조: 오늘, 자료, 질문, 시험
- 오늘 탭 기본 진입 및 D-day 배지
- D-5/D-2에 따라 달라지는 Today Mock task 구조
- 자료 탭 PDF 업로드 영역, 텍스트 fallback, 미리보기, 요약 결과 영역
- 질문 탭 메시지 목록과 자료 기반 여부 표시
- 시험 탭은 보너스 기능으로 분리
- 5개 API Route 계약과 Mock 응답
- 공통 타입, Mock 데이터, localStorage 훅
- 협업 문서와 API 계약 문서

## 향후 구현할 기능

- 실제 PDF 텍스트 추출
- OpenAI 요약/질문/계획/퀴즈 생성 연결
- cache fallback 구현
- Vercel 환경변수 설정과 배포

## Vercel 배포 준비

- Framework Preset: `Next.js`
- Build Command: `npm run build`
- Node.js Version: `20.9.0` 이상 (Next.js 16 최소 요구사항)
- Environment Variables: `USE_MOCK_API=true`을 Preview/Production에 설정합니다. 실제 OpenAI 연동 전까지 `OPENAI_API_KEY`는 필요하지 않습니다.
- 배포 전 로컬에서 `npm install`과 `npm run build`가 성공하는지 확인합니다.
