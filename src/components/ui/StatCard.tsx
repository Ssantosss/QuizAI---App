import React, {useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
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
const CARD_WIDTH = (width - SPACING.lg * 3) / 2; // 2 colonne con gap

interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  color: string;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onPress?: () => void;
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color,
  subtitle,
  trend,
  onPress,
  delay = 0,
}) => {
  // Animazioni
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const pressAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animazione di entrata
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [delay]);

  const handlePressIn = () => {
    Animated.spring(pressAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    if (onPress) {
      // Animazione di feedback
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

  const CardComponent = onPress ? TouchableOpacity : View;

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
      <CardComponent
        style={styles.card}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
        disabled={!onPress}>
        
        {/* Gradient Background */}
        <LinearGradient
          colors={[COLORS.white, '#f8f9ff']}
          style={styles.cardGradient}>
          
          {/* Icon Container */}
          <View style={[styles.iconContainer, {backgroundColor: color + '20'}]}>
            <Icon name={icon} size={24} color={color} />
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.title} numberOfLines={2}>
              {title}
            </Text>
            
            <View style={styles.valueContainer}>
              <Text style={[styles.value, {color}]}>
                {value}
              </Text>
              
              {trend && (
                <View style={styles.trendContainer}>
                  <Icon
                    name={trend.isPositive ? 'trending-up' : 'trending-down'}
                    size={14}
                    color={trend.isPositive ? COLORS.success : COLORS.error}
                  />
                  <Text
                    style={[
                      styles.trendText,
                      {
                        color: trend.isPositive ? COLORS.success : COLORS.error,
                      },
                    ]}>
                    {trend.value}%
                  </Text>
                </View>
              )}
            </View>

            {subtitle && (
              <Text style={styles.subtitle} numberOfLines={1}>
                {subtitle}
              </Text>
            )}
          </View>

          {/* Decorative Elements */}
          <View style={[styles.decorativeCircle1, {backgroundColor: color + '10'}]} />
          <View style={[styles.decorativeCircle2, {backgroundColor: color + '05'}]} />
        </LinearGradient>
      </CardComponent>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    marginBottom: SPACING.md,
  },
  card: {
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardGradient: {
    padding: SPACING.lg,
    minHeight: 120,
    position: 'relative',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.gray700,
    marginBottom: SPACING.xs,
    lineHeight: 18,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  value: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: FONT_WEIGHTS.extrabold,
    flex: 1,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray100,
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.xs,
  },
  trendText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.semibold,
    marginLeft: 2,
  },
  subtitle: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.gray500,
  },
  decorativeCircle1: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: -30,
    left: -30,
    width: 80,
    height: 80,
    borderRadius: 40,
  },
});

export default StatCard;