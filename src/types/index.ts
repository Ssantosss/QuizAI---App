// ===== TIPI PRINCIPALI DELL'APP =====

// Tipi per le domande e quiz
export interface Question {
  id: string;
  text: string;
  image?: string;
  options: QuestionOption[];
  correctAnswer: string;
  subject: Subject;
  difficulty: Difficulty;
  createdAt: Date;
  tags: string[];
}

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  subject: Subject;
  timeLimit?: number; // in minuti
  createdAt: Date;
  status: QuizStatus;
}

export interface AIResponse {
  suggestedAnswer: string;
  confidence: number;
  explanation: string;
  reasoning: string;
  sources: string[];
  processingTime: number;
}

// Tipi per le sessioni di esame
export interface ExamSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  questions: ExamQuestion[];
  currentQuestionIndex: number;
  score?: number;
  mode: ExamMode;
  status: SessionStatus;
}

export interface ExamQuestion {
  questionId: string;
  capturedImage?: string;
  extractedText?: string;
  aiResponse?: AIResponse;
  userAnswer?: string;
  timestamp: Date;
  processingDuration: number;
}

// Tipi per lo studio neuroscientifico
export interface StudySession {
  id: string;
  subject: Subject;
  startTime: Date;
  endTime?: Date;
  questionsStudied: StudyQuestion[];
  neuralnessScore: number;
  memoryRetention: number;
  adaptiveLevel: AdaptiveLevel;
}

export interface StudyQuestion {
  id: string;
  question: Question;
  userResponse: string;
  neuralFeedback: NeuralFeedback;
  memoryEncodingLevel: number;
  repetitionInterval: number;
  nextReviewDate: Date;
}

export interface NeuralFeedback {
  cognitiveProcess: CognitiveProcess[];
  memoryType: MemoryType;
  encodingStrength: number;
  explanation: string;
  improvementSuggestions: string[];
}

// Tipi per l'utente e profilo
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  university?: string;
  faculty?: string;
  yearOfStudy?: number;
  preferences: UserPreferences;
  statistics: UserStatistics;
  createdAt: Date;
}

export interface UserPreferences {
  theme: ThemeMode;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  study: StudyPreferences;
  ai: AIPreferences;
}

export interface UserStatistics {
  totalExams: number;
  averageScore: number;
  totalStudyTime: number;
  successRate: number;
  subjectStats: SubjectStatistics[];
  weeklyProgress: WeeklyProgress[];
  neuralGrowth: NeuralGrowthMetrics;
}

// Tipi per le impostazioni
export interface NotificationSettings {
  pushEnabled: boolean;
  emailEnabled: boolean;
  studyReminders: boolean;
  examAlerts: boolean;
  weeklyReports: boolean;
}

export interface PrivacySettings {
  dataSharing: boolean;
  anonymousUsage: boolean;
  biometricLock: boolean;
  autoLock: AutoLockDuration;
}

export interface StudyPreferences {
  adaptiveLearning: boolean;
  neuralFeedback: boolean;
  spacedRepetition: boolean;
  gamification: boolean;
  difficultySetting: Difficulty;
}

export interface AIPreferences {
  explanationLevel: ExplanationLevel;
  confidence: number;
  processingSpeed: ProcessingSpeed;
  neuralAnalysis: boolean;
}

// Enums
export enum Subject {
  ECONOMIA = 'economia',
  MARKETING = 'marketing',
  STATISTICA = 'statistica',
  FINANZA = 'finanza',
  DIRITTO = 'diritto',
  MATEMATICA = 'matematica',
  INFORMATICA = 'informatica',
  ALTRO = 'altro'
}

export enum Difficulty {
  FACILE = 'facile',
  MEDIO = 'medio',
  DIFFICILE = 'difficile',
  EXPERT = 'expert'
}

export enum QuizStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ARCHIVED = 'archived'
}

export enum ExamMode {
  INQUADRA = 'inquadra',
  VISUALIZZA = 'visualizza',
  STUDIO = 'studio'
}

export enum SessionStatus {
  PREPARING = 'preparing',
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  TERMINATED = 'terminated'
}

