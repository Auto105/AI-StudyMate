'use client';

import { STORAGE_KEYS } from '@/lib/storage/keys';
import type { StudyMaterial } from '@/types/study';
import { useLocalStorage } from './useLocalStorage';

const initialMaterial: StudyMaterial = {
  text: '',
  preview: '',
};

export function useStudyMaterials() {
  const [material, setMaterial, isReady] = useLocalStorage<StudyMaterial>(
    STORAGE_KEYS.studyMaterials,
    initialMaterial,
  );

  return { material, setMaterial, isReady };
}
