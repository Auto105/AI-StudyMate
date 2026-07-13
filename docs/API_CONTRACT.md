# API Contract

AI StudyMate API는 Next.js Route Handler로 구현하며 모든 응답은 JSON입니다.

현재 PR에서는 실제 Route가 반환하는 형식을 기준으로 문서화합니다. OpenAI와 PDF parser 연결 전까지는 Mock 응답을 유지합니다.

## Common Rules

- 성공 응답은 각 endpoint의 TypeScript 타입과 일치해야 합니다.
- 실패 응답은 `{ "error": "message" }` 형식을 사용합니다.
- malformed JSON body는 `400`과 `{ "error": "Invalid JSON body." }`를 반환합니다.
- 입력값 검증 실패는 `400`을 반환합니다.
- 아직 실제 구현이 연결되지 않은 경우 `501`을 반환할 수 있습니다.
- 서버 처리 실패는 `500`을 반환합니다.
- 자료에 없는 질문은 `"자료에 없습니다."` 문구를 기준으로 처리합니다.

## POST /api/upload

Phase: P1 PDF Upload

Request:

```txt
multipart/form-data
file: PDF
```

현재 text fallback 요청도 지원합니다.

```txt
multipart/form-data
text: pasted lecture text
```

Response: `UploadResponse`

```json
{
  "text": "운영체제는 컴퓨터 하드웨어와 응용 프로그램 사이에서 자원을 관리한다.",
  "truncated": false
}
```

Validation:

- `text`가 있으면 최대 12,000자까지 반환합니다.
- `file`이 비어 있으면 `400`과 `{ "error": "빈 파일은 업로드할 수 없습니다." }`를 반환합니다.
- `file`이 PDF가 아니면 `400`과 `{ "error": "PDF 파일만 업로드할 수 있습니다." }`를 반환합니다.
- `file`이 5MB를 초과하면 `400`과 `{ "error": "PDF 파일은 5MB 이하만 업로드할 수 있습니다." }`를 반환합니다.
- `file` 내용이 PDF 시그니처(`%PDF-`)가 아니면 `400`과 `{ "error": "올바른 PDF 파일이 아닙니다." }`를 반환합니다.
- MIME 타입이 비어 있거나 `application/pdf`가 아니면 거부합니다.
- `text`와 `file`이 모두 없으면 `400`을 반환합니다.

Frontend client:

```ts
uploadMaterial(formData);
```

## POST /api/summarize

Phase: P2 Summary

Request: `SummarizeRequest`

```json
{
  "text": "강의자료에서 추출한 텍스트"
}
```

Response: `SummarizeResponse`

```json
{
  "keywords": ["운영체제", "프로세스", "스레드", "CPU 스케줄링"],
  "concepts": [
    "운영체제는 컴퓨터 자원을 관리하고 프로그램 실행을 돕는다.",
    "프로세스는 실행 중인 프로그램의 독립적인 자원 단위이다."
  ],
  "easyExplain": "운영체제는 여러 프로그램이 동시에 잘 실행되도록 CPU와 메모리 같은 자원을 관리합니다."
}
```

Validation:

- `text`는 비어 있지 않은 문자열이어야 합니다.
- malformed JSON은 `400`과 `{ "error": "Invalid JSON body." }`를 반환합니다.

Frontend client:

```ts
summarizeMaterial({ text });
```

## POST /api/chat

Phase: P2 Materials Q&A

Request: `ChatRequest`

```json
{
  "text": "강의자료에서 추출한 텍스트",
  "question": "프로세스와 스레드 차이?"
}
```

Response: `ChatResponse`

```json
{
  "answer": "프로세스는 실행 중인 프로그램의 독립적인 자원 단위이고, 스레드는 프로세스 안에서 실행되는 작업 흐름입니다.",
  "grounded": true
}
```

Out-of-material response:

```json
{
  "answer": "자료에 없습니다.",
  "grounded": false
}
```

Validation:

- `text`는 문자열이어야 합니다.
- `question`은 비어 있지 않은 문자열이어야 합니다.
- `text`가 비어 있으면 `grounded: false` 답변을 반환합니다.
- malformed JSON은 `400`과 `{ "error": "Invalid JSON body." }`를 반환합니다.

Frontend client:

```ts
askQuestion({ text, question });
```

## POST /api/plan

Phase: P4 Today Plan

Request: `PlanRequest`

```json
{
  "subject": "운영체제",
  "examDate": "2026-07-18",
  "keywords": ["프로세스", "스레드", "CPU 스케줄링"],
  "concepts": [
    "프로세스는 실행 중인 프로그램의 독립적인 자원 단위이다.",
    "스레드는 프로세스 안에서 실행되는 작업 흐름이다."
  ]
}
```

Response: `PlanResponse`

```json
{
  "today": [
    {
      "id": "today-task-1",
      "title": "강의자료 미리보기를 읽고 큰 흐름을 잡는다."
    }
  ],
  "days": [
    {
      "date": "2026-07-14",
      "label": "자료 훑기와 요약 확인",
      "tasks": [
        {
          "id": "day-1-task-1",
          "title": "강의자료 미리보기를 읽고 큰 흐름을 잡는다."
        }
      ]
    }
  ]
}
```

Validation:

- `subject`는 비어 있지 않은 문자열이어야 합니다.
- malformed JSON body는 `400`과 `{ "error": "Invalid JSON body." }`를 반환합니다.
- `examDate`는 `YYYY-MM-DD` 형식의 올바른 날짜여야 합니다.
- `keywords`는 문자열 배열이어야 합니다.
- `concepts`는 생략 가능하지만, 값이 있으면 문자열 배열이어야 합니다.

Rules:

- D-day에 따라 계획 길이가 달라집니다.
- D-5 demo는 5일 계획을 반환합니다.
- Summary `keywords`와 `concepts`는 task 내용에 반영됩니다.
- Quiz는 이 endpoint를 막지 않습니다.

Frontend client:

```ts
createStudyPlan({ subject, examDate, keywords, concepts });
```

## POST /api/quiz

Phase: P3 Bonus

Request: `QuizRequest`

```json
{
  "text": "강의자료에서 추출한 텍스트"
}
```

Response: `QuizResponse`

```json
{
  "mcq": [
    {
      "id": "mcq-process-thread",
      "question": "프로세스와 스레드에 대한 설명으로 가장 적절한 것은?",
      "choices": [
        "프로세스는 실행 중인 프로그램이고 스레드는 프로세스 안의 실행 단위이다.",
        "스레드는 항상 독립적인 주소 공간을 가진다."
      ],
      "answer": "프로세스는 실행 중인 프로그램이고 스레드는 프로세스 안의 실행 단위이다.",
      "explanation": "프로세스는 독립적인 자원을 가지며 스레드는 프로세스 내부에서 작업을 나누어 실행한다."
    }
  ],
  "ox": [
    {
      "id": "ox-os-resource",
      "statement": "운영체제는 CPU, 메모리 같은 컴퓨터 자원을 관리한다.",
      "answer": true,
      "explanation": "운영체제의 핵심 역할 중 하나는 시스템 자원 관리이다."
    }
  ]
}
```

Validation:

- `text`는 비어 있지 않은 문자열이어야 합니다.
- malformed JSON은 `400`과 `{ "error": "Invalid JSON body." }`를 반환합니다.

Frontend client:

```ts
createQuiz({ text });
```

Quiz는 선택 기능입니다. PDF upload, summary, Q&A, Today plan이 안정화된 뒤 다룹니다.