export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
  AUTO = 'auto',
  UNIVERSITY = 'university'
}

export enum AutoLockDuration {
  NEVER = 'never',
  ONE_MINUTE = '1min',
  FIVE_MINUTES = '5min',
  FIFTEEN_MINUTES = '15min'
}

export enum ExplanationLevel {
  BASIC = 'basic',
  DETAILED = 'detailed',
  EXPERT = 'expert'
}

export enum ProcessingSpeed {
  FAST = 'fast',
  BALANCED = 'balanced',
  ACCURATE = 'accurate'
}

export enum AdaptiveLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}

export enum MemoryType {
  SEMANTIC = 'semantic',
  EPISODIC = 'episodic',
  PROCEDURAL = 'procedural',
  WORKING = 'working'
}

export enum CognitiveProcess {
  ENCODING = 'encoding',
  STORAGE = 'storage',
  RETRIEVAL = 'retrieval',
  PROCESSING = 'processing',
  ANALYSIS = 'analysis',
  SYNTHESIS = 'synthesis'
}

// Tipi per statistiche e metriche
export interface SubjectStatistics {
  subject: Subject;
  averageScore: number;
  totalQuestions: number;
  correctAnswers: number;
  studyTime: number;
  improvement: number;
}

export interface WeeklyProgress {
  week: string;
  score: number;
  studyTime: number;
  questionsAnswered: number;
  neuralGrowth: number;
}

export interface NeuralGrowthMetrics {
  memoryRetention: number;
  cognitiveFlexibility: number;
  processingSpeed: number;
  analyticalThinking: number;
  creativeThinking: number;
}

// Tipi per navigazione
export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  Main: undefined;
  ExamSession: {
    mode: ExamMode;
  };
  StudySession: {
    subject?: Subject;
  };
  Settings: undefined;
  Profile: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Exams: undefined;
  Study: undefined;
  Statistics: undefined;
  Calendar: undefined;
};

// Tipi per API e servizi
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface OCRResult {
  text: string;
  confidence: number;
  boundingBoxes: BoundingBox[];
  language: string;
  processingTime: number;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
}

export interface CameraConfig {
  quality: number;
  format: string;
  flashMode: FlashMode;
  autoFocus: boolean;
  stabilization: boolean;
}

export enum FlashMode {
  AUTO = 'auto',
  ON = 'on',
  OFF = 'off',
  TORCH = 'torch'
}

// Tipi per hook e context
export interface AppContextType {
  user: User | null;
  theme: ThemeMode;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setTheme: (theme: ThemeMode) => void;
  logout: () => Promise<void>;
}

export interface ExamContextType {
  currentSession: ExamSession | null;
  startSession: (mode: ExamMode) => Promise<void>;
  endSession: () => Promise<void>;
  processQuestion: (image: string) => Promise<AIResponse>;
  submitAnswer: (answer: string) => Promise<void>;
}

export interface StudyContextType {
  currentSession: StudySession | null;
  startStudySession: (subject?: Subject) => Promise<void>;
  endStudySession: () => Promise<void>;
  getAdaptiveQuestion: () => Promise<Question>;
  submitStudyResponse: (response: string) => Promise<NeuralFeedback>;
}

// Tipi per configurazione app
export interface AppConfig {
  apiBaseUrl: string;
  aiApiKey: string;
  enableAnalytics: boolean;
  debugMode: boolean;
  version: string;
  buildNumber: number;
}

// Tipi per errori personalizzati
export interface AppError {
  code: string;
  message: string;
  stack?: string;
  metadata?: Record<string, any>;
}

export enum ErrorCode {
  NETWORK_ERROR = 'NETWORK_ERROR',
  AUTH_ERROR = 'AUTH_ERROR',
  CAMERA_ERROR = 'CAMERA_ERROR',
  OCR_ERROR = 'OCR_ERROR',
  AI_ERROR = 'AI_ERROR',
  PERMISSION_ERROR = 'PERMISSION_ERROR',
  STORAGE_ERROR = 'STORAGE_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR'
}