# QA Checklist

## 1. Git and Build

- [ ] 현재 브랜치가 올바른지 확인합니다.
- [ ] 미커밋 변경사항이 없는지 확인합니다.
- [ ] `npm install`이 성공합니다.
- [ ] `npm run build`가 성공합니다.
- [ ] TypeScript 오류가 없습니다.
- [ ] `.env.local`과 API 키가 Git에 포함되지 않았습니다.

---

## 2. Data Layer

- [ ] 과목명이 새로고침 후 유지됩니다.
- [ ] 시험일이 새로고침 후 유지됩니다.
- [ ] 자료 텍스트가 새로고침 후 유지됩니다.
- [ ] PDF 추출 텍스트가 localStorage에 저장됩니다.
- [ ] Summary 결과가 새로고침 후 유지됩니다.
- [ ] UI 컴포넌트가 localStorage를 직접 호출하지 않습니다.
- [ ] `useStudyProfile()`이 과목명과 시험일을 관리합니다.
- [ ] `useStudyMaterials()`가 자료와 요약을 관리합니다.

---

## 3. Upload and Validation

- [ ] 텍스트 붙여넣기가 동작합니다.
- [ ] 정상 PDF 업로드가 성공합니다.
- [ ] 실제 발표용 PDF에서 텍스트 추출이 성공합니다.
- [ ] 파일 input이 `/api/upload`와 연결되어 있습니다.
- [ ] 빈 PDF는 400을 반환합니다.
- [ ] 비PDF 파일은 400을 반환합니다.
- [ ] 5MB 초과 PDF는 400을 반환합니다.
- [ ] `%PDF-` 시그니처가 없는 파일은 400을 반환합니다.
- [ ] 파싱 실패 시 사용자 친화적인 오류 메시지를 표시합니다.
- [ ] 추출 텍스트가 12,000자를 넘으면 `truncated: true`를 반환합니다.

---

## 4. API Routes

### Upload

- [ ] `uploadMaterial(formData)`가 `{ text, truncated }`를 반환합니다.

### Summary

- [ ] `summarizeMaterial({ text })`가 `{ keywords, concepts, easyExplain }`를 반환합니다.
- [ ] 새 PDF 또는 텍스트가 Summary 요청 body에 포함됩니다.
- [ ] 화면이 고정 상수가 아니라 실제 summary 상태를 렌더링합니다.

### Chat

- [ ] `askQuestion({ text, question })`가 `{ answer, grounded }`를 반환합니다.
- [ ] 자료 범위 안 질문에 답합니다.
- [ ] 자료 밖 질문에는 `자료에 없습니다.` 의미의 응답을 반환합니다.
- [ ] 새 자료 텍스트가 Chat 요청 body에 포함됩니다.

### Plan

- [ ] `createStudyPlan()`이 `today`와 `days`를 반환합니다.
- [ ] 모든 `StudyTask`에 `id`와 `title`이 존재합니다.
- [ ] D-5 plan이 5일 계획을 반환합니다.
- [ ] D-3 plan이 3일 계획을 반환합니다.
- [ ] D-2 plan이 2일 계획을 반환합니다.
- [ ] D-1 plan이 1일 계획을 반환합니다.
- [ ] 시험일 변경 시 Today Plan이 달라집니다.

### Quiz

- [ ] `createQuiz({ text })`가 객관식과 OX 문제를 반환합니다.
- [ ] 모든 객관식 문제에 `choices`, `answer`, `explanation`이 존재합니다.
- [ ] 새 자료 텍스트가 Quiz 요청 body에 포함됩니다.

---

## 5. Error Handling

- [ ] 빈 학습자료는 validation에 실패합니다.
- [ ] 빈 질문은 validation에 실패합니다.
- [ ] 빈 과목명은 validation에 실패합니다.
- [ ] 잘못된 시험일 형식은 validation에 실패합니다.
- [ ] 존재하지 않는 날짜는 validation에 실패합니다.
- [ ] malformed JSON은 400과 `{ "error": "Invalid JSON body." }`를 반환합니다.
- [ ] 모든 API 오류 응답은 JSON입니다.
- [ ] UI에서 API 오류 메시지를 확인할 수 있습니다.

