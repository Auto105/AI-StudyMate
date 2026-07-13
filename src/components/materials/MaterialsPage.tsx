'use client';

import { useState } from 'react';
import { Card } from '@/components/common/Card';
import { SectionHeading } from '@/components/common/SectionHeading';
import { useStudyMaterials } from '@/hooks/useStudyMaterials';
import { summarizeMaterial } from '@/lib/api/client';

export function MaterialsPage() {
  const { material, setMaterial } = useStudyMaterials();
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSummary() {
    const text = material.text.trim();

    if (!text) {
      setError('요약할 텍스트를 먼저 입력하세요.');
      return;
    }

    setIsSummarizing(true);
    setError(null);

    try {
      const summary = await summarizeMaterial({ text });
      setMaterial({ ...material, summary });
    } catch (summaryError) {
      setError(summaryError instanceof Error ? summaryError.message : '요약 요청에 실패했습니다.');
    } finally {
      setIsSummarizing(false);
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <Card>
        <SectionHeading
          eyebrow="Materials"
          title="학습자료 추가"
          description="PDF 처리와 API 계약을 먼저 연결한 상태입니다. 텍스트 붙여넣기로 화면 흐름을 검증합니다."
        />

        <div className="rounded-[24px] border-2 border-dashed border-teal-700/25 bg-teal-50/50 p-6 text-center">
          <p className="font-bold text-slate-800">PDF 업로드 영역</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            최대 5MB PDF 1개 업로드와 추출 텍스트 12,000자 제한을 기준으로 설계했습니다.
          </p>
          <input type="file" accept="application/pdf" className="mt-4 w-full text-sm text-slate-600" />
        </div>

        <label className="mt-5 grid gap-2">
          <span className="text-sm font-bold text-slate-700">텍스트 직접 붙여넣기</span>
          <textarea
            value={material.text}
            onChange={(event) =>
              setMaterial({
                ...material,
                text: event.target.value,
                preview: event.target.value.slice(0, 280),
              })
            }
            rows={9}
            placeholder="강의자료, 필기, 교재 내용을 붙여넣으세요."
            className="min-h-52 resize-y rounded-2xl border border-slate-900/15 bg-white px-4 py-3 outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-700/10"
          />
        </label>

        {error ? <p className="mt-3 text-sm font-semibold text-red-700">{error}</p> : null}

        <button
          type="button"
          onClick={() => void handleSummary()}
          disabled={isSummarizing}
          className="mt-5 rounded-full bg-teal-700 px-5 py-3 font-bold text-white disabled:cursor-wait disabled:opacity-70"
        >
          {isSummarizing ? '요약 중...' : '요약하기'}
        </button>
      </Card>

      <Card>
        <SectionHeading title="텍스트 미리보기와 요약 결과" />

        <div className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
          {material.preview || '아직 추가한 텍스트가 없습니다. 왼쪽 영역에 자료를 붙여넣으면 미리보기가 표시됩니다.'}
        </div>

        <div className="mt-5 rounded-2xl border border-slate-900/10 bg-white p-4">
          {material.summary ? (
            <div className="grid gap-4">
              <div>
                <p className="font-bold text-slate-800">키워드</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {material.summary.keywords.map((keyword) => (
                    <span key={keyword} className="rounded-full bg-teal-50 px-3 py-1 text-sm font-semibold text-teal-800">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-bold text-slate-800">핵심 개념</p>
                <ul className="mt-2 list-inside list-disc text-sm leading-6 text-slate-600">
                  {material.summary.concepts.map((concept) => (
                    <li key={concept}>{concept}</li>
                  ))}
                </ul>
              </div>
              <p className="text-sm leading-6 text-slate-700">{material.summary.easyExplain}</p>
            </div>
          ) : (
            <p className="text-sm leading-6 text-slate-600">요약 결과가 여기에 표시됩니다.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
