'use client';

import { useState } from 'react';
import { Card } from '@/components/common/Card';
import { SectionHeading } from '@/components/common/SectionHeading';
import { DEMO_CHAT_MESSAGES } from '@/constants/demo';
import { useStudyMaterials } from '@/hooks/useStudyMaterials';
import { askQuestion } from '@/lib/api/client';
import type { ChatMessage } from '@/types/study';

export function QuestionsPage() {
  const { material } = useStudyMaterials();
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(DEMO_CHAT_MESSAGES);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasMaterial = material.text.trim().length > 0;

  async function handleSubmit() {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmedQuestion,
    };

    setMessages((current) => [...current, userMessage]);
    setQuestion('');
    setIsSending(true);
    setError(null);

    try {
      const response = await askQuestion({
        text: material.text,
        question: trimmedQuestion,
      });

      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: response.answer,
          grounded: response.grounded,
        },
      ]);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : '질문 요청에 실패했습니다.');
    } finally {
      setIsSending(false);
    }
  }

  return (
    <Card>
      <SectionHeading
        eyebrow="Questions"
        title="자료 기반 질문"
        description="자료 안에 근거가 있는지 여부를 명확히 표시합니다."
      />

      {!hasMaterial ? (
        <div className="mb-5 rounded-2xl bg-amber-50 p-4 text-sm leading-6 text-amber-900">
          아직 저장된 자료가 없습니다. Materials에서 텍스트를 추가하면 해당 내용 안에서 답합니다.
        </div>
      ) : null}

      <div className="grid gap-3">
        {messages.map((message) => (
          <article
            key={message.id}
            className={`max-w-3xl rounded-2xl p-4 text-sm leading-6 ${
              message.role === 'user'
                ? 'ml-auto bg-teal-700 text-white'
                : 'bg-slate-50 text-slate-700'
            }`}
          >
            <p>{message.content}</p>
            {message.role === 'assistant' ? (
              <p className={`mt-2 text-xs font-bold ${message.grounded ? 'text-teal-700' : 'text-red-700'}`}>
                {message.grounded ? '자료 기반 답변' : '자료에 없습니다.'}
              </p>
            ) : null}
          </article>
        ))}
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-[1fr_auto]">
        <textarea
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          rows={3}
          placeholder="자료 내용에 대해 질문하세요."
          className="resize-y rounded-2xl border border-slate-900/15 bg-white px-4 py-3 outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-700/10"
        />
        <button
          type="button"
          onClick={() => void handleSubmit()}
          disabled={isSending}
          className="rounded-full bg-teal-700 px-6 py-3 font-bold text-white disabled:cursor-wait disabled:opacity-70 md:self-end"
        >
          {isSending ? '전송 중...' : '질문 전송'}
        </button>
      </div>
      {error ? <p className="mt-3 text-sm font-semibold text-red-700">{error}</p> : null}
    </Card>
  );
}
