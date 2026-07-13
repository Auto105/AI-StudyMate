'use client';

import { useState } from 'react';
import { Card } from '@/components/common/Card';
import { SectionHeading } from '@/components/common/SectionHeading';
import { useStudyMaterials } from '@/hooks/useStudyMaterials';
import { createQuiz } from '@/lib/api/client';
import type { QuizResponse } from '@/types/api';

export function QuizPage() {
  const { material } = useStudyMaterials();
  const [quiz, setQuiz] = useState<QuizResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  async function handleGenerate() {
    setIsGenerating(true);

    try {
      const response = await createQuiz({ text: material.text || '운영체제 기본 자료' });
      setQuiz(response);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <Card>
      <SectionHeading
        eyebrow="Quiz"
        title="문제 생성 준비"
        description="보너스 기능이므로 Today 화면의 필수 동선과 분리합니다."
      />

      <button
        type="button"
        onClick={() => void handleGenerate()}
        disabled={isGenerating}
        className="rounded-full bg-slate-900 px-5 py-3 font-bold text-white disabled:cursor-wait disabled:opacity-70"
      >
        {isGenerating ? '생성 중...' : '문제 생성'}
      </button>

      {!quiz ? (
        <div className="mt-5 rounded-2xl bg-slate-50 p-5 text-sm leading-6 text-slate-600">
          아직 생성된 문제가 없습니다. 실제 문제 품질 개선은 후속 작업 범위입니다.
        </div>
      ) : (
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <section className="rounded-2xl border border-slate-900/10 bg-white p-5">
            <h3 className="font-bold text-slate-900">객관식 문제</h3>
            {quiz.mcq.map((question) => (
              <article key={question.id} className="mt-4 text-sm leading-6 text-slate-700">
                <p className="font-semibold">{question.question}</p>
                <ol className="mt-2 list-inside list-decimal">
                  {question.choices.map((choice) => (
                    <li key={choice}>{choice}</li>
                  ))}
                </ol>
                <p className="mt-2 text-teal-800">정답: {question.answer}</p>
              </article>
            ))}
          </section>

          <section className="rounded-2xl border border-slate-900/10 bg-white p-5">
            <h3 className="font-bold text-slate-900">OX 문제</h3>
            {quiz.ox.map((question) => (
              <article key={question.id} className="mt-4 text-sm leading-6 text-slate-700">
                <p className="font-semibold">{question.statement}</p>
                <p className="mt-2 text-teal-800">정답: {question.answer ? 'O' : 'X'}</p>
                <p className="mt-1 text-slate-600">{question.explanation}</p>
              </article>
            ))}
          </section>
        </div>
      )}
    </Card>
  );
}
