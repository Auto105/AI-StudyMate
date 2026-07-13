'use client';

import { NAVIGATION_ITEMS } from '@/constants/navigation';
import type { StudyTabId } from '@/types/study';

interface AppNavigationProps {
  activeTab: StudyTabId;
  onChange: (tabId: StudyTabId) => void;
}

export function AppNavigation({ activeTab, onChange }: AppNavigationProps) {
  return (
    <nav className="grid grid-cols-2 gap-2 rounded-[24px] border border-slate-900/10 bg-white/80 p-2 shadow-[0_18px_40px_rgba(20,33,61,0.08)] backdrop-blur md:grid-cols-4">
      {NAVIGATION_ITEMS.map((item) => {
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={`rounded-[18px] px-4 py-3 text-left transition ${
              isActive
                ? 'bg-teal-700 text-white shadow-lg shadow-teal-900/15'
                : 'bg-transparent text-slate-600 hover:bg-teal-50 hover:text-teal-800'
            }`}
            aria-current={isActive ? 'page' : undefined}
          >
            <span className="block font-bold">{item.label}</span>
            <span className={`mt-1 block text-xs ${isActive ? 'text-teal-50' : 'text-slate-500'}`}>
              {item.description}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
