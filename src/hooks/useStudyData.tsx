'use client';

import { createContext, useCallback, useContext, useMemo } from 'react';
import { DEMO_STUDY_PROFILE } from '@/constants/demo';
import { getPlanInputHash, getStudyTextHash } from '@/lib/study-cache';
import { STORAGE_KEYS } from '@/lib/storage/keys';
import type {
  ChatMessage,
  PlanInput,
  StudyData,
  StudyMaterial,
  StudyPlanResult,
  StudyProfile,
  StudyQuiz,
  StudySummary,
} from '@/types/study';
import { useLocalStorage } from './useLocalStorage';

interface StudyDataContextValue {
  data: StudyData;
  isReady: boolean;
  setProfile: (profile: StudyProfile) => void;
  setMaterial: (material: StudyMaterial) => void;
  getPlan: (input: PlanInput) => StudyPlanResult | null;
  savePlan: (input: PlanInput, plan: StudyPlanResult) => void;
  appendChatMessages: (...messages: ChatMessage[]) => void;
  getQuiz: (text: string) => { result: StudyQuiz; selectedChoice: string } | null;
  saveQuiz: (text: string, quiz: StudyQuiz) => void;
  setSelectedQuizChoice: (text: string, choice: string) => void;
}

const INITIAL_STUDY_DATA: StudyData = {
  profile: { ...DEMO_STUDY_PROFILE },
  extractedText: '',
  preview: '',
  summary: null,
  chatHistory: [],
  plan: null,
  quiz: null,
};

const StudyDataContext = createContext<StudyDataContextValue | null>(null);

export function StudyDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData, isReady] = useLocalStorage<StudyData>(STORAGE_KEYS.studyData, INITIAL_STUDY_DATA, {
    getInitialValue: getLegacyStudyData,
  });

  const updateData = useCallback(
    (updater: (current: StudyData) => StudyData) => {
      setData((current) => updater(current));
    },
    [setData],
  );

  const setProfile = useCallback(
    (profile: StudyProfile) => {
      updateData((current) => ({
        ...current,
        profile,
        plan:
          current.profile.subject === profile.subject && current.profile.examDate === profile.examDate
            ? current.plan
            : null,
      }));
    },
    [updateData],
  );

  const setMaterial = useCallback(
    (material: StudyMaterial) => {
      updateData((current) => {
        const textChanged = current.extractedText !== material.text;
        const currentSummary = getCurrentSummary(current);

        if (textChanged) {
          return {
            ...current,
            extractedText: material.text,
            preview: material.preview,
            summary: null,
            chatHistory: [],
            plan: null,
            quiz: null,
          };
        }

        return {
          ...current,
          preview: material.preview,
          summary:
            material.summary === currentSummary
              ? current.summary
              : material.summary
                ? {
                    textHash: getStudyTextHash(material.text),
                    result: material.summary,
                    updatedAt: new Date().toISOString(),
                  }
                : null,
        };
      });
    },
    [updateData],
  );

  const getPlan = useCallback(
    (input: PlanInput) => {
      if (!data.plan || data.plan.inputHash !== getPlanInputHash(input)) {
        return null;
      }

      return data.plan.result;
    },
    [data.plan],
  );

  const savePlan = useCallback(
    (input: PlanInput, plan: StudyPlanResult) => {
      updateData((current) => ({
        ...current,
        plan: {
          inputHash: getPlanInputHash(input),
          input,
          result: plan,
          updatedAt: new Date().toISOString(),
        },
      }));
    },
    [updateData],
  );

  const appendChatMessages = useCallback(
    (...messages: ChatMessage[]) => {
      updateData((current) => ({
        ...current,
        chatHistory: [...current.chatHistory, ...messages],
      }));
    },
    [updateData],
  );

  const getQuiz = useCallback(
    (text: string) => {
      if (!data.quiz || data.quiz.textHash !== getStudyTextHash(text)) {
        return null;
      }

      return { result: data.quiz.result, selectedChoice: data.quiz.selectedChoice };
    },
    [data.quiz],
  );

  const saveQuiz = useCallback(
    (text: string, quiz: StudyQuiz) => {
      updateData((current) => ({
        ...current,
        quiz: {
          textHash: getStudyTextHash(text),
          result: quiz,
          selectedChoice: '',
          updatedAt: new Date().toISOString(),
        },
      }));
    },
    [updateData],
  );

  const setSelectedQuizChoice = useCallback(
    (text: string, choice: string) => {
      updateData((current) => {
        if (!current.quiz || current.quiz.textHash !== getStudyTextHash(text)) {
          return current;
        }

        return {
          ...current,
          quiz: {
            ...current.quiz,
            selectedChoice: choice,
          },
        };
      });
    },
    [updateData],
  );

  const value = useMemo(
    () => ({
      data,
      isReady,
      setProfile,
      setMaterial,
      getPlan,
      savePlan,
      appendChatMessages,
      getQuiz,
      saveQuiz,
      setSelectedQuizChoice,
    }),
    [
      appendChatMessages,
      data,
      getPlan,
      getQuiz,
      isReady,
      savePlan,
      saveQuiz,
      setMaterial,
      setProfile,
      setSelectedQuizChoice,
    ],
  );

  return <StudyDataContext.Provider value={value}>{children}</StudyDataContext.Provider>;
}

export function useStudyData() {
  const context = useContext(StudyDataContext);

  if (!context) {
    throw new Error('StudyDataProvider must wrap study pages.');
  }

  return context;
}

function getCurrentSummary(data: StudyData) {
  if (!data.summary || data.summary.textHash !== getStudyTextHash(data.extractedText)) {
    return undefined;
  }

  return data.summary.result;
}

function getLegacyStudyData(): StudyData {
  const legacyProfile = readStoredValue<StudyProfile>(STORAGE_KEYS.studyProfile);
  const legacyMaterial = readStoredValue<StudyMaterial>(STORAGE_KEYS.studyMaterials);
  const extractedText = legacyMaterial?.text ?? '';
  const summary = legacyMaterial?.summary;

  return {
    ...INITIAL_STUDY_DATA,
    profile: isStudyProfile(legacyProfile) ? legacyProfile : INITIAL_STUDY_DATA.profile,
    extractedText,
    preview: legacyMaterial?.preview ?? '',
    summary: isStudySummary(summary)
      ? {
          textHash: getStudyTextHash(extractedText),
          result: summary,
          updatedAt: new Date().toISOString(),
        }
      : null,
  };
}

function readStoredValue<T>(key: string): T | null {
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : null;
  } catch {
    return null;
  }
}

function isStudyProfile(value: StudyProfile | null): value is StudyProfile {
  return Boolean(value && typeof value.subject === 'string' && typeof value.examDate === 'string');
}

function isStudySummary(value: StudySummary | undefined): value is StudySummary {
  return Boolean(
    value &&
      Array.isArray(value.keywords) &&
      value.keywords.every((keyword) => typeof keyword === 'string') &&
      Array.isArray(value.concepts) &&
      value.concepts.every((concept) => typeof concept === 'string') &&
      typeof value.easyExplain === 'string',
  );
}
