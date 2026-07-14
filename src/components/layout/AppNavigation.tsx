'use client';

import type { StudyTabId } from '@/types/study';

interface AppNavigationProps {
  activeTab: StudyTabId;
  onChange: (tabId: StudyTabId) => void;
}

const NAVIGATION_ITEMS: Array<{
  id: StudyTabId;
  label: string;
  icon: string;
  badge?: string;
}> = [
  { id: 'today', label: 'Today', icon: 'calendar_today' },
  { id: 'materials', label: 'Materials', icon: 'description' },
  { id: 'questions', label: 'Questions', icon: 'quiz' },
  { id: 'quiz', label: 'Quiz', icon: 'extension', badge: 'Bonus' },
];

export function AppNavigation({ activeTab, onChange }: AppNavigationProps) {
  return (
    <nav className="hidden h-screen w-[260px] flex-col border-r border-[#c3c6d7] bg-white py-8 xl:fixed xl:left-0 xl:top-0 xl:z-40 xl:flex">
      <div className="mb-6 px-6">
        <div className="flex h-16 items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#004ac6] text-white">
              <span className="material-symbols-outlined">school</span>
            </div>
            <div>
              <p className="text-lg font-semibold leading-none text-[#191b23]">AI-StudyMate</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1 overflow-y-auto px-3">
        {NAVIGATION_ITEMS.map((item) => {
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={`group flex items-center gap-3 rounded-lg px-4 py-3 text-left transition ${
                isActive
                  ? 'scale-[0.98] rounded-l-none border-l-4 border-[#004ac6] bg-[#57dffe] text-[#006172]'
                  : 'text-[#434655] hover:bg-[#e7e7f3]'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <span
                className={`material-symbols-outlined transition ${
                  isActive ? "[font-variation-settings:'FILL'_1]" : 'group-hover:text-[#004ac6]'
                }`}
              >
                {item.icon}
              </span>
              <span className="flex flex-1 items-center justify-between gap-3">
                <span className="text-sm font-medium">{item.label}</span>
                {item.badge ? (
                  <span className="rounded-full bg-[#57dffe] px-2 py-0.5 text-[10px] font-semibold text-[#006172]">
                    {item.badge}
                  </span>
                ) : null}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-auto border-t border-[#e1e2ed] px-3 pt-4">
        {[
          ['settings', 'Settings'],
          ['help', 'Support'],
        ].map(([icon, label]) => (
          <button
            key={label}
            type="button"
            className="group flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-[#434655] transition hover:bg-[#e7e7f3]"
          >
            <span className="material-symbols-outlined">{icon}</span>
            <span className="text-sm font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

export function MobileNavigation({ activeTab, onChange }: AppNavigationProps) {
  return (
    <div className="hide-scrollbar flex gap-2 overflow-x-auto px-4 pb-3 xl:hidden">
      {NAVIGATION_ITEMS.map((item) => {
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
              isActive
                ? 'border-[#004ac6] bg-[#004ac6] text-white'
                : 'border-[#c3c6d7] bg-white text-[#434655] hover:bg-[#ededf9]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
