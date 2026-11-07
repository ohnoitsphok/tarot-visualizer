import type { CardOrientation } from './tarot';

export const APP_TABS = Object.freeze([
  'library',
  'inspector',
  'study',
  'spreads',
] as const);
export type AppTab = (typeof APP_TABS)[number];

export const MASTERY_LEVELS = Object.freeze([
  'unseen',
  'review_needed',
  'mastered',
] as const);
export type MasteryLevel = (typeof MASTERY_LEVELS)[number];

export const QUIZ_QUESTION_TYPES = Object.freeze([
  'meaning_to_card',
  'card_to_meaning',
  'orientation_keyword',
  'symbol_to_card',
  'element_association',
] as const);
export type QuizQuestionType = (typeof QUIZ_QUESTION_TYPES)[number];

export const STUDY_MODES = Object.freeze([
  'dashboard',
  'flashcards',
  'quiz',
] as const);
export type StudyMode = (typeof STUDY_MODES)[number];

export const STUDY_STORAGE_KEY = 'tarot_visualizer_study_v1' as const;
export const STUDY_SCHEMA_VERSION = 1 as const;

export interface CardStudyRecord {
  readonly cardId: string;
  readonly mastery: MasteryLevel;
  readonly correctCount: number;
  readonly attemptCount: number;
  readonly lastReviewedAt: string | null;
}

export interface QuizQuestion {
  readonly id: string;
  readonly type: QuizQuestionType;
  readonly cardId: string;
  readonly orientation: CardOrientation;
  readonly prompt: string;
  readonly options: readonly string[];
  readonly correctIndex: number;
  readonly explanation: string;
}

export interface QuizSessionResult {
  readonly id: string;
  readonly completedAt: string;
  readonly score: number;
  readonly total: number;
  readonly questionTypes: readonly QuizQuestionType[];
}

export interface StudyProgressState {
  readonly schemaVersion: number;
  readonly bookmarks: readonly string[];
  readonly records: Readonly<Record<string, CardStudyRecord>>;
  readonly quizHistory: readonly QuizSessionResult[];
  readonly currentStreak: number;
  readonly lastStudyDate: string | null;
}

export const INITIAL_STUDY_PROGRESS: StudyProgressState = Object.freeze({
  schemaVersion: STUDY_SCHEMA_VERSION,
  bookmarks: Object.freeze([]),
  records: Object.freeze({}),
  quizHistory: Object.freeze([]),
  currentStreak: 0,
  lastStudyDate: null,
});
