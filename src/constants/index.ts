// ===== COSTANTI DELL'APP QUIZAI =====

// Colori del tema
export const COLORS = {
  // Colori principali
  primary: '#6c63ff',
  primaryDark: '#5a52e0',
  secondary: '#00bfa6',
  accent: '#ff6b6b',
  
  // Colori di sfondo
  dark: '#1e1e2e',
  darker: '#121220',
  light: '#f8f9ff',
  
  // Colori per UI
  white: '#ffffff',
  black: '#000000',
  success: '#00c851',
  warning: '#ffbb33',
  error: '#ff4444',
  info: '#33b5e5',
  
  // Grigi
  gray100: '#f8f9fa',
  gray200: '#e9ecef',
  gray300: '#dee2e6',
  gray400: '#ced4da',
  gray500: '#adb5bd',
  gray600: '#6c757d',
  gray700: '#495057',
  gray800: '#343a40',
  gray900: '#212529',
  
  // Colori per grafici
  chart: {
    blue: '#6c63ff',
    green: '#00bfa6',
    red: '#ff6b6b',
    orange: '#ff9f43',
    purple: '#a55eea',
    pink: '#fd79a8',
    yellow: '#fdcb6e',
    cyan: '#00cec9'
  },
  
  // Overlay e trasparenze
  overlay: 'rgba(0, 0, 0, 0.5)',
  glass: 'rgba(30, 30, 46, 0.85)',
  glassBorder: 'rgba(255, 255, 255, 0.12)',
  cardBg: 'rgba(255, 255, 255, 0.97)',
  
  // Gradients
  gradients: {
    primary: ['#6c63ff', '#5a52e0'],
    secondary: ['#00bfa6', '#00a693'],
    accent: ['#ff6b6b', '#ff5252'],
    sunset: ['#ff9a9e', '#fecfef'],
    ocean: ['#667eea', '#764ba2'],
    forest: ['#56ab2f', '#a8e6cf']
  }
};

// Dimensioni e spaziature
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64
};

export const BORDER_RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  round: 9999
};

export const FONT_SIZES = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 20,
  xxxl: 24,
  title: 28,
  header: 32,
  hero: 40
};

export const FONT_WEIGHTS = {
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800'
};

// Animazioni
export const ANIMATIONS = {
  timing: {
    fast: 200,
    normal: 300,
    slow: 500
  },
  easing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out'
  }
};

// Dimensioni dello schermo
export const SCREEN = {
  width: 375, // Base iPhone screen width
  height: 812, // Base iPhone screen height
  statusBarHeight: 44,
  tabBarHeight: 83,
  headerHeight: 60
};

// Configurazioni fotocamera
export const CAMERA_CONFIG = {
  quality: 0.8,
  format: 'jpeg',
  flashMode: 'auto',
  autoFocus: true,
  stabilization: true,
  maxWidth: 1920,
  maxHeight: 1080,
  includeBase64: false,
  mediaType: 'photo'
};

// Configurazioni OCR
export const OCR_CONFIG = {
  language: 'it+en',
  confidence: 0.7,
  timeout: 30000,
  preprocessImage: true,
  enhanceContrast: true
};

// Configurazioni AI
export const AI_CONFIG = {
  timeout: 10000,
  retryAttempts: 3,
  confidenceThreshold: 0.8,
  maxTokens: 1000,
  temperature: 0.3
};

// URL e API
export const API_ENDPOINTS = {
  auth: '/auth',
  users: '/users',
  questions: '/questions',
  exams: '/exams',
  study: '/study',
  ai: '/ai',
  ocr: '/ocr',
  analytics: '/analytics'
};

// Chiavi di storage locale
export const STORAGE_KEYS = {
  user: '@quizai_user',
  token: '@quizai_token',
  settings: '@quizai_settings',
  cache: '@quizai_cache',
  sessions: '@quizai_sessions',
  offline_data: '@quizai_offline'
};

// Messaggi dell'app
export const MESSAGES = {
  errors: {
    network: 'Errore di connessione. Controlla la tua rete.',
    camera: 'Impossibile accedere alla fotocamera.',
    permission: 'Permessi necessari non concessi.',
    ocr: 'Errore nel riconoscimento del testo.',
    ai: 'Errore nell\'elaborazione AI.',
    auth: 'Errore di autenticazione.',
    generic: 'Si è verificato un errore. Riprova.'
  },
  success: {
    photoTaken: 'Foto scattata con successo!',
    sessionSaved: 'Sessione salvata correttamente.',
    settingsUpdated: 'Impostazioni aggiornate.',
    login: 'Accesso effettuato con successo.',
    logout: 'Disconnessione completata.'
  },
  info: {
    processing: 'Elaborazione in corso...',
    loading: 'Caricamento...',
    analyzing: 'Analisi AI in corso...',
    saving: 'Salvataggio...',
    syncing: 'Sincronizzazione...'
  }
};

// Impostazioni predefinite
export const DEFAULT_SETTINGS = {
  theme: 'dark',
  notifications: {
    pushEnabled: true,
    emailEnabled: false,
    studyReminders: true,
    examAlerts: true,
    weeklyReports: true
  },
  privacy: {
    dataSharing: false,
    anonymousUsage: true,
    biometricLock: false,
    autoLock: '5min'
  },
  study: {
    adaptiveLearning: true,
    neuralFeedback: true,
    spacedRepetition: true,
    gamification: true,
    difficultySetting: 'medio'
  },
  ai: {
    explanationLevel: 'detailed',
    confidence: 0.8,
    processingSpeed: 'balanced',
    neuralAnalysis: true
  }
};

