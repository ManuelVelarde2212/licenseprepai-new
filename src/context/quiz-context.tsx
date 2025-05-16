"use client";

import type { GeneratedQuiz } from '@/types';
import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

interface QuizContextType {
  currentQuiz: GeneratedQuiz | null;
  setCurrentQuiz: Dispatch<SetStateAction<GeneratedQuiz | null>>;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [currentQuiz, setCurrentQuiz] = useState<GeneratedQuiz | null>(null);
  
  return (
    <QuizContext.Provider value={{ currentQuiz, setCurrentQuiz }}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}
