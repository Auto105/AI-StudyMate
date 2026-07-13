'use client';

import { useMemo } from 'react';
import { DEMO_STUDY_PROFILE } from '@/constants/demo';
import {
  createPlanCache,
  createSummaryCache,
  isPlanCacheHit,
  isSummaryCacheHit,
} from '@/lib/cache';
import { createPlanInput } from '@/lib/plan';
import { STORAGE_KEYS } from '@/lib/storage/keys';
import type {
  CachedPlan,
  CachedSummary,
  ChatMessage,
  PlanInput,
  QuizResult,
  StudyPlan,
  StudyProfile,
  SummaryResult,
} from '@/types/study';
import { useLocalStorage } from './useLocalStorage';

export function useStudyData() {
  const [profile, setProfile] = useLocalStorage<StudyProfile>(
    STORAGE_KEYS.studyProfile,
    DEMO_STUDY_PROFILE,
  );
  const [extractedText, setStoredExtractedText] = useLocalStorage(
    STORAGE_KEYS.studyExtractedText,
    '',
  );
  const [summaryCache, setSummaryCache] = useLocalStorage<CachedSummary | null>(
    STORAGE_KEYS.studySummary,
    null,
  );
  const [chatHistory, setChatHistory] = useLocalStorage<ChatMessage[]>(
    STORAGE_KEYS.studyChatHistory,
    [],
  );
  const [planCache, setPlanCache] = useLocalStorage<CachedPlan | null>(
    STORAGE_KEYS.studyPlan,
    null,
  );
  const [quiz, setQuiz] = useLocalStorage<QuizResult | null>(STORAGE_KEYS.studyQuiz, null);

  const summaryResult = useMemo(() => {
    if (!isSummaryCacheHit(extractedText, summaryCache)) {
      return null;
    }

    return summaryCache?.result ?? null;
  }, [extractedText, summaryCache]);

  const planInput = useMemo(
    () => createPlanInput(profile.subject, profile.examDate, summaryResult),
    [profile.examDate, profile.subject, summaryResult],
  );

  const planResult = useMemo(() => {
    if (!isPlanCacheHit(planInput, planCache)) {
      return null;
    }

    return planCache?.result ?? null;
  }, [planCache, planInput]);

  function setExtractedText(text: string) {
    setStoredExtractedText(text);
    setSummaryCache(null);
    setPlanCache(null);
    setQuiz(null);
  }

  function setSummary(result: SummaryResult) {
    setSummaryCache(createSummaryCache(extractedText, result));
  }

  function appendChatMessage(message: ChatMessage) {
    setChatHistory((current) => [...current, message]);
  }

  function setPlan(input: PlanInput, result: StudyPlan) {
    setPlanCache(createPlanCache(input, result));
  }

  function resetAiResults() {
    setSummaryCache(null);
    setPlanCache(null);
    setQuiz(null);
  }

  function clearAll() {
    setProfile(DEMO_STUDY_PROFILE);
    setStoredExtractedText('');
    setSummaryCache(null);
    setChatHistory([]);
    setPlanCache(null);
    setQuiz(null);
  }

  return {
    profile,
    setProfile,
    extractedText,
    setExtractedText,
    summaryResult,
    setSummary,
    isSummaryCacheHit: isSummaryCacheHit(extractedText, summaryCache),
    chatHistory,
    appendChatMessage,
    setChatHistory,
    planInput,
    planResult,
    setPlan,
    isPlanCacheHit: isPlanCacheHit(planInput, planCache),
    quiz,
    setQuiz,
    resetAiResults,
    clearAll,
  };
}
