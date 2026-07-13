'use client';

import { Card } from '@/components/common/Card';
import { SectionHeading } from '@/components/common/SectionHeading';
import { getDemoTodayTasks } from '@/constants/demo';
import { useStudyProfile } from '@/hooks/useStudyProfile';
import { getDDay } from '@/lib/utils/date';

export function TodayPage() {
  const { profile, setProfile } = useStudyProfile();
  const dDay = getDDay(profile.examDate);
  const todayTasks = getDemoTodayTasks(profile.examDate);

  return (
    <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
      <Card>
        <SectionHeading
          eyebrow="Today"
          title="오늘의 학습 제안"
          description="시험일까지 남은 시간을 기준으로 지금 바로 시작할 작업만 보여줍니다."
        />

        <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
          <label className="grid gap-2">
            <span className="text-sm font-bold text-slate-700">과목명</span>
            <input
              value={profile.subject}
              onChange={(event) => setProfile({ ...profile, subject: event.target.value })}
              className="rounded-2xl border border-slate-900/15 bg-white px-4 py-3 outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-700/10"
            />
          </label>
          <span className="inline-flex h-12 items-center justify-center rounded-full bg-teal-700 px-5 text-base font-bold text-white">
            {dDay}
          </span>
        </div>

        <label className="mt-4 grid gap-2">
          <span className="text-sm font-bold text-slate-700">시험일</span>
          <input
            type="date"
            value={profile.examDate}
            onChange={(event) => setProfile({ ...profile, examDate: event.target.value })}
            className="rounded-2xl border border-slate-900/15 bg-white px-4 py-3 outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-700/10"
          />
        </label>

        <button
          type="button"
          className="mt-6 w-full rounded-full bg-gradient-to-r from-teal-700 to-teal-500 px-5 py-4 font-bold text-white shadow-lg shadow-teal-900/20 sm:w-auto"
        >
          오늘 공부 시작하기
        </button>
      </Card>

      <Card>
        <SectionHeading title="오늘 할 일" description="실제 행동 단위의 학습 작업만 표시합니다." />
        <ol className="grid gap-3">
          {todayTasks.map((task, index) => (
            <li
              key={task.id}
              className="flex gap-3 rounded-2xl border border-teal-700/10 bg-teal-50/60 p-4"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-teal-700">
                {index + 1}
              </span>
              <span className="font-semibold text-slate-800">{task.title}</span>
            </li>
          ))}
        </ol>
      </Card>
    </div>
  );
}
