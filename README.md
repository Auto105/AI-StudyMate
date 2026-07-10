# StudySync Supabase Sample

StudySync AI MVP 형태의 프런트엔드 샘플입니다.  
React + Vite + TypeScript 환경에서 Supabase의 `lecture_notes` 테이블과 연결되어 강의 노트를 조회, 등록, 삭제할 수 있습니다.

## 현재 구현 범위

- 강의 제목 입력
- 강의 내용 입력
- Supabase에 강의 노트 저장
- 최신 순 강의 노트 목록 조회
- 저장된 강의 노트 삭제

## 프로젝트 구조

- `src/App.tsx`: 강의 노트 목록 조회/등록/삭제 UI
- `src/lib/supabase.ts`: Supabase 클라이언트 초기화
- `src/types/lecture-note.ts`: 강의 노트 타입 정의
- `supabase/lecture_notes.sql`: 테이블/인덱스/RLS 정책 생성 SQL

## 실행 방법

1. `.env.example`를 참고해 `.env` 파일을 준비합니다.
2. 아래 명령어로 개발 서버를 실행합니다.

```bash
npm install
npm run dev
```

## 환경 변수

`.env`에는 아래 값이 필요합니다.

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

실제 키는 Git에 커밋하지 않도록 `.gitignore`에 제외 처리되어 있습니다.

## 빌드

```bash
npm run build
```

빌드 결과물은 `dist/` 디렉터리에 생성됩니다.
