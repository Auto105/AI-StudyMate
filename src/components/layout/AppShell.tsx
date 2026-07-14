'use client';

import { useEffect } from 'react';
import { useState } from 'react';
import { MaterialsPage } from '@/components/materials/MaterialsPage';
import { QuestionsPage } from '@/components/questions/QuestionsPage';
import { QuizPage } from '@/components/quiz/QuizPage';
import { TodayPage, TodayUpcomingPanel } from '@/components/today/TodayPage';
import { StudyDataProvider } from '@/hooks/useStudyData';
import type { StudyTabId } from '@/types/study';
import { AppNavigation, MobileNavigation } from './AppNavigation';

export const NAVIGATE_TAB_EVENT = 'ai-studymate-navigate-tab';

export function AppShell() {
  const [activeTab, setActiveTab] = useState<StudyTabId>('today');
  const [showUnavailableToast, setShowUnavailableToast] = useState(false);
  const isToday = activeTab === 'today';
  const isMaterials = activeTab === 'materials';
  const hasRightPanel = isToday || isMaterials;

  useEffect(() => {
    if (!showUnavailableToast) {
      return;
    }

    const timeoutId = window.setTimeout(() => setShowUnavailableToast(false), 1800);

    return () => window.clearTimeout(timeoutId);
  }, [showUnavailableToast]);

  useEffect(() => {
    function handleNavigateTab(event: Event) {
      const customEvent = event as CustomEvent<{ tab: StudyTabId }>;

      if (!customEvent.detail?.tab) {
        return;
      }

      setActiveTab(customEvent.detail.tab);
    }

    window.addEventListener(NAVIGATE_TAB_EVENT, handleNavigateTab);

    return () => {
      window.removeEventListener(NAVIGATE_TAB_EVENT, handleNavigateTab);
    };
  }, []);

  function showUnavailableMessage() {
    setShowUnavailableToast(true);
  }

  return (
    <StudyDataProvider>
      <div className="min-h-screen bg-[#f3f4f6] text-[#191b23]">
        <AppNavigation activeTab={activeTab} onChange={setActiveTab} onUnavailableAction={showUnavailableMessage} />

        <div className={`min-h-screen xl:ml-[260px] ${hasRightPanel ? 'xl:mr-[320px]' : ''}`}>
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
                onClick={showUnavailableMessage}
                className="rounded-full p-2 text-[#434655] transition hover:bg-[#ededf9] hover:text-[#004ac6]"
                aria-label="알림"
              >
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <button
                type="button"
                onClick={showUnavailableMessage}
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
        {showUnavailableToast ? (
          <div
            role="status"
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#191b23] px-5 py-3 text-sm font-medium text-white shadow-lg"
          >
            준비 중입니다.
          </div>
        ) : null}
      </div>
    </StudyDataProvider>
  );
}
