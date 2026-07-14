'use client';

import { useState } from 'react';
import { ApiFallbackOverlay } from '@/components/common/ApiFallbackOverlay';
import { useStudyData } from '@/hooks/useStudyData';
import { useStudyMaterials } from '@/hooks/useStudyMaterials';
import { askQuestion } from '@/lib/api/client';
import { getMockChatResponse } from '@/lib/mock/chat';
import type { ChatMessage } from '@/types/study';

const SUGGESTIONS = [
  { icon: 'lightbulb', label: '시험 핵심 개념', question: '시험에 나올 핵심 개념을 정리해줘.' },
  { icon: 'list_alt', label: '주요 용어 정리', question: '자료의 주요 용어를 정리해줘.' },
];

const MATERIAL_GREETING: ChatMessage = {
  id: 'assistant-material-greeting',
  role: 'assistant',
  content: '반가워요! 등록한 학습 자료에서 어떤 부분이 궁금하신가요?',
};

export function QuestionsPage() {
  const { material, isReady } = useStudyMaterials();
  const { appendChatMessages, data } = useStudyData();
  const [question, setQuestion] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const hasMaterial = material.text.trim().length > 0;
  const messages = data.chatHistory;
  const visibleMessages = isReady && hasMaterial && messages.length === 0 ? [MATERIAL_GREETING] : messages;

  async function handleSubmit() {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || !hasMaterial) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmedQuestion,
    };

    appendChatMessages(...(messages.length === 0 ? [MATERIAL_GREETING, userMessage] : [userMessage]));
    setQuestion('');
    setIsSending(true);
    setShowFallback(false);

    try {
      const response = await askQuestion({
        text: material.text,
        question: trimmedQuestion,
      });

      appendChatMessages({
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.answer,
        grounded: response.grounded,
      });
    } catch {
      const fallback = getMockChatResponse(material.text, trimmedQuestion);

      appendChatMessages({
        id: `assistant-fallback-${Date.now()}`,
        role: 'assistant',
        content: fallback.answer,
        grounded: fallback.grounded,
      });
      setShowFallback(true);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="relative mx-auto flex h-[calc(100vh-64px)] w-full max-w-4xl flex-col p-4 md:p-6">
      <div className={`flex min-h-0 flex-1 flex-col transition ${showFallback ? 'pointer-events-none opacity-40 blur-[1px]' : ''}`}>
        <header className="mb-6 shrink-0">
          <h2 className="mb-1 text-2xl font-semibold leading-tight text-[#191b23]">자료 기반 질문</h2>
          <p className="text-sm leading-6 text-[#434655]">등록한 학습 자료의 내용 안에서 질문할 수 있어요.</p>
        </header>

        <section className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-[#c3c6d7]/50 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.03)]">
          <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-6">
            {isReady && !hasMaterial ? (
              <div className="rounded-2xl bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                아직 저장된 자료가 없습니다. Materials에서 텍스트를 추가하면 해당 내용 안에서 답합니다.
              </div>
            ) : null}

            {visibleMessages.map((message) =>
              message.role === 'user' ? (
                <UserMessage key={message.id} content={message.content} />
              ) : (
                <AssistantMessage key={message.id} content={message.content} grounded={message.grounded} />
              ),
            )}

            {isSending ? <AssistantMessage content="자료 안에서 답을 찾고 있어요..." grounded /> : null}
          </div>

          <div className="border-t border-[#c3c6d7]/30 bg-white p-4">
            <div className="hide-scrollbar mb-3 flex gap-2 overflow-x-auto pb-1">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion.label}
                  type="button"
                  onClick={() => setQuestion(suggestion.question)}
                  className="flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-[#c3c6d7]/50 bg-[#ededf9] px-3 py-1.5 text-sm font-medium text-[#434655] transition hover:bg-[#e7e7f3] hover:text-[#004ac6]"
                >
                  <span className="material-symbols-outlined text-[16px]">{suggestion.icon}</span>
                  {suggestion.label}
                </button>
              ))}
            </div>

            <div className="relative flex items-end gap-2 rounded-xl border border-[#c3c6d7] bg-white p-2 shadow-sm transition focus-within:border-[#004ac6] focus-within:ring-1 focus-within:ring-[#004ac6]">
              <button
                type="button"
                className="self-end rounded-full p-2 text-[#434655] transition hover:text-[#004ac6]"
                aria-label="파일 첨부"
              >
                <span className="material-symbols-outlined">attach_file</span>
              </button>
              <textarea
                rows={1}
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    void handleSubmit();
                  }
                }}
                placeholder="질문을 입력하세요..."
                className="max-h-32 flex-1 resize-none border-none bg-transparent py-2 text-base leading-6 text-[#191b23] outline-none placeholder:text-[#9ca3af] focus:ring-0"
              />
              <button
                type="button"
                onClick={() => void handleSubmit()}
                disabled={isSending || !question.trim()}
                className="self-end rounded-lg bg-[#2563eb] p-2 text-white shadow-sm transition hover:bg-[#b4c5ff] hover:text-[#00174b] disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="질문 전송"
              >
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>
            <div className="mt-2 text-center">
              <span className="text-[10px] font-semibold text-[#9ca3af]">
                AI-StudyMate는 실수할 수 있습니다. 중요한 정보는 자료를 직접 확인하세요.
              </span>
            </div>
          </div>
        </section>
      </div>

      <ApiFallbackOverlay isVisible={showFallback} onRetry={() => setShowFallback(false)} />
    </div>
  );
}

function AssistantMessage({ content, grounded }: { content: string; grounded?: boolean }) {
  return (
    <article className="flex max-w-[85%] gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2563eb] text-white">
        <span className="material-symbols-outlined text-lg">robot_2</span>
      </div>
      <div className="flex min-w-0 flex-col gap-1">
        <span className="ml-1 text-xs font-semibold text-[#434655]">AI-StudyMate</span>
        <div className="rounded-2xl rounded-tl-sm border border-[#c3c6d7]/30 bg-[#f3f3fe] px-5 py-4 text-base leading-relaxed text-[#191b23]">
          <p>{content}</p>
          {grounded !== undefined ? (
            <div className="mt-4 flex items-center gap-2 border-t border-[#c3c6d7]/20 pt-4">
              <span className="material-symbols-outlined text-sm text-[#434655]">description</span>
              <span className="text-sm leading-5 text-[#434655]">
                {grounded ? '등록한 학습 자료 기반 답변' : '자료에 없습니다.'}
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function UserMessage({ content }: { content: string }) {
  return (
    <article className="flex max-w-[85%] flex-row-reverse gap-4 self-end">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e1e2ed] text-[#191b23]">
        <span className="material-symbols-outlined text-lg">person</span>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className="mr-1 text-xs font-semibold text-[#434655]">You</span>
        <div className="rounded-2xl rounded-tr-sm bg-[#2563eb] px-5 py-3 text-base leading-relaxed text-white shadow-sm">
          {content}
        </div>
      </div>
    </article>
  );
}
