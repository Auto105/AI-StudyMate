'use client';

import type { ChangeEvent } from 'react';
import { useState } from 'react';
import { ApiFallbackOverlay } from '@/components/common/ApiFallbackOverlay';
import { useStudyMaterials } from '@/hooks/useStudyMaterials';
import { summarizeMaterial, uploadMaterial } from '@/lib/api/client';
import { getSummarizeFallback } from '@/lib/fallbacks';
import { createTextPreview } from '@/lib/pdf';

export function MaterialsPage() {
  const { material, setMaterial } = useStudyMaterials();
  const summary = material.summary;
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFallback, setShowFallback] = useState(false);
  const summaryTitle = summary?.keywords.length ? `${summary.keywords[0]} 자료 기반` : 'AI 요약';

  async function handlePdfUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    setSelectedFileName(file.name);
    setIsUploading(true);
    setError(null);
    setShowFallback(false);

    try {
      const upload = await uploadMaterial(formData);
      setMaterial({
        ...material,
        text: upload.text,
        preview: createTextPreview(upload.text, 280),
        summary: undefined,
      });
      setError(upload.truncated ? 'PDF text was truncated to 12,000 characters.' : null);
    } catch (uploadError) {
      const message = uploadError instanceof Error ? uploadError.message : 'PDF upload failed.';
      setError(message);
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  }

  async function handleSummary() {
    const text = material.text.trim();

    if (!text) {
      setError('요약할 텍스트를 먼저 입력하세요.');
      return;
    }

    setIsSummarizing(true);
    setError(null);
    setShowFallback(false);

    try {
      const summary = await summarizeMaterial({ text });
      setMaterial({ ...material, summary });
    } catch {
      setMaterial({ ...material, summary: getSummarizeFallback(text) });
      setError('API 요청에 실패해 데모 요약을 불러왔습니다.');
      setShowFallback(true);
    } finally {
      setIsSummarizing(false);
    }
  }

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)]">
      <div className={`flex min-w-0 flex-1 transition ${showFallback ? 'pointer-events-none opacity-40 blur-[1px]' : ''}`}>
        <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 md:px-8">
          <header className="mb-6">
            <h2 className="mb-2 text-5xl font-bold leading-tight text-[#191b23]">학습 자료</h2>
            <p className="text-lg leading-7 text-[#434655]">PDF를 업로드하거나 강의 내용을 직접 붙여넣어 주세요.</p>
          </header>

          <section className="mb-12 grid grid-cols-1 gap-6 xl:grid-cols-2">
            <label className="group relative flex h-72 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-[#c3c6d7] bg-white p-8 text-center transition hover:border-[#004ac6]/50">
              <input
                type="file"
                accept="application/pdf,.pdf"
                className="sr-only"
                onChange={(event) => void handlePdfUpload(event)}
                disabled={isUploading}
              />
              <div className="absolute bottom-0 left-0 top-0 w-1 bg-[#0053db] opacity-50" />
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#dbe1ff] text-[#00174b] transition duration-300 group-hover:scale-110">
                <span className="material-symbols-outlined text-4xl">cloud_upload</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold leading-snug text-[#191b23]">파일 드래그 앤 드롭</h3>
              <p className="mb-6 text-sm leading-6 text-[#434655]">최대 5MB 용량의 PDF 파일을 지원합니다.</p>
              <span className="flex items-center gap-2 rounded-xl bg-[#004ac6] px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#004ac6]/90">
                <span className="material-symbols-outlined text-[18px]">folder_open</span>
                파일 선택
              </span>
              {selectedFileName ? (
                <p className="mt-3 max-w-full truncate text-xs font-semibold text-[#434655]">
                  {selectedFileName}
                </p>
              ) : null}
            </label>

            <section className="relative flex h-72 flex-col rounded-xl border border-[#c3c6d7] bg-white p-6">
              <div className="absolute bottom-0 left-0 top-0 w-1 rounded-l-xl bg-[#00687a] opacity-50" />
              <div className="mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#434655]">edit_note</span>
                <h3 className="text-xl font-semibold leading-snug text-[#191b23]">텍스트 직접 입력</h3>
              </div>
              <textarea
                value={material.text}
                onChange={(event) =>
                  setMaterial({
                    ...material,
                    text: event.target.value,
                    preview: event.target.value.slice(0, 280),
                  })
                }
                className="min-h-0 flex-1 resize-none rounded-lg border border-[#c3c6d7] bg-[#f3f3fe] p-4 text-base leading-6 text-[#191b23] outline-none transition placeholder:text-[#9ca3af] focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/20"
                placeholder="강의 노트나 학습 내용을 직접 붙여넣어 주세요."
              />
              <div className="mt-3 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => void handleSummary()}
                  disabled={isSummarizing}
                  className="flex items-center gap-1 text-sm font-medium text-[#004ac6] transition hover:text-[#004ac6]/80 disabled:cursor-wait disabled:opacity-70"
                >
                  <span className="material-symbols-outlined text-[16px]">magic_button</span>
                  {isSummarizing ? '요약 생성 중...' : 'AI 요약 생성'}
                </button>
                <span className="rounded-md bg-[#ededf9] px-2 py-1 text-xs font-semibold text-[#434655]">
                  {material.text.length.toLocaleString()} / 12,000
                </span>
              </div>
              {error ? <p className="mt-2 text-xs font-semibold text-[#ba1a1a]">{error}</p> : null}
            </section>
          </section>

          <section>
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#dbe1ff] px-3 py-1">
                  <span className="material-symbols-outlined text-sm text-[#004ac6]">auto_awesome</span>
                  <span className="text-xs font-semibold text-[#004ac6]">{summaryTitle}</span>
                </div>
                <h2 className="mb-2 text-5xl font-bold leading-tight text-[#191b23]">AI 요약</h2>
                <p className="text-lg leading-7 text-[#434655]">등록한 학습 자료에서 핵심 내용만 정리했어요.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="flex items-center gap-2 rounded-lg border border-[#c3c6d7] bg-white px-4 py-2 text-[#191b23] shadow-sm transition hover:bg-[#f3f3fe]">
                  <span className="material-symbols-outlined text-[20px]">content_copy</span>
                  <span className="text-sm font-medium">복사하기</span>
                </button>
                <button
                  type="button"
                  onClick={() => void handleSummary()}
                  disabled={isSummarizing}
                  className="flex items-center gap-2 rounded-lg border border-[#c3c6d7] bg-white px-4 py-2 text-[#191b23] shadow-sm transition hover:bg-[#f3f3fe] disabled:cursor-wait disabled:opacity-70"
                >
                  <span className="material-symbols-outlined text-[20px]">refresh</span>
                  <span className="text-sm font-medium">다시 요약하기</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <article className="relative flex flex-col overflow-hidden rounded-2xl border border-[#c3c6d7] bg-white p-6 shadow-[0_4px_12px_rgba(0,0,0,0.03)]">
                <div className="absolute bottom-0 left-0 top-0 w-1 bg-[#004ac6]" />
                <div className="mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#004ac6]">key</span>
                  <h2 className="text-xl font-semibold leading-snug text-[#191b23]">핵심 개념</h2>
                </div>
                <div className="space-y-4 text-base leading-6 text-[#434655]">
                  {summary?.concepts.length ? (
                    summary.concepts.map((concept, index) => (
                      <div key={`${index}-${concept}`}>
                        <strong className="mb-1 block text-[#191b23]">핵심 개념 {index + 1}</strong>
                        <p>{concept}</p>
                      </div>
                    ))
                  ) : (
                    <p>요약을 생성하면 핵심 개념이 표시됩니다.</p>
                  )}
                </div>
              </article>

              <article className="relative flex flex-col overflow-hidden rounded-2xl border border-[#c3c6d7] bg-white p-6 shadow-[0_4px_12px_rgba(0,0,0,0.03)]">
                <div className="absolute bottom-0 left-0 top-0 w-1 bg-[#f59e0b]" />
                <div className="mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#f59e0b]">priority_high</span>
                  <h2 className="text-xl font-semibold leading-snug text-[#191b23]">핵심 키워드</h2>
                </div>
                <ul className="list-disc space-y-3 pl-5 text-base leading-6 text-[#434655]">
                  {summary?.keywords.length ? (
                    summary.keywords.map((keyword, index) => (
                      <li key={`${index}-${keyword}`}>{keyword}</li>
                    ))
                  ) : (
                    <li>요약을 생성하면 핵심 키워드가 표시됩니다.</li>
                  )}
                </ul>
              </article>

              <article className="relative overflow-hidden rounded-2xl border border-[#c3c6d7] bg-white p-6 shadow-[0_4px_12px_rgba(0,0,0,0.03)] md:col-span-2">
                <div className="absolute bottom-0 left-0 top-0 w-1 bg-[#00687a]" />
                <div className="mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00687a]">school</span>
                  <h2 className="text-xl font-semibold leading-snug text-[#191b23]">쉽게 이해하기</h2>
                </div>
                <p className="text-base leading-7 text-[#434655]">
                  {summary?.easyExplain || '요약을 생성하면 쉬운 설명이 표시됩니다.'}
                </p>
              </article>
            </div>
          </section>
        </div>

        <MaterialsRightPanel />
      </div>

      <ApiFallbackOverlay isVisible={showFallback} onRetry={() => setShowFallback(false)} />
    </div>
  );
}

