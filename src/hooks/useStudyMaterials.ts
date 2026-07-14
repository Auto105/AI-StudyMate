'use client';

import { getStudyTextHash } from '@/lib/study-cache';
import { useStudyData } from './useStudyData';

export function useStudyMaterials() {
  const { data, isReady, setMaterial } = useStudyData();
  const summary =
    data.summary?.textHash === getStudyTextHash(data.extractedText) ? data.summary.result : undefined;

  return {
    material: {
      text: data.extractedText,
      preview: data.preview,
      summary,
    },
    setMaterial,
    isReady,
  };
}
