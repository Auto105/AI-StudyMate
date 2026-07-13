'use client';

import { useState } from 'react';
import { Card } from '@/components/common/Card';

const DISPLAY_TASKS = [
  '프로세스와 스레드 차이 정리하기',
  '스케줄링 알고리즘 3개 복습하기',
  '핵심 요약 한 줄 만들기',
];

export function TodayPage() {
  const [completedTaskIds, setCompletedTaskIds] = useState<number[]>([]);

  function toggleTask(taskIndex: number) {
    setCompletedTaskIds((current) =>
      current.includes(taskIndex) ? current.filter((index) => index !== taskIndex) : [...current, taskIndex],
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.28fr)_360px]">
      <section className="overflow-hidden rounded-[32px] bg-gradient-to-br from-slate-950 via-teal-900 to-teal-700 p-7 text-white shadow-[0_22px_48px_rgba(15,118,110,0.28)] md:p-10">
        <p className="inline-flex rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold tracking-wide text-teal-50">TODAY&apos;S FIRST ACTION</p>
        <h2 className="mt-6 text-3xl font-bold leading-tight md:text-4xl">운영체제 시험까지 <span className="text-teal-200">D-5</span>, 오늘은 이것부터 시작하세요.</h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-teal-50 md:text-base">질문하기 전에 오늘의 첫 행동을 정합니다. 데이터 연결 전에는 데모 내용을 표시합니다.</p>
        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-bold text-teal-50">과목<input defaultValue="운영체제" className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white outline-none" /></label>
          <label className="grid gap-2 text-sm font-bold text-teal-50">시험일<input type="date" defaultValue="2026-07-18" className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white outline-none" /></label>
        </div>
        <button type="button" className="mt-7 rounded-full bg-white px-5 py-3 font-bold text-teal-900 transition hover:bg-teal-50">오늘의 학습 계획 만들기</button>
      </section>
      <Card className="self-start"><p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">Exam</p><div className="mt-3 flex items-start justify-between gap-4"><h2 className="text-2xl font-bold text-slate-900">운영체제</h2><span className="rounded-full bg-red-50 px-3 py-1.5 text-sm font-bold text-red-700">D-5</span></div><div className="mt-6 rounded-2xl bg-slate-50 p-4"><p className="text-sm text-slate-600">시험일</p><p className="mt-1 font-bold text-slate-900">2026-07-18</p></div></Card>
      <section className="lg:col-span-2"><div className="mb-5 flex items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">Study plan</p><h2 className="mt-2 text-2xl font-bold text-slate-900">오늘 할 일</h2></div><p className="text-sm font-bold text-slate-600">{completedTaskIds.length} / {DISPLAY_TASKS.length} 완료</p></div><div className="grid gap-4 md:grid-cols-3">{DISPLAY_TASKS.map((task, index) => { const isCompleted = completedTaskIds.includes(index); return <button key={task} type="button" onClick={() => toggleTask(index)} className={`rounded-[24px] border p-5 text-left shadow-[0_14px_32px_rgba(20,33,61,0.06)] transition hover:-translate-y-0.5 ${isCompleted ? 'border-teal-200 bg-teal-50' : 'border-slate-900/10 bg-white/85'}`} aria-pressed={isCompleted}><span className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold ${isCompleted ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-600'}`}>{isCompleted ? '✓' : index + 1}</span><span className={`mt-4 block font-bold ${isCompleted ? 'text-teal-800 line-through' : 'text-slate-900'}`}>{task}</span></button>; })}</div><button type="button" className="mt-6 rounded-full bg-teal-700 px-6 py-3 font-bold text-white shadow-lg shadow-teal-900/20 transition hover:bg-teal-800">오늘 공부 시작하기</button></section>
    </div>
  );
}
