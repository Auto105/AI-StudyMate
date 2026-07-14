'use client';

import { useStudyData } from './useStudyData';

export function useStudyProfile() {
  const { data, isReady, setProfile } = useStudyData();

  return { profile: data.profile, setProfile, isReady };
}
