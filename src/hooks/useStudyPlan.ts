'use client';

import { STORAGE_KEYS } from '@/lib/storage/keys';
import type { TodayPlan } from '@/types/study';
import { useLocalStorage } from './useLocalStorage';

export function useStudyPlan() {
  const [plan, setPlan, isReady] = useLocalStorage<TodayPlan | null>(
    STORAGE_KEYS.todayPlan,
    null,
  );

  return { plan, setPlan, isReady };
}
