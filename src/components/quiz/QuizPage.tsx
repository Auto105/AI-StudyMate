'use client';

import { useState } from 'react';
import { ApiFallbackOverlay } from '@/components/common/ApiFallbackOverlay';
import { useStudyData } from '@/hooks/useStudyData';
import { useStudyMaterials } from '@/hooks/useStudyMaterials';
import { createQuiz } from '@/lib/api/client';
import { getMockQuiz } from '@/lib/mock/quiz';

export function QuizPage() {
  const { material } = useStudyMaterials();
  const { getQuiz, saveQuiz, setSelectedQuizChoice } = useStudyData();
  const [isGenerating, setIsGenerating] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  const materialText = material.text.trim();
  const cachedQuiz = materialText ? getQuiz(materialText) : null;
  const activeQuiz = cachedQuiz?.result ?? null;
  const selectedChoice = cachedQuiz?.selectedChoice ?? '';
  const activeQuestion = activeQuiz?.mcq[0] ?? null;
  const totalQuestions = activeQuiz ? activeQuiz.mcq.length + activeQuiz.ox.length : 0;

  async function handleGenerate() {
    if (!materialText) {
      return;
    }

    setIsGenerating(true);
    setShowFallback(false);

    try {
      const response = await createQuiz({ text: materialText });
      saveQuiz(materialText, response);
    } catch {
      saveQuiz(materialText, getMockQuiz(materialText));
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
              {activeQuestion ? (
                <>
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#2563eb]">
                      Question 1 of {totalQuestions}
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
                            onChange={() => setSelectedQuizChoice(materialText, choice)}
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
                </>
              ) : (
                <div className="flex min-h-80 flex-col items-center justify-center px-4 text-center">
                  <span className="material-symbols-outlined mb-4 text-5xl text-[#737686]">quiz</span>
                  <h2 className="mb-2 text-2xl font-semibold leading-snug text-[#191b23]">
                    {materialText ? '자료 기반 퀴즈를 생성해 주세요.' : '먼저 Materials에서 학습 자료를 추가해 주세요.'}
                  </h2>
                  <p className="max-w-md text-sm leading-6 text-[#434655]">
                    {materialText
                      ? '아래 버튼을 누르면 현재 업로드된 자료를 기준으로 퀴즈를 만듭니다.'
                      : '퀴즈는 업로드된 자료가 있을 때만 시작됩니다.'}
                  </p>
                </div>
              )}
            </div>
          </article>

          <button
            type="button"
            onClick={() => void handleGenerate()}
            disabled={isGenerating || !materialText}
            className="inline-flex items-center gap-2 rounded-xl border border-[#c3c6d7] bg-white px-5 py-3 text-sm font-medium text-[#191b23] shadow-sm transition hover:bg-[#f3f3fe] disabled:cursor-wait disabled:opacity-70"
          >
            <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
            {isGenerating ? '문제 준비 중...' : '자료 기반 문제 불러오기'}
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
        <h3 className="mb-4 text-xl font-semibold leading-snug text-[#191b23]">Quiz Status</h3>
        <p className="text-sm leading-6 text-[#434655]">
          업로드된 자료를 기준으로 퀴즈를 생성합니다. Today 계획과 필수 학습 동선에는 포함하지 않습니다.
        </p>
      </section>
    </aside>
  );
}
