
export interface StudyMaterial {
  id: string;
  name: string;
  type: 'PDF' | 'DOC' | 'PPT' | 'TXT';
  uploadDate: string;
  content?: string; // For AI processing, plain text representation
}

export interface QuizQuestionAIGenerated {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface QuizQuestion extends QuizQuestionAIGenerated {
  id: string;
  category?: string; // Optional: if we want to tag questions by category after generation
  difficulty?: 'easy' | 'medium' | 'hard'; // Optional
}

export interface GeneratedQuiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
  sourceMaterialName?: string; 
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  numQuestions: number;
}

export interface UserPerformanceMetrics {
  readinessScore: number; // 0-100
  masteryLevels: Array<{
    topic: string;
    level: number; // 0-100
  }>;
  performanceTrends: Array<{
    date: string; // Consider using Date object or ISO string
    score: number; // Average score or specific quiz score
    subject?: string; // Optional: subject of the trend data point
  }>;
}

// This is what the AI flow returns
export interface AIStudyRecommendations {
  studyRecommendations: string; 
}