function MaterialsRightPanel() {
  return (
    <aside className="hidden w-[320px] shrink-0 flex-col overflow-y-auto border-l border-[#c3c6d7] bg-white px-6 py-6 xl:flex">
      <section className="mb-8">
        <h3 className="mb-4 text-xl font-semibold leading-snug text-[#191b23]">Storage Status</h3>
        <div className="rounded-xl bg-[#ededf9] p-4">
          <div className="mb-2 flex items-end justify-between">
            <span className="text-xs font-semibold text-[#434655]">Used Space</span>
            <span className="text-xl font-semibold text-[#191b23]">
              1.2 <span className="text-sm font-normal text-[#434655]">GB</span>
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-[#c3c6d7]/30">
            <div className="h-full w-[24%] rounded-full bg-[#004ac6]" />
          </div>
          <p className="mt-2 text-right text-xs font-semibold text-[#434655]">5 GB Total</p>
        </div>
      </section>

      <section>
        <h3 className="mb-4 text-xl font-semibold leading-snug text-[#191b23]">Upcoming Deadlines</h3>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 rounded-lg border border-[#c3c6d7] bg-white p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-[#f59e0b]/10 text-[#f59e0b]">
              <span className="text-[10px] font-semibold">D-2</span>
            </div>
            <div>
              <h4 className="text-sm font-medium text-[#191b23]">운영체제 중간고사</h4>
              <p className="text-[12px] leading-5 text-[#434655]">Need to summarize Week 5</p>
            </div>
          </div>
        </div>
      </section>
    </aside>
  );
}
