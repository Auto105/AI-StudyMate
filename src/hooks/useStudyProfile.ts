'use client';

import { DEMO_STUDY_PROFILE } from '@/constants/demo';
import { STORAGE_KEYS } from '@/lib/storage/keys';
import type { StudyProfile } from '@/types/study';
import { useLocalStorage } from './useLocalStorage';

export function useStudyProfile() {
  const [profile, setProfile, isReady] = useLocalStorage<StudyProfile>(
    STORAGE_KEYS.studyProfile,
    DEMO_STUDY_PROFILE,
  );

  return { profile, setProfile, isReady };
}
