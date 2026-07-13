'use client';

import { useState } from 'react';

const DATE_CHIPS = ['D-5 오늘', 'D-4', 'D-3', 'D-2', 'D-1'];

const TODAY_TASKS = [
  {
    title: '1~3장 핵심 개념 복습',
    description: 'AI 요약을 읽고 주요 용어를 정리하세요',
    duration: '30분',
    accent: '#06b6d4',
  },
  {
    title: '프로세스와 스레드 차이 확인',
    description: '등록한 자료를 기반으로 개념을 비교하세요',
    duration: '20분',
    accent: '#004ac6',
  },
];

const CALENDAR_DAYS = [
  { day: '28', muted: true },
  { day: '29', muted: true },
  { day: '30', muted: true },
  { day: '1' },
  { day: '2' },
  { day: '3' },
  { day: '4' },
  { day: '5' },
  { day: '6' },
  { day: '7' },
  { day: '8' },
  { day: '9' },
  { day: '10' },
  { day: '11' },
  { day: '12' },
  { day: '13', today: true },
  { day: '14' },
  { day: '15' },
  { day: '16', warning: true },
  { day: '17' },
  { day: '18', exam: true },
];

export function TodayPage() {
  const [completedTaskIds, setCompletedTaskIds] = useState<number[]>([]);

  function toggleTask(taskIndex: number) {
    setCompletedTaskIds((current) =>
      current.includes(taskIndex) ? current.filter((index) => index !== taskIndex) : [...current, taskIndex],
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 md:px-8 xl:px-0">
      <section className="mb-6">
        <h1 className="text-[32px] font-semibold leading-tight text-[#191b23]">오늘의 학습</h1>
        <p className="mt-2 text-base leading-6 text-[#434655]">
          시험일까지 남은 시간을 바탕으로 오늘 해야 할 공부를 정리했어요.
        </p>
      </section>

      <div className="hide-scrollbar mb-6 flex items-center gap-2 overflow-x-auto pb-4">
        {DATE_CHIPS.map((chip, index) => (
          <button
            key={chip}
            type="button"
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
              index === 0
                ? 'bg-[#004ac6] text-white shadow-sm'
                : 'border border-[#c3c6d7] bg-white text-[#434655] hover:bg-[#ededf9]'
            }`}
          >
            {chip}
          </button>
        ))}
      </div>

      <section className="relative mb-6 overflow-hidden rounded-2xl border border-[#e1e2ed] bg-white p-6 shadow-[0_4px_12px_rgba(0,0,0,0.03)]">
        <div className="absolute bottom-0 left-0 top-0 w-1 bg-[#004ac6]" />

        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-[#dbe1ff] px-2.5 py-1 text-xs font-semibold text-[#00174b]">
                D-5
              </span>
              <span className="text-sm leading-5 text-[#434655]">2026년 7월 18일</span>
            </div>
            <h2 className="text-2xl font-semibold leading-tight text-[#191b23]">운영체제</h2>
          </div>

          <div className="rounded-xl bg-[#ededf9] p-3">
            <span className="material-symbols-outlined text-3xl text-[#004ac6]">developer_board</span>
          </div>
        </div>

        <div className="space-y-4">
          {TODAY_TASKS.map((task, index) => {
            const isCompleted = completedTaskIds.includes(index);

            return (
              <button
                key={task.title}
                type="button"
                onClick={() => toggleTask(index)}
                aria-pressed={isCompleted}
                className="group relative flex w-full items-start gap-4 overflow-hidden rounded-xl border border-transparent bg-[#f3f3fe] p-4 text-left transition hover:border-[#e1e2ed] hover:bg-white"
              >
                <div className="absolute bottom-0 left-0 top-0 w-1" style={{ backgroundColor: task.accent }} />
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 border-[#c3c6d7] transition group-hover:border-[#004ac6]">
                  {isCompleted ? (
                    <span className="material-symbols-outlined text-[16px] text-[#004ac6]">check</span>
                  ) : null}
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={`mb-1 block text-sm font-medium leading-5 transition group-hover:text-[#004ac6] ${
                      isCompleted ? 'text-[#00687a] line-through' : 'text-[#191b23]'
                    }`}
                  >
                    {task.title}
                  </span>
                  <span className="mb-2 block text-sm leading-5 text-[#434655]">{task.description}</span>
                  <span className="flex items-center gap-1 text-xs font-semibold text-[#434655]">
                    <span className="material-symbols-outlined text-[16px]">schedule</span>
                    {task.duration}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#004ac6] py-4 text-sm font-medium text-white shadow-sm transition hover:bg-[#003ea8]"
        >
          <span className="material-symbols-outlined">play_circle</span>
          오늘 공부 시작하기
        </button>
      </section>
    </div>
  );
}

export function TodayUpcomingPanel() {
  return (
    <aside className="hidden h-screen w-[320px] overflow-y-auto border-l border-[#c3c6d7] bg-white px-6 py-8 xl:fixed xl:right-0 xl:top-0 xl:block">
      <h3 className="mb-4 text-xl font-semibold leading-tight text-[#191b23]">Upcoming</h3>

      <section className="relative mb-6 overflow-hidden rounded-xl border border-[#e1e2ed] bg-[#f3f3fe] p-4">
        <div className="absolute right-0 top-0 p-3 opacity-10">
          <span className="material-symbols-outlined text-6xl">event_upcoming</span>
        </div>
        <p className="mb-1 text-xs font-semibold text-[#004ac6]">다음 시험</p>
        <h4 className="mb-2 text-2xl font-semibold leading-tight text-[#191b23]">운영체제 중간고사</h4>
        <span className="inline-block rounded-full bg-[#f59e0b] px-3 py-1 text-sm font-medium text-white shadow-sm">
          D-2
        </span>
      </section>

      <section className="rounded-xl border border-[#e1e2ed] bg-white p-4">
        <div className="mb-4 flex items-center justify-between">
          <button type="button" className="text-[#434655] transition hover:text-[#004ac6]" aria-label="이전 달">
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <span className="text-sm font-medium text-[#191b23]">2026년 7월</span>
          <button type="button" className="text-[#434655] transition hover:text-[#004ac6]" aria-label="다음 달">
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>

        <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs font-semibold text-[#434655]">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
            <div key={`${day}-${index}`}>{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-sm leading-7 text-[#191b23]">
          {CALENDAR_DAYS.map((day, index) => (
            <div
              key={`${day.day}-${index}`}
              className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full ${
                day.today
                  ? 'bg-[#004ac6] text-white'
                  : day.warning
                    ? 'font-bold text-[#f59e0b]'
                    : day.exam
                      ? 'font-bold text-[#004ac6]'
                      : day.muted
                        ? 'text-[#9ca3af]'
                        : ''
              }`}
            >
              {day.day}
            </div>
          ))}
        </div>
      </section>

      <div className="relative mt-8 h-32 overflow-hidden rounded-xl border border-[#e1e2ed] bg-[#f3f3fe] shadow-sm">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_30%,rgba(0,74,198,0.22),transparent_28%),radial-gradient(circle_at_74%_48%,rgba(87,223,254,0.34),transparent_24%),linear-gradient(135deg,#ffffff_0%,#ededf9_100%)]" />
        <div className="absolute left-7 top-7 h-12 w-12 rounded-2xl border border-white/70 bg-white/80 shadow-sm" />
        <div className="absolute bottom-6 right-8 h-16 w-16 rounded-full border border-white/70 bg-white/60 shadow-sm" />
        <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent" />
      </div>
    </aside>
  );
}
