'use client';

import { useState } from 'react';
import { ApiFallbackOverlay } from '@/components/common/ApiFallbackOverlay';
import { useStudyMaterials } from '@/hooks/useStudyMaterials';
import { createQuiz } from '@/lib/api/client';
import { mockQuiz } from '@/lib/mock/quiz';
import type { QuizResponse } from '@/types/api';

const DEFAULT_MATERIAL_TEXT = '운영체제에서 프로세스는 실행 중인 프로그램이고 스레드는 프로세스 안의 실행 단위다.';

export function QuizPage() {
  const { material } = useStudyMaterials();
  const [quiz, setQuiz] = useState<QuizResponse | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  const activeQuiz = quiz ?? mockQuiz;
  const activeQuestion = activeQuiz.mcq[0] ?? mockQuiz.mcq[0];
  const totalQuestions = activeQuiz.mcq.length + activeQuiz.ox.length;

  async function handleGenerate() {
    setIsGenerating(true);
    setShowFallback(false);

    try {
      const response = await createQuiz({ text: material.text || DEFAULT_MATERIAL_TEXT });
      setQuiz(response);
      setSelectedChoice('');
    } catch {
      setQuiz(mockQuiz);
      setSelectedChoice('');
      setShowFallback(true);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="relative">
      <div
        className={`flex min-h-[calc(100vh-4rem)] flex-col gap-8 p-4 transition md:flex-row md:p-8 ${
          showFallback ? 'pointer-events-none opacity-40 blur-[1px]' : ''
        }`}
      >
        <section className="mx-auto w-full max-w-3xl flex-1 space-y-6">
          <header className="mb-8">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#57dffe] px-2 py-0.5 text-[10px] font-bold text-[#006172]">
                Bonus
              </span>
              <span className="text-xs font-semibold text-[#737686]">Today 필수 동선과 분리된 선택 기능</span>
            </div>
            <h1 className="mb-2 text-[32px] font-semibold leading-tight text-[#191b23]">퀴즈 (Quiz)</h1>
            <p className="text-lg leading-7 text-[#434655]">학습한 내용을 바탕으로 AI가 생성한 맞춤형 퀴즈입니다.</p>
          </header>

          <article className="relative overflow-hidden rounded-2xl border border-[#c3c6d7] bg-white p-6 shadow-[0_4px_12px_rgba(0,0,0,0.03)] md:p-8">
            <div className="absolute bottom-0 left-0 top-0 w-1 bg-[#2563eb]" />

            <div className="pl-4">
              <div className="mb-6 flex items-center justify-between gap-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2563eb]">
                  Question 1 of {Math.max(totalQuestions, 1)}
                </span>
                <div className="h-2 w-1/3 overflow-hidden rounded-full bg-[#e1e2ed]">
                  <div className="h-full rounded-full bg-[#2563eb]" style={{ width: '30%' }} />
                </div>
              </div>

              <h2 className="mb-8 text-2xl font-semibold leading-snug text-[#191b23]">{activeQuestion.question}</h2>

              <div className="mb-8 space-y-4">
                {activeQuestion.choices.map((choice) => {
                  const isSelected = selectedChoice === choice;

                  return (
                    <label key={choice} className="block cursor-pointer">
                      <input
                        type="radio"
                        name={activeQuestion.id}
                        className="sr-only"
                        value={choice}
                        checked={isSelected}
                        onChange={() => setSelectedChoice(choice)}
                      />
                      <span
                        className={`flex items-center gap-4 rounded-xl border p-4 transition ${
                          isSelected
                            ? 'border-[#2563eb] bg-[#f3f3fe]'
                            : 'border-[#c3c6d7] bg-white hover:border-[#2563eb]'
                        }`}
                      >
                        <span
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition ${
                            isSelected ? 'border-[#2563eb]' : 'border-[#c3c6d7]'
                          }`}
                        >
                          <span
                            className={`h-3 w-3 rounded-full bg-[#2563eb] transition-opacity ${
                              isSelected ? 'opacity-100' : 'opacity-0'
                            }`}
                          />
                        </span>
                        <span className="text-lg leading-7 text-[#191b23]">{choice}</span>
                      </span>
                    </label>
                  );
                })}
              </div>

              <div className="flex items-center justify-between border-t border-[#c3c6d7] pt-4">
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-xl border border-[#c3c6d7] px-6 py-2 text-sm font-medium text-[#191b23] transition hover:bg-white"
                >
                  <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                  이전
                </button>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-xl bg-[#2563eb] px-6 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#004ac6]"
                >
                  다음
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </article>

          <button
            type="button"
            onClick={() => void handleGenerate()}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 rounded-xl border border-[#c3c6d7] bg-white px-5 py-3 text-sm font-medium text-[#191b23] shadow-sm transition hover:bg-[#f3f3fe] disabled:cursor-wait disabled:opacity-70"
          >
            <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
            {isGenerating ? '데모 문제 준비 중...' : '자료 기반 문제 불러오기'}
          </button>
        </section>

        <QuizRightPanel />
      </div>

      <ApiFallbackOverlay isVisible={showFallback} onRetry={() => setShowFallback(false)} />
    </div>
  );
}

function QuizRightPanel() {
  return (
    <aside className="w-full shrink-0 space-y-6 md:w-[320px]">
      <section className="rounded-2xl border border-[#c3c6d7] bg-white p-6 shadow-[0_4px_12px_rgba(0,0,0,0.03)]">
        <h3 className="mb-4 text-xl font-semibold leading-snug text-[#191b23]">Upcoming</h3>

        <div className="flex cursor-default items-start gap-4 rounded-lg p-3 transition hover:bg-white">
          <div className="flex min-w-12 flex-col items-center justify-center rounded-lg bg-[#ededf9] px-3 py-2">
            <span className="text-xs font-semibold uppercase text-[#434655]">Oct</span>
            <span className="text-xl font-bold text-[#2563eb]">15</span>
          </div>
          <div>
            <h4 className="text-base font-semibold text-[#191b23]">운영체제 중간고사</h4>
            <p className="mt-1 flex items-center gap-1 text-sm leading-5 text-[#434655]">
              <span className="material-symbols-outlined text-[14px]">schedule</span>
              10:00 AM
            </p>
          </div>
          <span className="ml-auto whitespace-nowrap rounded-full bg-[#f59e0b]/10 px-2 py-1 text-xs font-semibold text-[#f59e0b]">
            D-2
          </span>
        </div>
      </section>

      <section className="rounded-2xl border border-[#c3c6d7] bg-white p-6 shadow-[0_4px_12px_rgba(0,0,0,0.03)]">
        <h3 className="mb-3 text-xl font-semibold leading-snug text-[#191b23]">Quiz Scope</h3>
        <p className="text-sm leading-6 text-[#434655]">
          현재 화면은 보너스 퀴즈 디자인 시연입니다. Today 계획과 필수 학습 동선에는 포함하지 않습니다.
        </p>
      </section>
    </aside>
  );
}
