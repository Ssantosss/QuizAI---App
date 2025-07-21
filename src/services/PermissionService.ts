import {Platform, Alert, Linking} from 'react-native';
import {
  request,
  check,
  PERMISSIONS,
  RESULTS,
  Permission,
  PermissionStatus,
  openSettings,
} from 'react-native-permissions';

export interface PermissionResult {
  permission: Permission;
  status: PermissionStatus;
  granted: boolean;
}

export interface PermissionSummary {
  camera: boolean;
  photoLibrary: boolean;
  microphone: boolean;
  storage: boolean;
  allGranted: boolean;
}

class PermissionService {
  private static instance: PermissionService;

  public static getInstance(): PermissionService {
    if (!PermissionService.instance) {
      PermissionService.instance = new PermissionService();
    }
    return PermissionService.instance;
  }

  /**
   * Ottiene i permessi per piattaforma
   */
  private getPermissionsForPlatform() {
    if (Platform.OS === 'ios') {
      return {
        camera: PERMISSIONS.IOS.CAMERA,
        photoLibrary: PERMISSIONS.IOS.PHOTO_LIBRARY,
        microphone: PERMISSIONS.IOS.MICROPHONE,
      };
    } else {
      return {
        camera: PERMISSIONS.ANDROID.CAMERA,
        photoLibrary: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        microphone: PERMISSIONS.ANDROID.RECORD_AUDIO,
        storage: PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      };
    }
  }

  /**
   * Richiede tutti i permessi necessari
   */
  public async requestAllPermissions(): Promise<PermissionSummary> {
    const permissions = this.getPermissionsForPlatform();
    const results: PermissionResult[] = [];

    try {
      // Richiedi permesso camera
      const cameraResult = await this.requestPermission(
        permissions.camera,
        'Accesso Fotocamera',
        'QuizAI ha bisogno dell\'accesso alla fotocamera per scattare foto dei quiz e analizzarli con l\'AI.'
      );
      results.push(cameraResult);

      // Richiedi permesso galleria
      const photoResult = await this.requestPermission(
        permissions.photoLibrary,
        'Accesso Galleria',
        'QuizAI ha bisogno dell\'accesso alla galleria per caricare immagini esistenti di quiz.'
      );
      results.push(photoResult);

      // Richiedi permesso microfono (per funzionalità future)
      if (permissions.microphone) {
        const micResult = await this.requestPermission(
          permissions.microphone,
          'Accesso Microfono',
          'QuizAI potrebbe usare il microfono per funzionalità vocali future.'
        );
        results.push(micResult);
      }

      // Richiedi permesso storage (solo Android)
      if (Platform.OS === 'android' && permissions.storage) {
        const storageResult = await this.requestPermission(
          permissions.storage,
          'Accesso Storage',
          'QuizAI ha bisogno dell\'accesso allo storage per salvare dati offline.'
        );
        results.push(storageResult);
      }

      return this.createPermissionSummary(results);

    } catch (error) {
      console.error('Errore nella richiesta permessi:', error);
      throw new Error('Impossibile richiedere i permessi necessari');
    }
  }

  /**
   * Richiede un singolo permesso con gestione intelligente
   */
  public async requestPermission(
    permission: Permission,
    title: string,
    message: string
  ): Promise<PermissionResult> {
    try {
      // Controlla lo stato attuale
      const currentStatus = await check(permission);
      
      console.log(`📋 Permesso ${permission}: ${currentStatus}`);

      if (currentStatus === RESULTS.GRANTED) {
        return {
          permission,
          status: currentStatus,
          granted: true,
        };
      }

      if (currentStatus === RESULTS.DENIED) {
        // Prima volta che richiediamo il permesso
        const requestResult = await request(permission);
        
        return {
          permission,
          status: requestResult,
          granted: requestResult === RESULTS.GRANTED,
        };
      }

      if (currentStatus === RESULTS.BLOCKED || currentStatus === RESULTS.LIMITED) {
        // Permesso bloccato, mostra dialog per aprire impostazioni
        await this.showPermissionBlockedAlert(title, message);
        
        return {
          permission,
          status: currentStatus,
          granted: false,
        };
      }

      // Stato non disponibile o non supportato
      return {
        permission,
        status: currentStatus,
        granted: false,
      };

    } catch (error) {
      console.error(`Errore richiesta permesso ${permission}:`, error);
      throw error;
    }
  }

  /**
   * Controlla lo stato di tutti i permessi
   */
  public async checkAllPermissions(): Promise<PermissionSummary> {
    const permissions = this.getPermissionsForPlatform();
    const results: PermissionResult[] = [];

    try {
      for (const [key, permission] of Object.entries(permissions)) {
        if (permission) {
          const status = await check(permission);
          results.push({
            permission,
            status,
            granted: status === RESULTS.GRANTED,
          });
        }
      }

      return this.createPermissionSummary(results);

    } catch (error) {
      console.error('Errore nel controllo permessi:', error);
      throw error;
    }
  }

  /**
   * Controlla se un permesso specifico è concesso
   */
  public async isPermissionGranted(permissionType: 'camera' | 'photoLibrary' | 'microphone' | 'storage'): Promise<boolean> {
    const permissions = this.getPermissionsForPlatform();
    const permission = permissions[permissionType];

    if (!permission) {
      return true; // Se il permesso non esiste su questa piattaforma, consideralo concesso
    }

    try {
      const status = await check(permission);
      return status === RESULTS.GRANTED;
    } catch (error) {
      console.error(`Errore controllo permesso ${permissionType}:`, error);
      return false;
    }
  }

