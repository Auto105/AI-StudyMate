# Contributing

## 브랜치 규칙

- `develop`에서 기능 브랜치를 생성합니다.
- 브랜치 이름은 `feature/기능명`, `fix/수정명`, `docs/문서명`, `chore/작업명` 형식을 사용합니다.
- 하나의 브랜치에는 하나의 기능만 구현합니다.
- PR 대상은 `develop`으로 합니다.
- 최소 1명의 확인 후 병합합니다.

## 작업 범위

- `src/app/page.tsx`에는 복잡한 상태나 기능을 넣지 않습니다.
- 탭별 기능은 `src/components/today`, `src/components/materials`, `src/components/questions`, `src/components/quiz` 안에서 작업합니다.
- 공통 타입은 `src/types`에 둡니다.
- API 호출 코드는 `src/lib/api`를 통해 호출합니다.
- localStorage 접근은 `src/hooks`와 `src/lib/storage`를 사용합니다.

## 공용 파일 수정

다음 파일을 수정하기 전에는 팀원에게 알립니다.

- `package.json`
- `src/types/*`
- `src/app/layout.tsx`
- `src/app/globals.css`
- `src/components/layout/*`
- `src/lib/api/client.ts`

## PR 전 확인

```bash
npm run build
```

빌드 오류가 없는 상태에서 PR을 생성합니다.

## 보안

- 실제 API 키를 코드에 작성하지 않습니다.
- `.env.local`을 커밋하지 않습니다.
- OpenAI API 키는 배포 환경변수 또는 로컬 `.env.local`로만 관리합니다.
