import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import {COLORS, FONT_SIZES, FONT_WEIGHTS, SPACING} from '@/constants';

const {width, height} = Dimensions.get('window');

const SplashScreen: React.FC = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Sequenza di animazioni
    Animated.sequence([
      // Animazione logo
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 4,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
      // Animazione testo
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <LinearGradient
      colors={[COLORS.darker, COLORS.dark, COLORS.primary]}
      locations={[0, 0.7, 1]}
      style={styles.container}>
      <StatusBar hidden />
      
      {/* Background Pattern */}
      <View style={styles.backgroundPattern}>
        {[...Array(6)].map((_, i) => (
          <Animated.View
            key={i}
            style={[
              styles.patternCircle,
              {
                opacity: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.1],
                }),
                transform: [
                  {
                    scale: scaleAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.5, 1.2 + i * 0.1],
                    }),
                  },
                ],
                left: (i % 3) * (width / 3),
                top: Math.floor(i / 3) * (height / 3),
              },
            ]}
          />
        ))}
      </View>

      {/* Logo Section */}
      <View style={styles.logoContainer}>
        <Animated.View
          style={[
            styles.logoIcon,
            {
              opacity: fadeAnim,
              transform: [
                {scale: scaleAnim},
                {rotate: spin},
              ],
            },
          ]}>
          <LinearGradient
            colors={[COLORS.secondary, COLORS.primary]}
            style={styles.iconGradient}>
            <Icon name="brain" size={60} color={COLORS.white} />
          </LinearGradient>
        </Animated.View>

        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: fadeAnim,
              transform: [{translateY: slideAnim}],
            },
          ]}>
          <Text style={styles.title}>
            quiz<Text style={styles.titleAccent}>AI</Text>
          </Text>
          <Text style={styles.subtitle}>La tua mente aumentata</Text>
          
          <View style={styles.taglineContainer}>
            <Icon name="zap" size={16} color={COLORS.secondary} />
            <Text style={styles.tagline}>
              Impara velocemente. Pensa come l'AI.
            </Text>
          </View>
        </Animated.View>
      </View>

      {/* Loading Indicator */}
      <Animated.View
        style={[
          styles.loadingContainer,
          {
            opacity: fadeAnim,
            transform: [{translateY: slideAnim}],
          },
        ]}>
        <View style={styles.loadingBar}>
          <Animated.View
            style={[
              styles.loadingProgress,
              {
                width: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>
        <Text style={styles.loadingText}>Inizializzazione...</Text>
      </Animated.View>

      {/* Footer */}
      <Animated.View
        style={[
          styles.footer,
          {
            opacity: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.7],
            }),
          },
        ]}>
        <Text style={styles.footerText}>
          Powered by Advanced AI • Neuroscience-Based Learning
        </Text>
        <Text style={styles.version}>v1.0.0</Text>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  patternCircle: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLORS.white,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIcon: {
    marginBottom: SPACING.xl,
  },
  iconGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: FONT_SIZES.hero,
    fontWeight: FONT_WEIGHTS.extrabold,
    color: COLORS.white,
    marginBottom: SPACING.sm,
    letterSpacing: 2,
  },
  titleAccent: {
    color: COLORS.secondary,
  },
  subtitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.gray300,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  taglineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xxxl,
  },
  tagline: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.secondary,
    marginLeft: SPACING.sm,
    fontStyle: 'italic',
  },
  loadingContainer: {
    position: 'absolute',
    bottom: height * 0.25,
    alignItems: 'center',
    width: '80%',
  },
  loadingBar: {
    width: '100%',
    height: 4,
    backgroundColor: COLORS.gray800,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: SPACING.md,
  },
  loadingProgress: {
    height: '100%',
    backgroundColor: COLORS.secondary,
    borderRadius: 2,
  },
  loadingText: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.gray400,
  },
  footer: {
    position: 'absolute',
    bottom: SPACING.xl,
    alignItems: 'center',
  },
  footerText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.normal,
    color: COLORS.gray500,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  version: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.light,
    color: COLORS.gray600,
  },
});

export default SplashScreen;