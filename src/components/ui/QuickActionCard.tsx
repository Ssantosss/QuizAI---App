import React, {useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import {
  COLORS,
  SPACING,
  FONT_SIZES,
  FONT_WEIGHTS,
  BORDER_RADIUS,
} from '@/constants';

const {width} = Dimensions.get('window');

interface QuickActionCardProps {
  title: string;
  subtitle: string;
  icon: string;
  gradient: string[];
  onPress: () => void;
  delay?: number;
  disabled?: boolean;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({
  title,
  subtitle,
  icon,
  gradient,
  onPress,
  delay = 0,
  disabled = false,
}) => {
  // Animazioni
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pressAnim = useRef(new Animated.Value(1)).current;
  const iconAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animazione di entrata con delay
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      // Animazione dell'icona dopo l'entrata
      Animated.spring(iconAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start();
    });
  }, [delay]);

  const handlePressIn = () => {
    if (!disabled) {
      Animated.parallel([
        Animated.spring(pressAnim, {
          toValue: 0.95,
          useNativeDriver: true,
        }),
        Animated.timing(iconAnim, {
          toValue: 1.2,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const handlePressOut = () => {
    if (!disabled) {
      Animated.parallel([
        Animated.spring(pressAnim, {
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.spring(iconAnim, {
          toValue: 1,
          tension: 300,
          friction: 10,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const handlePress = () => {
    if (!disabled) {
      // Animazione di feedback haptic
      Animated.sequence([
        Animated.timing(pressAnim, {
          toValue: 0.9,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(pressAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
      
      onPress();
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            {scale: Animated.multiply(scaleAnim, pressAnim)},
            {translateY: slideAnim},
          ],
          opacity: fadeAnim,
        },
      ]}>
      <TouchableOpacity
        style={[styles.card, disabled && styles.disabledCard]}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
        disabled={disabled}>
        
        <LinearGradient
          colors={disabled ? [COLORS.gray400, COLORS.gray500] : gradient}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.gradient}>
          
          <View style={styles.content}>
            {/* Icon Section */}
            <Animated.View
              style={[
                styles.iconContainer,
                {
                  transform: [
                    {scale: iconAnim},
                    {
                      rotate: iconAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '5deg'],
                      }),
                    },
                  ],
                },
              ]}>
              <View style={styles.iconBackground}>
                <Icon
                  name={icon}
                  size={32}
                  color={COLORS.white}
                  style={styles.icon}
                />
              </View>
            </Animated.View>

            {/* Text Section */}
            <View style={styles.textContainer}>
              <Text style={styles.title} numberOfLines={1}>
                {title}
              </Text>
              <Text style={styles.subtitle} numberOfLines={2}>
                {subtitle}
              </Text>
            </View>

            {/* Arrow Icon */}
            <Animated.View
              style={[
                styles.arrowContainer,
                {
                  transform: [
                    {
                      translateX: iconAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 5],
                      }),
                    },
                  ],
                },
              ]}>
              <Icon name="arrow-right" size={20} color={COLORS.white} />
            </Animated.View>
          </View>

          {/* Decorative Elements */}
          <View style={styles.decorativeElements}>
            <View style={[styles.circle1, {opacity: disabled ? 0.3 : 0.2}]} />
            <View style={[styles.circle2, {opacity: disabled ? 0.2 : 0.15}]} />
            <View style={[styles.circle3, {opacity: disabled ? 0.1 : 0.1}]} />
          </View>

          {/* Shine Effect */}
          <Animated.View
            style={[
              styles.shineEffect,
              {
                opacity: iconAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.3],
                }),
                transform: [
                  {
                    translateX: iconAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-width, width],
                    }),
                  },
                ],
              },
            ]}
          />
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.sm,
  },
  card: {
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  disabledCard: {
    shadowOpacity: 0.1,
    elevation: 2,
  },
  gradient: {
    padding: SPACING.lg,
    minHeight: 100,
    position: 'relative',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
  },
  iconContainer: {
    marginRight: SPACING.lg,
  },
  iconBackground: {
    width: 64,
    height: 64,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  icon: {
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 4,
  },
  textContainer: {
    flex: 1,
    marginRight: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.white,
    marginBottom: SPACING.xs,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.white,
    opacity: 0.9,
    lineHeight: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 1,
  },
  arrowContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  decorativeElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  circle1: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.white,
  },
  circle2: {
    position: 'absolute',
    bottom: -40,
    left: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.white,
  },
  circle3: {
    position: 'absolute',
    top: 20,
    left: -20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.white,
  },
  shineEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.white,
    transform: [{skewX: '-20deg'}],
    zIndex: 3,
  },
});

export default QuickActionCard;