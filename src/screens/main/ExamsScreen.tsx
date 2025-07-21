import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  Animated,
  Platform,
  StatusBar,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';

// Camera related imports
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import {launchImageLibrary} from 'react-native-image-picker';

// Components
import CameraView from '@/components/camera/CameraView';
import ResultView from '@/components/camera/ResultView';
import LoadingOverlay from '@/components/ui/LoadingOverlay';

// Services
import {OCRService} from '@/services/OCRService';
import {AIService} from '@/services/AIService';

// Constants and Types
import {
  COLORS,
  SPACING,
  FONT_SIZES,
  FONT_WEIGHTS,
  BORDER_RADIUS,
  CAMERA_CONFIG,
} from '@/constants';
import {ExamMode, AIResponse, OCRResult} from '@/types';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '@/types';

const {width, height} = Dimensions.get('window');

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface CameraState {
  hasPermission: boolean;
  isActive: boolean;
  mode: 'inquadra' | 'visualizza' | 'standby';
}

const ExamsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const devices = useCameraDevices();
  const device = devices.back;

  // State
  const [cameraState, setCameraState] = useState<CameraState>({
    hasPermission: false,
    isActive: false,
    mode: 'standby',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentResult, setCurrentResult] = useState<AIResponse | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  // Animations
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    checkCameraPermission();
  }, []);

  const checkCameraPermission = async () => {
    try {
      const permission = await Camera.getCameraPermissionStatus();
      if (permission === 'authorized') {
        setCameraState(prev => ({...prev, hasPermission: true}));
      } else {
        const newPermission = await Camera.requestCameraPermission();
        setCameraState(prev => ({
          ...prev,
          hasPermission: newPermission === 'authorized',
        }));
      }
    } catch (error) {
      console.error('Errore permessi camera:', error);
      Alert.alert('Errore', 'Impossibile accedere alla fotocamera.');
    }
  };

  const handleModeSelect = (mode: 'inquadra' | 'visualizza') => {
    setCameraState(prev => ({...prev, mode, isActive: mode === 'inquadra'}));
    
    // Animazione di transizione
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: mode === 'inquadra' ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: mode === 'standby' ? 1 : 0.8,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const capturePhoto = async () => {
    if (!device || !cameraState.isActive) return;

    try {
      setIsProcessing(true);
      
      // Simula la cattura dell'immagine
      // In una vera implementazione, useresti camera.takePhoto()
      const mockImagePath = 'file://mock-image-path.jpg';
      setCapturedImage(mockImagePath);

      // Processo OCR
      const ocrResult = await processOCR(mockImagePath);
      
      // Processo AI
      const aiResult = await processAI(ocrResult.text);
      
      setCurrentResult(aiResult);
      handleModeSelect('visualizza');
      
    } catch (error) {
      console.error('Errore nella cattura:', error);
      Alert.alert('Errore', 'Errore durante la cattura. Riprova.');
    } finally {
      setIsProcessing(false);
    }
  };

  const processOCR = async (imagePath: string): Promise<OCRResult> => {
    // Simula il processo OCR
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          text: 'Qual è il principio fondamentale della domanda e offerta?',
          confidence: 0.95,
          boundingBoxes: [],
          language: 'it',
          processingTime: 1240,
        });
      }, 1500);
    });
  };

  const processAI = async (questionText: string): Promise<AIResponse> => {
    // Simula il processo AI
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          suggestedAnswer: 'A',
          confidence: 0.97,
          explanation: 'Il principio fondamentale della domanda e offerta stabilisce che il prezzo di un bene è determinato dall\'equilibrio tra la quantità disponibile (offerta) e la quantità desiderata dai consumatori (domanda).',
          reasoning: 'Questo è un concetto base dell\'economia: quando la domanda aumenta e l\'offerta rimane costante, i prezzi tendono a salire. Viceversa, quando l\'offerta aumenta e la domanda rimane costante, i prezzi tendono a scendere.',
          sources: [
            'Principi di Economia - Capitolo 4',
            'Manuale di Microeconomia - Pag. 112-115',
          ],
          processingTime: 1847,
        });
      }, 2000);
    });
  };

  const selectImageFromGallery = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: CAMERA_CONFIG.quality,
        includeBase64: false,
      },
      (response) => {
        if (response.assets && response.assets[0]) {
          const imagePath = response.assets[0].uri!;
          setCapturedImage(imagePath);
          processOCR(imagePath).then((ocrResult) => {
            processAI(ocrResult.text).then((aiResult) => {
              setCurrentResult(aiResult);
              handleModeSelect('visualizza');
            });
          });
        }
      }
    );
  };

  const resetSession = () => {
    setCapturedImage(null);
    setCurrentResult(null);
    handleModeSelect('standby');
  };

  const startExamSession = () => {
    navigation.navigate('ExamSession', {mode: ExamMode.INQUADRA});
  };

  if (!cameraState.hasPermission) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Icon name="camera-off" size={64} color={COLORS.gray500} />
          <Text style={styles.permissionTitle}>
            Accesso alla fotocamera richiesto
          </Text>
          <Text style={styles.permissionText}>
            QuizAI ha bisogno dell'accesso alla fotocamera per funzionare
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={checkCameraPermission}>
            <LinearGradient
              colors={COLORS.gradients.primary}
              style={styles.buttonGradient}>
              <Text style={styles.buttonText}>Concedi Permesso</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.darker} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Esami</Text>
          <Text style={styles.headerSubtitle}>
            {cameraState.mode === 'inquadra' && 'Modalità Inquadra'}
            {cameraState.mode === 'visualizza' && 'Modalità Visualizza'}
            {cameraState.mode === 'standby' && 'Seleziona modalità'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.navigate('Settings')}>
          <Icon name="settings" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Mode Selection */}
      {cameraState.mode === 'standby' && (
        <Animated.View style={[styles.modeSelection, {opacity: fadeAnim}]}>
          <TouchableOpacity
            style={styles.modeCard}
            onPress={() => handleModeSelect('inquadra')}>
            <LinearGradient
              colors={COLORS.gradients.primary}
              style={styles.modeCardGradient}>
              <Icon name="camera" size={40} color={COLORS.white} />
              <Text style={styles.modeTitle}>Modalità Inquadra</Text>
              <Text style={styles.modeDescription}>
                Scatta foto del monitor e ottieni risposte AI istantanee
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modeCard}
            onPress={() => handleModeSelect('visualizza')}>
            <LinearGradient
              colors={COLORS.gradients.secondary}
              style={styles.modeCardGradient}>
              <Icon name="eye" size={40} color={COLORS.white} />
              <Text style={styles.modeTitle}>Modalità Visualizza</Text>
              <Text style={styles.modeDescription}>
                Visualizza le risposte elaborate in tempo reale
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Camera View */}
      {cameraState.mode === 'inquadra' && device && (
        <Animated.View 
          style={[
            styles.cameraContainer,
            {
              transform: [{translateY: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [height, 0],
              })}],
            },
          ]}>
          <CameraView
            device={device}
            isActive={cameraState.isActive}
            onCapture={capturePhoto}
            onGallery={selectImageFromGallery}
            onBack={() => handleModeSelect('standby')}
          />
        </Animated.View>
      )}

      {/* Result View */}
      {cameraState.mode === 'visualizza' && currentResult && (
        <Animated.View 
          style={[
            styles.resultContainer,
            {opacity: fadeAnim},
          ]}>
          <ResultView
            result={currentResult}
            onReset={resetSession}
            onNewCapture={() => handleModeSelect('inquadra')}
          />
        </Animated.View>
      )}

      {/* Quick Actions */}
      {cameraState.mode === 'standby' && (
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={startExamSession}>
            <LinearGradient
              colors={COLORS.gradients.accent}
              style={styles.quickActionGradient}>
              <Icon name="play" size={20} color={COLORS.white} />
              <Text style={styles.quickActionText}>Inizia Sessione Esame</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={selectImageFromGallery}>
            <LinearGradient
              colors={COLORS.gradients.ocean}
              style={styles.quickActionGradient}>
              <Icon name="image" size={20} color={COLORS.white} />
              <Text style={styles.quickActionText}>Carica da Galleria</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

      {/* Instructions */}
      {cameraState.mode === 'standby' && (
        <View style={styles.instructions}>
          <View style={styles.instructionCard}>
            <Icon name="info" size={24} color={COLORS.primary} />
            <View style={styles.instructionContent}>
              <Text style={styles.instructionTitle}>Come utilizzare QuizAI</Text>
              <Text style={styles.instructionText}>
                1. Scegli "Modalità Inquadra" per scattare foto del monitor{'\n'}
                2. Posiziona il dispositivo a 50-70cm dal monitor{'\n'}
                3. Assicurati che il testo sia leggibile{'\n'}
                4. Visualizza le risposte AI elaborate
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Loading Overlay */}
      {isProcessing && (
        <LoadingOverlay
          message="Elaborazione AI in corso..."
          progress={0.7}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.darker,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.glassBorder,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: FONT_SIZES.title,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.white,
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.normal,
    color: COLORS.gray400,
    marginTop: 2,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.glass,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  permissionTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.white,
    textAlign: 'center',
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  permissionText: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.normal,
    color: COLORS.gray400,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.xl,
  },
  permissionButton: {
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
  },
  buttonText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.white,
    textAlign: 'center',
  },
  modeSelection: {
    flex: 1,
    padding: SPACING.lg,
    justifyContent: 'center',
    gap: SPACING.lg,
  },
  modeCard: {
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  modeCardGradient: {
    padding: SPACING.xl,
    alignItems: 'center',
    minHeight: 180,
    justifyContent: 'center',
  },
  modeTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.white,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  modeDescription: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.normal,
    color: COLORS.white,
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 20,
  },
  cameraContainer: {
    flex: 1,
  },
  resultContainer: {
    flex: 1,
  },
  quickActions: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    gap: SPACING.md,
  },
  quickActionButton: {
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
  },
  quickActionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  quickActionText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.white,
    marginLeft: SPACING.sm,
  },
  instructions: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  instructionCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBg,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  instructionContent: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  instructionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.dark,
    marginBottom: SPACING.sm,
  },
  instructionText: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.normal,
    color: COLORS.gray700,
    lineHeight: 20,
  },
});

export default ExamsScreen;