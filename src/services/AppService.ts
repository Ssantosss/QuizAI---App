import {AppState, AppStateStatus} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {STORAGE_KEYS, DEFAULT_SETTINGS} from '@/constants';
import {AppConfig, User, UserPreferences} from '@/types';

class AppService {
  private static instance: AppService;
  private appConfig: AppConfig | null = null;
  private isInitialized = false;

  public static getInstance(): AppService {
    if (!AppService.instance) {
      AppService.instance = new AppService();
    }
    return AppService.instance;
  }

  /**
   * Inizializza l'applicazione
   */
  public async initialize(): Promise<void> {
    try {
      console.log('🚀 Inizializzazione QuizAI...');
      
      // Carica configurazione
      await this.loadAppConfig();
      
      // Carica impostazioni utente
      await this.loadUserSettings();
      
      // Inizializza servizi
      await this.initializeServices();
      
      // Setup crash reporting
      await this.setupCrashReporting();
      
      // Setup analytics
      await this.setupAnalytics();
      
      this.isInitialized = true;
      console.log('✅ QuizAI inizializzata con successo');
      
    } catch (error) {
      console.error('❌ Errore durante l\'inizializzazione:', error);
      throw new Error('Inizializzazione fallita');
    }
  }

  /**
   * Carica la configurazione dell'app
   */
  private async loadAppConfig(): Promise<void> {
    try {
      const environment = __DEV__ ? 'development' : 'production';
      
      this.appConfig = {
        apiBaseUrl: this.getEnvironmentVariable('API_BASE_URL', 'https://api.quizai.app'),
        aiApiKey: this.getEnvironmentVariable('OPENAI_API_KEY', ''),
        enableAnalytics: this.getEnvironmentVariable('ENABLE_ANALYTICS', 'true') === 'true',
        debugMode: __DEV__,
        version: '1.0.0',
        buildNumber: 1,
      };
      
      console.log(`📱 Configurazione caricata per: ${environment}`);
      
    } catch (error) {
      console.error('Errore nel caricamento configurazione:', error);
      throw error;
    }
  }

