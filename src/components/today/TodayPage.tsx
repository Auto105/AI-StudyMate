'use client';

import { useEffect, useMemo, useState } from 'react';
import { useStudyData } from '@/hooks/useStudyData';
import { useStudyMaterials } from '@/hooks/useStudyMaterials';
import { useStudyProfile } from '@/hooks/useStudyProfile';
import { createStudyPlan } from '@/lib/api/client';
import { calculateDday, formatDday } from '@/lib/date';
import { createPlanInput } from '@/lib/plan';
import type { PlanResponse } from '@/types/api';

const TASK_ACCENTS = ['#06b6d4', '#004ac6', '#7c3aed'];

function formatKoreanDate(isoDate: string) {
  const date = new Date(`${isoDate}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }

  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

function formatDayChipLabel(remainingDays: number | null, index: number, fallback: string) {
  if (remainingDays === null) {
    return index === 0 ? `${fallback} 오늘` : fallback;
  }

  if (remainingDays === 0) {
    return index === 0 ? 'D-Day 오늘' : 'D-Day';
  }

  const label = `D-${remainingDays}`;
  return index === 0 ? `${label} 오늘` : label;
}

function buildDateChips(plan: PlanResponse | null, examDate: string) {
  const dday = calculateDday(examDate);

  if (!plan || plan.days.length === 0) {
    return [{ label: formatDayChipLabel(dday, 0, formatDday(examDate)), key: 'today' }];
  }

  return plan.days.map((day, index) => ({
    label: formatDayChipLabel(dday !== null ? Math.max(dday - index, 0) : null, index, day.label),
    key: `${day.date}-${index}`,
  }));
}

export function TodayPage() {
  const { profile, setProfile, isReady: isProfileReady } = useStudyProfile();
  const { material } = useStudyMaterials();
  const { getPlan, savePlan } = useStudyData();
  const [isLoadingPlan, setIsLoadingPlan] = useState(false);
  const [planError, setPlanError] = useState<string | null>(null);
  const planInput = useMemo(
    () => createPlanInput(profile.subject, profile.examDate, material.summary),
    [material.summary, profile.examDate, profile.subject],
  );
  const plan = getPlan(planInput);

  useEffect(() => {
    if (!isProfileReady || !profile.examDate.trim() || plan) {
      return;
    }

    let isCurrent = true;

    async function loadPlan() {
      setIsLoadingPlan(true);
      setPlanError(null);

      try {
        const result = await createStudyPlan(planInput);

        if (isCurrent) {
          savePlan(planInput, result);
        }
      } catch (error) {
        if (isCurrent) {
          setPlanError(error instanceof Error ? error.message : '학습 계획을 불러오지 못했습니다.');
        }
      } finally {
        if (isCurrent) {
          setIsLoadingPlan(false);
        }
      }
    }

    void loadPlan();

    return () => {
      isCurrent = false;
    };
  }, [isProfileReady, plan, planInput, savePlan]);

  const dateChips = buildDateChips(plan, profile.examDate);
  const todayTasks = plan?.today ?? [];

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 md:px-8 xl:px-0">
      <section className="mb-6">
        <h1 className="text-[32px] font-semibold leading-tight text-[#191b23]">오늘의 학습</h1>
        <p className="mt-2 text-base leading-6 text-[#434655]">
          시험일까지 남은 시간을 바탕으로 오늘 해야 할 공부를 정리했어요.
        </p>
      </section>

      <section className="mb-6 grid gap-4 rounded-2xl border border-[#e1e2ed] bg-white p-4 shadow-sm md:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-[#434655]">과목</span>
          <input
            type="text"
            value={profile.subject}
            onChange={(event) => setProfile({ ...profile, subject: event.target.value })}
            className="rounded-xl border border-[#c3c6d7] px-4 py-3 text-sm outline-none transition focus:border-[#004ac6] focus:ring-4 focus:ring-[#004ac6]/10"
            placeholder="운영체제"
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-[#434655]">시험일</span>
          <input
            type="date"
            value={profile.examDate}
            onChange={(event) => setProfile({ ...profile, examDate: event.target.value })}
            className="rounded-xl border border-[#c3c6d7] px-4 py-3 text-sm outline-none transition focus:border-[#004ac6] focus:ring-4 focus:ring-[#004ac6]/10"
          />
        </label>
      </section>

      <div className="hide-scrollbar mb-6 flex items-center gap-2 overflow-x-auto pb-4">
        {dateChips.map((chip, index) => (
          <button
            key={chip.key}
            type="button"
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
              index === 0
                ? 'bg-[#004ac6] text-white shadow-sm'
                : 'border border-[#c3c6d7] bg-white text-[#434655] hover:bg-[#ededf9]'
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      <section className="relative mb-6 overflow-hidden rounded-2xl border border-[#e1e2ed] bg-white p-6 shadow-[0_4px_12px_rgba(0,0,0,0.03)]">
        <div className="absolute bottom-0 left-0 top-0 w-1 bg-[#004ac6]" />

        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-[#dbe1ff] px-2.5 py-1 text-xs font-semibold text-[#00174b]">
                {formatDday(profile.examDate)}
              </span>
              <span className="text-sm leading-5 text-[#434655]">{formatKoreanDate(profile.examDate)}</span>
            </div>
            <h2 className="text-2xl font-semibold leading-tight text-[#191b23]">
              {profile.subject.trim() || '과목을 입력하세요'}
            </h2>
          </div>

          <div className="rounded-xl bg-[#ededf9] p-3">
            <span className="material-symbols-outlined text-3xl text-[#004ac6]">developer_board</span>
          </div>
        </div>

        <div className="space-y-4">
          {isLoadingPlan ? (
            <p className="rounded-xl bg-[#f3f3fe] px-4 py-6 text-sm text-[#434655]">오늘 할 일을 생성하는 중...</p>
          ) : null}

          {!isLoadingPlan && planError ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {planError}
            </p>
          ) : null}

          {!isLoadingPlan && !planError && todayTasks.length === 0 ? (
            <p className="rounded-xl bg-[#f3f3fe] px-4 py-6 text-sm text-[#434655]">
              시험일을 설정하면 오늘 할 일이 표시됩니다.
            </p>
          ) : null}

          {!isLoadingPlan && !planError
            ? todayTasks.map((task, index) => (
                <article
                  key={task.id}
                  className="group relative overflow-hidden rounded-xl border border-transparent bg-[#f3f3fe] p-4 text-left transition hover:border-[#e1e2ed] hover:bg-white"
                >
                  <div
                    className="absolute bottom-0 left-0 top-0 w-1"
                    style={{ backgroundColor: TASK_ACCENTS[index % TASK_ACCENTS.length] }}
                  />
                  <p className="text-sm font-medium leading-5 text-[#191b23] transition group-hover:text-[#004ac6]">
                    {task.title}
                  </p>
                  {task.description ? (
                    <p className="mt-1 text-sm leading-5 text-[#434655]">{task.description}</p>
                  ) : null}
                </article>
              ))
            : null}
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

function buildCalendarDays(examDate: string) {
  const exam = new Date(`${examDate}T00:00:00`);

  if (Number.isNaN(exam.getTime())) {
    return [];
  }

  const year = exam.getFullYear();
  const month = exam.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const todayIso = new Date().toISOString().slice(0, 10);
  const days: Array<{ day: string; muted?: boolean; today?: boolean; exam?: boolean }> = [];

  for (let index = 0; index < firstDay.getDay(); index += 1) {
    const date = new Date(year, month, index - firstDay.getDay() + 1);
    days.push({ day: `${date.getDate()}`, muted: true });
  }

  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    const iso = `${year}-${`${month + 1}`.padStart(2, '0')}-${`${day}`.padStart(2, '0')}`;
    days.push({
      day: `${day}`,
      today: iso === todayIso,
      exam: iso === examDate,
    });
  }

  return days;
}

export function TodayUpcomingPanel() {
  const { profile } = useStudyProfile();
  const exam = new Date(`${profile.examDate}T00:00:00`);
  const monthLabel = Number.isNaN(exam.getTime())
    ? '시험일 미설정'
    : `${exam.getFullYear()}년 ${exam.getMonth() + 1}월`;
  const calendarDays = buildCalendarDays(profile.examDate);

  return (
    <aside className="hidden h-screen w-[320px] overflow-y-auto border-l border-[#c3c6d7] bg-white px-6 py-8 xl:fixed xl:right-0 xl:top-0 xl:block">
      <h3 className="mb-4 text-xl font-semibold leading-tight text-[#191b23]">Upcoming</h3>

      <section className="relative mb-6 overflow-hidden rounded-xl border border-[#e1e2ed] bg-[#f3f3fe] p-4">
        <div className="absolute right-0 top-0 p-3 opacity-10">
          <span className="material-symbols-outlined text-6xl">event_upcoming</span>
        </div>
        <p className="mb-1 text-xs font-semibold text-[#004ac6]">다음 시험</p>
        <h4 className="mb-2 text-2xl font-semibold leading-tight text-[#191b23]">{profile.subject}</h4>
        <span className="inline-block rounded-full bg-[#f59e0b] px-3 py-1 text-sm font-medium text-white shadow-sm">
          {formatDday(profile.examDate)}
        </span>
      </section>

      <section className="rounded-xl border border-[#e1e2ed] bg-white p-4">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-medium text-[#191b23]">{monthLabel}</span>
        </div>

        <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs font-semibold text-[#434655]">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
            <div key={`${day}-${index}`}>{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-sm leading-7 text-[#191b23]">
          {calendarDays.map((day, index) => (
            <div
              key={`${day.day}-${index}`}
              className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full ${
                day.today
                  ? 'bg-[#004ac6] text-white'
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
    </aside>
  );
}
