export interface VocabularyItem {
  word: string;
  pinyin: string;
  meaning: string;
  exampleSentence: string;
  note: string;
}

export const LESSON_DIFFICULTIES = ['beginner', 'elementary', 'intermediate'] as const;

export type LessonDifficulty = (typeof LESSON_DIFFICULTIES)[number];

export interface GrammarItem {
  grammar: string;
  explanation: string;
  exampleSentence: string;
}

export interface TestQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface Lesson {
  id: string;
  title: string;
  category: string;
  difficulty: LessonDifficulty;
  summary: string;
  vocabulary: VocabularyItem[];
  grammar: GrammarItem[];
  dialogue: string;
  tests: TestQuestion[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export type LessonPayload = Omit<Lesson, 'id' | 'createdAt' | 'updatedAt'>;