---

## 6. Mock Mode

- [ ] `USE_MOCK_API=true`에서 실제 OpenAI 요청이 발생하지 않습니다.
- [ ] Summary Mock이 입력 자료의 주제와 일관됩니다.
- [ ] Chat Mock이 입력 자료의 주제와 일관됩니다.
- [ ] Quiz Mock이 입력 자료의 주제와 일관됩니다.
- [ ] Plan Mock이 Summary 결과와 일관됩니다.
- [ ] Mock 예시가 실제 사용자 데이터처럼 오해되지 않습니다.

---

## 7. OpenAI Mode

- [ ] `USE_MOCK_API=false`에서 지원 Route가 실제 OpenAI를 호출합니다.
- [ ] `OPENAI_API_KEY`가 없을 때 명확한 오류를 반환합니다.
- [ ] API 키가 브라우저 Network 또는 클라이언트 번들에 노출되지 않습니다.
- [ ] 긴 텍스트가 허용 길이에 맞게 truncate됩니다.
- [ ] JSON 응답 파싱 실패 시 재시도 또는 fallback이 동작합니다.
- [ ] 발표용 API 키 사용량과 만료 조건을 확인합니다.

---

## 8. Frontend UX

- [ ] Today가 기본 탭입니다.
- [ ] 페이지 전환이 정상입니다.
- [ ] PDF 업로드 중 Loading 상태가 보입니다.
- [ ] Summary 생성 중 Loading 상태가 보입니다.
- [ ] API 오류 시 Error State가 보입니다.
- [ ] 데이터가 없을 때 Empty State가 보입니다.
- [ ] 하드코딩 예시 데이터가 실제 상태를 덮어쓰지 않습니다.
- [ ] Questions의 초기 Demo Message가 새 자료와 충돌하지 않습니다.
- [ ] 모바일 화면에서 버튼이나 카드가 화면 밖으로 나가지 않습니다.
- [ ] 폼 요소에 적절한 `id` 또는 `name`이 있습니다.
- [ ] favicon 404가 발생하지 않습니다.

---

## 9. Presentation QA

### 발표 전

- [ ] 발표용 PDF 파일을 준비했습니다.
- [ ] 발표용 질문 문장을 준비했습니다.
- [ ] 발표용 시험일을 미리 설정했습니다.
- [ ] 브라우저 확대율과 창 크기를 고정했습니다.
- [ ] 개발 서버 또는 배포 URL이 정상입니다.
- [ ] API 모드를 확인했습니다.
- [ ] 발표용 API 키가 설정되어 있습니다.
- [ ] 인터넷 연결을 확인했습니다.
- [ ] Mock fallback을 준비했습니다.

### 시연 흐름

- [ ] Today 화면을 보여줍니다.
- [ ] Materials에서 PDF를 업로드합니다.
- [ ] 추출된 텍스트가 반영됩니다.
- [ ] Summary를 생성합니다.
- [ ] 실제 Summary 결과가 화면에 표시됩니다.
- [ ] Questions에서 자료 기반 질문을 합니다.
- [ ] Quiz를 생성합니다.
- [ ] Today Plan을 확인합니다.
- [ ] 시험일을 변경해 계획 변화를 보여줍니다.

### 발표 직후 확인

- [ ] Q&A 예상 질문에 답할 수 있습니다.
- [ ] 실제 구현과 향후 기능을 구분해 설명할 수 있습니다.
- [ ] 음성 직접 녹음과 STT는 향후 계획임을 설명할 수 있습니다.
- [ ] DOCX, Supabase, RAG는 향후 확장임을 설명할 수 있습니다.

---

## 10. Final Sign-off

- [ ] Frontend 담당 확인
- [ ] AI/API 담당 확인
- [ ] 상태관리/데이터 담당 확인
- [ ] Integration/QA 담당 확인
- [ ] 발표자 최종 확인
