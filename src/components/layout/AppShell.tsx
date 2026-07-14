'use client';

import { useState } from 'react';
import { MaterialsPage } from '@/components/materials/MaterialsPage';
import { QuestionsPage } from '@/components/questions/QuestionsPage';
import { QuizPage } from '@/components/quiz/QuizPage';
import { TodayPage, TodayUpcomingPanel } from '@/components/today/TodayPage';
import { StudyDataProvider } from '@/hooks/useStudyData';
import type { StudyTabId } from '@/types/study';
import { AppNavigation, MobileNavigation } from './AppNavigation';

export function AppShell() {
  const [activeTab, setActiveTab] = useState<StudyTabId>('today');
  const isToday = activeTab === 'today';
  const isMaterials = activeTab === 'materials';

  return (
    <StudyDataProvider>
      <div className="min-h-screen bg-[#f3f4f6] text-[#191b23]">
        <AppNavigation activeTab={activeTab} onChange={setActiveTab} />

        <div className={`min-h-screen xl:ml-[260px] ${isToday ? 'xl:mr-[320px]' : ''}`}>
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between bg-[#faf8ff]/80 px-4 backdrop-blur-md md:px-8">
          <div className="flex items-center gap-4 xl:hidden">
            <span className="material-symbols-outlined text-[#004ac6]">menu</span>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#004ac6] text-white">
                <span className="material-symbols-outlined text-[20px]">school</span>
              </span>
              <span className="text-sm font-semibold text-[#191b23]">AI-StudyMate</span>
            </div>
          </div>

          <div className="hidden xl:block" />

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-full p-2 text-[#434655] transition hover:bg-[#ededf9] hover:text-[#004ac6]"
              aria-label="알림"
            >
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button
              type="button"
              className="rounded-full p-2 text-[#434655] transition hover:bg-[#ededf9] hover:text-[#004ac6]"
              aria-label="계정"
            >
              <span className="material-symbols-outlined">account_circle</span>
            </button>
          </div>
          </header>

          <MobileNavigation activeTab={activeTab} onChange={setActiveTab} />

          <main className={isToday || isMaterials ? '' : 'mx-auto w-full max-w-5xl px-4 py-6 md:px-8'}>
            {activeTab === 'today' ? <TodayPage /> : null}
            {activeTab === 'materials' ? <MaterialsPage /> : null}
            {activeTab === 'questions' ? <QuestionsPage /> : null}
            {activeTab === 'quiz' ? <QuizPage /> : null}
          </main>
        </div>

        {isToday ? <TodayUpcomingPanel /> : null}
      </div>
    </StudyDataProvider>
  );
}
