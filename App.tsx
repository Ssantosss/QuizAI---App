import React, {useEffect, useState} from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  Alert,
  LogBox,
  AppState,
  AppStateStatus,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';

// Context Providers
import {AppProvider} from '@/context/AppContext';
import {ExamProvider} from '@/context/ExamContext';
import {StudyProvider} from '@/context/StudyContext';

// Screens
import SplashScreen from '@/screens/SplashScreen';
import AuthScreen from '@/screens/auth/AuthScreen';
import MainNavigator from '@/navigation/MainNavigator';
import ExamSessionScreen from '@/screens/exams/ExamSessionScreen';
import StudySessionScreen from '@/screens/study/StudySessionScreen';
import SettingsScreen from '@/screens/SettingsScreen';
import ProfileScreen from '@/screens/ProfileScreen';

// Types
import {RootStackParamList} from '@/types';
import {COLORS} from '@/constants';

// Services
import {initializeApp, handleAppStateChange} from '@/services/AppService';
import {requestPermissions} from '@/services/PermissionService';

// Disable yellow box warnings for development
LogBox.ignoreLogs([
  'Warning: componentWillReceiveProps',
  'Warning: componentWillMount',
  'VirtualizedList: missing keys',
  'ViewPropTypes will be removed',
]);

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    initializeApp();
    requestInitialPermissions();
    
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => subscription?.remove();
  }, []);

  const requestInitialPermissions = async () => {
    try {
      await requestPermissions();
      // Simulazione caricamento iniziale
      setTimeout(() => {
        setIsLoading(false);
        // TODO: Controllare lo stato di autenticazione salvato
        setIsAuthenticated(false);
      }, 2000);
    } catch (error) {
      console.error('Errore nel richiedere i permessi:', error);
      Alert.alert(
        'Permessi Richiesti',
        'QuizAI ha bisogno di alcuni permessi per funzionare correttamente. Puoi gestirli nelle impostazioni.',
        [
          {
            text: 'Continua',
            onPress: () => {
              setIsLoading(false);
              setIsAuthenticated(false);
            },
          },
        ]
      );
    }
  };

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <StatusBar
          barStyle="light-content"
          backgroundColor={COLORS.darker}
          translucent
        />
        <AppProvider>
          <ExamProvider>
            <StudyProvider>
              <NavigationContainer>
                <Stack.Navigator
                  initialRouteName={isAuthenticated ? 'Main' : 'Auth'}
                  screenOptions={{
                    headerShown: false,
                    cardStyle: {backgroundColor: COLORS.darker},
                    animationEnabled: true,
                    gestureEnabled: false,
                  }}>
                  
                  {/* Auth Stack */}
                  <Stack.Screen
                    name="Auth"
                    component={AuthScreen}
                    options={{
                      animationTypeForReplace: 'pop',
                    }}
                  />
                  
                  {/* Main App Stack */}
                  <Stack.Screen
                    name="Main"
                    component={MainNavigator}
                    options={{
                      animationTypeForReplace: 'push',
                    }}
                  />
                  
                  {/* Modal Screens */}
                  <Stack.Screen
                    name="ExamSession"
                    component={ExamSessionScreen}
                    options={{
                      presentation: 'modal',
                      animationEnabled: true,
                      cardStyle: {backgroundColor: COLORS.dark},
                    }}
                  />
                  
                  <Stack.Screen
                    name="StudySession"
                    component={StudySessionScreen}
                    options={{
                      presentation: 'modal',
                      animationEnabled: true,
                      cardStyle: {backgroundColor: COLORS.dark},
                    }}
                  />
                  
                  <Stack.Screen
                    name="Settings"
                    component={SettingsScreen}
                    options={{
                      presentation: 'modal',
                      animationEnabled: true,
                    }}
                  />
                  
                  <Stack.Screen
                    name="Profile"
                    component={ProfileScreen}
                    options={{
                      presentation: 'modal',
                      animationEnabled: true,
                    }}
                  />
                </Stack.Navigator>
              </NavigationContainer>
            </StudyProvider>
          </ExamProvider>
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.darker,
  },
});

export default App;