// Configurazioni neuroscienze
export const NEURAL_CONFIG = {
  memoryTypes: {
    semantic: {
      name: 'Semantica',
      description: 'Memoria dei significati e concetti',
      color: COLORS.primary
    },
    episodic: {
      name: 'Episodica',
      description: 'Memoria degli eventi specifici',
      color: COLORS.secondary
    },
    procedural: {
      name: 'Procedurale',
      description: 'Memoria delle abilità e procedure',
      color: COLORS.accent
    },
    working: {
      name: 'Lavoro',
      description: 'Memoria a breve termine attiva',
      color: COLORS.chart.orange
    }
  },
  
  cognitiveProcesses: {
    encoding: 'Codifica',
    storage: 'Immagazzinamento',
    retrieval: 'Recupero',
    processing: 'Elaborazione',
    analysis: 'Analisi',
    synthesis: 'Sintesi'
  },
  
  adaptiveLevels: {
    beginner: {
      name: 'Principiante',
      multiplier: 0.7,
      repetitionInterval: 1
    },
    intermediate: {
      name: 'Intermedio',
      multiplier: 1.0,
      repetitionInterval: 2
    },
    advanced: {
      name: 'Avanzato',
      multiplier: 1.3,
      repetitionInterval: 3
    },
    expert: {
      name: 'Esperto',
      multiplier: 1.6,
      repetitionInterval: 5
    }
  }
};

// Configurazioni materie
export const SUBJECTS_CONFIG = {
  economia: {
    name: 'Economia',
    icon: 'trending-up',
    color: COLORS.primary,
    difficulty: ['facile', 'medio', 'difficile']
  },
  marketing: {
    name: 'Marketing',
    icon: 'megaphone',
    color: COLORS.secondary,
    difficulty: ['facile', 'medio', 'difficile']
  },
  statistica: {
    name: 'Statistica',
    icon: 'bar-chart',
    color: COLORS.accent,
    difficulty: ['medio', 'difficile', 'expert']
  },
  finanza: {
    name: 'Finanza',
    icon: 'dollar-sign',
    color: COLORS.chart.orange,
    difficulty: ['medio', 'difficile', 'expert']
  },
  diritto: {
    name: 'Diritto',
    icon: 'gavel',
    color: COLORS.chart.purple,
    difficulty: ['facile', 'medio', 'difficile']
  },
  matematica: {
    name: 'Matematica',
    icon: 'calculator',
    color: COLORS.chart.blue,
    difficulty: ['medio', 'difficile', 'expert']
  },
  informatica: {
    name: 'Informatica',
    icon: 'cpu',
    color: COLORS.chart.cyan,
    difficulty: ['facile', 'medio', 'difficile', 'expert']
  },
  altro: {
    name: 'Altro',
    icon: 'book',
    color: COLORS.gray600,
    difficulty: ['facile', 'medio', 'difficile']
  }
};

// Configurazioni validazione
export const VALIDATION = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: false
  },
  username: {
    minLength: 3,
    maxLength: 30,
    allowedChars: /^[a-zA-Z0-9_]+$/
  }
};

// Configurazioni ambiente
export const ENVIRONMENT = {
  development: {
    apiUrl: 'http://localhost:3000/api',
    enableLogs: true,
    enableAnalytics: false
  },
  staging: {
    apiUrl: 'https://staging-api.quizai.app/api',
    enableLogs: true,
    enableAnalytics: true
  },
  production: {
    apiUrl: 'https://api.quizai.app/api',
    enableLogs: false,
    enableAnalytics: true
  }
};

// Icone dell'app
export const ICONS = {
  // Navigation
  home: 'home',
  camera: 'camera',
  eye: 'eye',
  chart: 'bar-chart-2',
  calendar: 'calendar',
  settings: 'settings',
  user: 'user',
  
  // Actions
  play: 'play',
  pause: 'pause',
  stop: 'square',
  save: 'save',
  share: 'share-2',
  download: 'download',
  upload: 'upload',
  edit: 'edit-2',
  delete: 'trash-2',
  
  // UI
  back: 'arrow-left',
  forward: 'arrow-right',
  up: 'arrow-up',
  down: 'arrow-down',
  close: 'x',
  menu: 'menu',
  search: 'search',
  filter: 'filter',
  
  // Features
  brain: 'brain',
  zap: 'zap',
  target: 'target',
  award: 'award',
  book: 'book',
  bookmark: 'bookmark',
  star: 'star',
  heart: 'heart',
  
  // Status
  check: 'check',
  checkCircle: 'check-circle',
  x: 'x',
  xCircle: 'x-circle',
  alert: 'alert-triangle',
  info: 'info',
  
  // Technology
  wifi: 'wifi',
  bluetooth: 'bluetooth',
  battery: 'battery',
  signal: 'signal',
  
  // Social
  mail: 'mail',
  phone: 'phone',
  message: 'message-square',
  bell: 'bell',
  
  // Files
  image: 'image',
  file: 'file',
  folder: 'folder',
  
  // Media
  camera: 'camera',
  video: 'video',
  mic: 'mic',
  volume: 'volume-2'
};

// Timeouts e intervalli
export const TIMEOUTS = {
  shortTimeout: 3000,
  mediumTimeout: 5000,
  longTimeout: 10000,
  sessionTimeout: 30 * 60 * 1000, // 30 minuti
  cacheTimeout: 60 * 60 * 1000 // 1 ora
};

// Configurazioni performance
export const PERFORMANCE = {
  imageCompression: 0.8,
  cacheSize: 50, // MB
  maxConcurrentRequests: 3,
  retryAttempts: 3,
  retryDelay: 1000
};