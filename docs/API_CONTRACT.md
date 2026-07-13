# API Contract

AI StudyMate의 API는 모두 Next.js Route Handler로 구현하며, 응답은 항상 JSON입니다.

현재 POC에서는 mock 응답을 먼저 안정화하고, 이후 OpenAI와 PDF parser를 연결합니다.

## Common Rules

- 성공 응답은 각 endpoint의 TypeScript 타입과 일치해야 합니다.
- 실패 응답은 `{ "error": "message" }` 형식을 사용합니다.
- 입력값 검증 실패는 `400`을 사용합니다.
- 아직 실제 구현이 연결되지 않은 경우 `501`을 사용할 수 있습니다.
- 서버 처리 실패는 `500`을 사용합니다.
- 자료에 없는 질문은 `"자료에 없습니다."` 의미로 답합니다.

## POST /api/upload

Phase: P1 PDF Upload

Request:

```txt
multipart/form-data
file: PDF
```

Current fallback request:

```txt
multipart/form-data
text: pasted lecture text
```

Response:

```json
{
  "extractedText": "운영체제는 프로세스, 스레드, CPU 스케줄링을 관리한다..."
}
```

Legacy response currently supported by the C API wrapper:

```json
{
  "text": "운영체제는 프로세스, 스레드, CPU 스케줄링을 관리한다...",
  "truncated": false
}
```

Frontend should call:

```ts
uploadPdf(file, { fallbackOnError: true });
```

## POST /api/summarize

Phase: P2 Summary

Request:

```json
{
  "text": "강의자료에서 추출된 텍스트..."
}
```

Response:

```json
{
  "keywords": ["프로세스", "스레드", "CPU 스케줄링"],
  "concepts": [
    "프로세스는 독립적인 실행 단위이다.",
    "스레드는 프로세스 내부의 실행 흐름이다."
  ],
  "easyExplain": "운영체제는 여러 프로그램이 동시에 잘 실행되도록 자원을 관리한다."
}
```

Frontend should call:

```ts
summarizeText(extractedText, { fallbackOnError: true });
```

## POST /api/chat

Phase: P2 Materials Q&A

Request:

```json
{
  "text": "강의자료에서 추출된 텍스트...",
  "question": "프로세스와 스레드 차이?"
}
```

Response:

```json
{
  "answer": "프로세스는 독립적인 자원 단위이고, 스레드는 프로세스 안에서 실행되는 작업 흐름입니다.",
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

Frontend should call:

```ts
askQuestion(extractedText, question, { fallbackOnError: true });
```

## POST /api/plan

Phase: P4 Today Plan

Request:

```json
{
  "subject": "운영체제",
  "examDate": "2026-07-18",
  "keywords": ["프로세스", "스레드", "CPU 스케줄링"],
  "concepts": [
    "프로세스는 독립적인 실행 단위이다.",
    "스레드는 프로세스 내부의 실행 흐름이다."
  ]
}
```

Canonical response:

```json
{
  "today": [
    "프로세스와 스레드 차이를 표로 정리한다.",
    "CPU 스케줄링 핵심 용어를 암기한다."
  ],
  "days": [
    {
      "day": 1,
      "date": "2026-07-14",
      "title": "핵심 개념 정리",
      "tasks": ["프로세스", "스레드", "문맥 전환 개념 정리"]
    }
  ]
}
```

Legacy response currently supported by the C API wrapper:

```json
{
  "today": [{ "id": "today-task-1", "title": "프로세스와 스레드 차이를 표로 정리한다." }],
  "days": [
    {
      "date": "2026-07-14",
      "label": "핵심 개념 정리",
      "tasks": [{ "id": "day-1-task-1", "title": "프로세스 정리" }]
    }
  ]
}
```

Rules:

- The plan must change based on D-day.
- D-5 demo should return a 5-day plan.
- Summary `keywords` and `concepts` should influence tasks.
- Quiz must not block this endpoint.

Frontend should call:

```ts
createStudyPlan(planInput, { fallbackOnError: true });
```

## POST /api/quiz

Phase: P3 Bonus

Request:

```json
{
  "text": "강의자료에서 추출된 텍스트..."
}
```

Canonical response:

```json
{
  "mcq": [
    {
      "question": "프로세스에 대한 설명으로 가장 적절한 것은?",
      "options": ["프로세스 내부의 실행 흐름이다.", "실행 중인 프로그램의 독립적인 자원 단위이다."],
      "answer": "실행 중인 프로그램의 독립적인 자원 단위이다.",
      "explanation": "프로세스는 독립적인 주소 공간과 자원을 가진다."
    }
  ],
  "ox": [
    {
      "question": "스레드는 같은 프로세스의 메모리 공간을 공유할 수 있다.",
      "answer": true,
      "explanation": "공유 때문에 효율적이지만 동기화 문제가 생길 수 있다."
    }
  ]
}
```

Quiz is optional. It should be implemented only after PDF upload, summary, Q&A, and Today plan are stable.