  /**
   * Richiede permesso camera con UI specifica
   */
  public async requestCameraPermission(): Promise<boolean> {
    const permissions = this.getPermissionsForPlatform();
    
    const result = await this.requestPermission(
      permissions.camera,
      'Accesso Fotocamera Richiesto',
      'QuizAI ha bisogno dell\'accesso alla fotocamera per:\n\n• Scattare foto dei quiz\n• Analizzare domande in tempo reale\n• Fornire risposte AI istantanee\n\nSenza questo permesso, le funzionalità principali dell\'app non saranno disponibili.'
    );

    return result.granted;
  }

  /**
   * Richiede permesso galleria con UI specifica
   */
  public async requestPhotoLibraryPermission(): Promise<boolean> {
    const permissions = this.getPermissionsForPlatform();
    
    const result = await this.requestPermission(
      permissions.photoLibrary,
      'Accesso Galleria Richiesto',
      'QuizAI ha bisogno dell\'accesso alla galleria per:\n\n• Caricare immagini esistenti di quiz\n• Analizzare foto salvate\n• Fornire maggiore flessibilità nell\'uso\n\nPuoi concedere questo permesso anche in seguito.'
    );

    return result.granted;
  }

  /**
   * Mostra alert per permesso bloccato
   */
  private async showPermissionBlockedAlert(title: string, message: string): Promise<void> {
    return new Promise((resolve) => {
      Alert.alert(
        `${title} - Permesso Bloccato`,
        `${message}\n\nPer usare questa funzionalità, devi abilitare il permesso nelle impostazioni del dispositivo.`,
        [
          {
            text: 'Annulla',
            style: 'cancel',
            onPress: () => resolve(),
          },
          {
            text: 'Apri Impostazioni',
            onPress: async () => {
              try {
                await openSettings();
              } catch (error) {
                console.error('Errore apertura impostazioni:', error);
                // Fallback per aprire le impostazioni dell'app
                Linking.openSettings();
              }
              resolve();
            },
          },
        ]
      );
    });
  }

  /**
   * Crea summary dei permessi
   */
  private createPermissionSummary(results: PermissionResult[]): PermissionSummary {
    const summary: PermissionSummary = {
      camera: false,
      photoLibrary: false,
      microphone: false,
      storage: false,
      allGranted: false,
    };

    const permissions = this.getPermissionsForPlatform();

    results.forEach((result) => {
      if (result.permission === permissions.camera) {
        summary.camera = result.granted;
      } else if (result.permission === permissions.photoLibrary) {
        summary.photoLibrary = result.granted;
      } else if (result.permission === permissions.microphone) {
        summary.microphone = result.granted;
      } else if (Platform.OS === 'android' && result.permission === permissions.storage) {
        summary.storage = result.granted;
      }
    });

    // Determina se tutti i permessi essenziali sono concessi
    summary.allGranted = summary.camera && summary.photoLibrary;

    return summary;
  }

  /**
   * Ottiene una descrizione user-friendly dello stato del permesso
   */
  public getPermissionStatusDescription(status: PermissionStatus): string {
    switch (status) {
      case RESULTS.GRANTED:
        return 'Concesso ✅';
      case RESULTS.DENIED:
        return 'Negato ❌';
      case RESULTS.BLOCKED:
        return 'Bloccato 🚫';
      case RESULTS.LIMITED:
        return 'Limitato ⚠️';
      case RESULTS.UNAVAILABLE:
        return 'Non disponibile 🚫';
      default:
        return 'Sconosciuto ❓';
    }
  }

  /**
   * Mostra dialog di aiuto sui permessi
   */
  public showPermissionHelpDialog(): void {
    Alert.alert(
      'Informazioni sui Permessi',
      'QuizAI richiede alcuni permessi per funzionare correttamente:\n\n' +
      '📷 FOTOCAMERA: Per scattare foto dei quiz\n' +
      '🖼️ GALLERIA: Per caricare immagini esistenti\n' +
      '🎤 MICROFONO: Per funzionalità vocali future\n' +
      '💾 STORAGE: Per salvare dati offline\n\n' +
      'Puoi modificare questi permessi in qualsiasi momento nelle impostazioni.',
      [
        {text: 'Ho Capito', style: 'default'},
        {
          text: 'Vai alle Impostazioni',
          onPress: () => openSettings(),
        },
      ]
    );
  }
}

// Funzioni di utility esportate
export const requestPermissions = async (): Promise<PermissionSummary> => {
  const permissionService = PermissionService.getInstance();
  return await permissionService.requestAllPermissions();
};

export const checkPermissions = async (): Promise<PermissionSummary> => {
  const permissionService = PermissionService.getInstance();
  return await permissionService.checkAllPermissions();
};

export const requestCameraPermission = async (): Promise<boolean> => {
  const permissionService = PermissionService.getInstance();
  return await permissionService.requestCameraPermission();
};

export const requestPhotoLibraryPermission = async (): Promise<boolean> => {
  const permissionService = PermissionService.getInstance();
  return await permissionService.requestPhotoLibraryPermission();
};

export const isPermissionGranted = async (
  permissionType: 'camera' | 'photoLibrary' | 'microphone' | 'storage'
): Promise<boolean> => {
  const permissionService = PermissionService.getInstance();
  return await permissionService.isPermissionGranted(permissionType);
};

export const showPermissionHelp = (): void => {
  const permissionService = PermissionService.getInstance();
  permissionService.showPermissionHelpDialog();
};

export default PermissionService;