  /**
   * Carica le impostazioni utente salvate
   */
  private async loadUserSettings(): Promise<UserPreferences> {
    try {
      const savedSettings = await AsyncStorage.getItem(STORAGE_KEYS.settings);
      
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        console.log('⚙️ Impostazioni utente caricate');
        return settings;
      } else {
        // Salva impostazioni predefinite
        await this.saveUserSettings(DEFAULT_SETTINGS as UserPreferences);
        console.log('⚙️ Impostazioni predefinite applicate');
        return DEFAULT_SETTINGS as UserPreferences;
      }
      
    } catch (error) {
      console.error('Errore nel caricamento impostazioni:', error);
      return DEFAULT_SETTINGS as UserPreferences;
    }
  }

  /**
   * Salva le impostazioni utente
   */
  public async saveUserSettings(settings: UserPreferences): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
      console.log('💾 Impostazioni salvate');
    } catch (error) {
      console.error('Errore nel salvataggio impostazioni:', error);
      throw error;
    }
  }

  /**
   * Inizializza i servizi dell'app
   */
  private async initializeServices(): Promise<void> {
    try {
      // Qui inizializzeresti i vari servizi
      // Es: AuthService, AIService, OCRService, etc.
      console.log('🔧 Servizi inizializzati');
    } catch (error) {
      console.error('Errore inizializzazione servizi:', error);
      throw error;
    }
  }

  /**
   * Setup crash reporting
   */
  private async setupCrashReporting(): Promise<void> {
    try {
      if (this.appConfig?.enableAnalytics && !__DEV__) {
        // Setup Crashlytics o servizio simile
        console.log('📊 Crash reporting abilitato');
      }
    } catch (error) {
      console.error('Errore setup crash reporting:', error);
    }
  }

  /**
   * Setup analytics
   */
  private async setupAnalytics(): Promise<void> {
    try {
      if (this.appConfig?.enableAnalytics && !__DEV__) {
        // Setup Firebase Analytics o servizio simile
        console.log('📈 Analytics abilitato');
      }
    } catch (error) {
      console.error('Errore setup analytics:', error);
    }
  }

  /**
   * Gestisce i cambiamenti di stato dell'app
   */
  public handleAppStateChange(nextAppState: AppStateStatus): void {
    console.log(`📱 App state cambiato a: ${nextAppState}`);
    
    switch (nextAppState) {
      case 'active':
        this.onAppBecomesActive();
        break;
      case 'background':
        this.onAppGoesBackground();
        break;
      case 'inactive':
        this.onAppBecomesInactive();
        break;
    }
  }

  /**
   * Chiamato quando l'app diventa attiva
   */
  private onAppBecomesActive(): void {
    // Logica per quando l'app diventa attiva
    // Es: refresh token, controllo aggiornamenti, etc.
  }

  /**
   * Chiamato quando l'app va in background
   */
  private onAppGoesBackground(): void {
    // Logica per quando l'app va in background
    // Es: salvataggio stato, pausa sessioni, etc.
  }

  /**
   * Chiamato quando l'app diventa inattiva
   */
  private onAppBecomesInactive(): void {
    // Logica per quando l'app diventa inattiva
    // Es: pausa video, salvataggio temporaneo, etc.
  }

  /**
   * Carica utente salvato
   */
  public async loadSavedUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.user);
      if (userData) {
        return JSON.parse(userData);
      }
      return null;
    } catch (error) {
      console.error('Errore nel caricamento utente:', error);
      return null;
    }
  }

  /**
   * Salva utente
   */
  public async saveUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
    } catch (error) {
      console.error('Errore nel salvataggio utente:', error);
      throw error;
    }
  }

  /**
   * Pulisce i dati dell'app (logout)
   */
  public async clearAppData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.user,
        STORAGE_KEYS.token,
        STORAGE_KEYS.cache,
        STORAGE_KEYS.sessions,
      ]);
      console.log('🧹 Dati app puliti');
    } catch (error) {
      console.error('Errore nella pulizia dati:', error);
      throw error;
    }
  }

  /**
   * Ottiene variabile d'ambiente
   */
  private getEnvironmentVariable(key: string, defaultValue: string): string {
    // In una vera app, useresti react-native-config
    // return Config[key] || defaultValue;
    return defaultValue;
  }

  /**
   * Verifica se l'app è inizializzata
   */
  public get initialized(): boolean {
    return this.isInitialized;
  }

  /**
   * Ottiene la configurazione dell'app
   */
  public get config(): AppConfig | null {
    return this.appConfig;
  }

  /**
   * Log personalizzato per debug
   */
  public log(message: string, level: 'info' | 'warn' | 'error' = 'info'): void {
    if (this.appConfig?.debugMode || __DEV__) {
      const timestamp = new Date().toISOString();
      const prefix = level === 'error' ? '❌' : level === 'warn' ? '⚠️' : 'ℹ️';
      console.log(`${prefix} [${timestamp}] ${message}`);
    }
  }

  /**
   * Track evento analytics
   */
  public trackEvent(eventName: string, parameters?: Record<string, any>): void {
    if (this.appConfig?.enableAnalytics && !__DEV__) {
      // Implementa tracking con Firebase Analytics o simile
      console.log(`📊 Event tracked: ${eventName}`, parameters);
    }
  }

  /**
   * Report errore
   */
  public reportError(error: Error, context?: Record<string, any>): void {
    if (this.appConfig?.enableAnalytics && !__DEV__) {
      // Implementa reporting con Crashlytics o simile
      console.error('📊 Error reported:', error, context);
    } else {
      console.error('Error:', error, context);
    }
  }
}

// Funzioni di utility esportate
export const initializeApp = async (): Promise<void> => {
  const appService = AppService.getInstance();
  await appService.initialize();
};

export const handleAppStateChange = (nextAppState: AppStateStatus): void => {
  const appService = AppService.getInstance();
  appService.handleAppStateChange(nextAppState);
};

export const getAppConfig = (): AppConfig | null => {
  const appService = AppService.getInstance();
  return appService.config;
};

export const trackEvent = (eventName: string, parameters?: Record<string, any>): void => {
  const appService = AppService.getInstance();
  appService.trackEvent(eventName, parameters);
};

export const reportError = (error: Error, context?: Record<string, any>): void => {
  const appService = AppService.getInstance();
  appService.reportError(error, context);
};

export default AppService;