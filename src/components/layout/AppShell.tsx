'use client';

import { useState } from 'react';
import { MaterialsPage } from '@/components/materials/MaterialsPage';
import { QuestionsPage } from '@/components/questions/QuestionsPage';
import { QuizPage } from '@/components/quiz/QuizPage';
import { TodayPage } from '@/components/today/TodayPage';
import type { StudyTabId } from '@/types/study';
import { AppNavigation } from './AppNavigation';

export function AppShell() {
  const [activeTab, setActiveTab] = useState<StudyTabId>('today');

  return (
    <main className="min-h-screen px-4 py-6 md:px-6 md:py-10">
      <div className="mx-auto grid w-full max-w-6xl gap-5">
        <AppNavigation activeTab={activeTab} onChange={setActiveTab} />
        {activeTab === 'today' ? <TodayPage /> : null}
        {activeTab === 'materials' ? <MaterialsPage /> : null}
        {activeTab === 'questions' ? <QuestionsPage /> : null}
        {activeTab === 'quiz' ? <QuizPage /> : null}
      </div>
    </main>
  );
}
