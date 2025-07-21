import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Animated,
  StatusBar,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';

// Components
import StatCard from '@/components/ui/StatCard';
import QuickActionCard from '@/components/ui/QuickActionCard';
import ProgressChart from '@/components/charts/ProgressChart';

// Constants
import {
  COLORS,
  SPACING,
  FONT_SIZES,
  FONT_WEIGHTS,
  BORDER_RADIUS,
} from '@/constants';

// Types
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList, ExamMode} from '@/types';

const {width} = Dimensions.get('window');

type NavigationProp = StackNavigationProp<RootStackParamList>;

const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - In un'app reale questi verrebbero da un context o API
  const userStats = {
    totalExams: 5,
    averageScore: 28,
    successRate: 92,
    studyDays: 17,
    weeklyProgress: [24, 26, 28, 27, 30, 29, 31],
  };

  const quickActions = [
    {
      id: 'inquadra',
      title: 'Modalità Inquadra',
      subtitle: 'Scatta e analizza quiz',
      icon: 'camera',
      gradient: COLORS.gradients.primary,
      onPress: () => navigation.navigate('ExamSession', {mode: ExamMode.INQUADRA}),
    },
    {
      id: 'visualizza',
      title: 'Modalità Visualizza',
      subtitle: 'Visualizza risposte AI',
      icon: 'eye',
      gradient: COLORS.gradients.secondary,
      onPress: () => navigation.navigate('ExamSession', {mode: ExamMode.VISUALIZZA}),
    },
    {
      id: 'studio',
      title: 'Studio Neuroscientifico',
      subtitle: 'Apprendimento avanzato',
      icon: 'brain',
      gradient: COLORS.gradients.accent,
      onPress: () => navigation.navigate('StudySession', {}),
    },
  ];

  const recentExams = [
    {id: '1', subject: 'Economia', score: 28, date: '2025-01-10'},
    {id: '2', subject: 'Marketing', score: 30, date: '2025-01-09'},
    {id: '3', subject: 'Statistica', score: 26, date: '2025-01-08'},
  ];

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.darker} />
      
      {/* Animated Header */}
      <Animated.View style={[styles.header, {opacity: headerOpacity}]}>
        <LinearGradient
          colors={[COLORS.glass, COLORS.darker]}
          style={styles.headerGradient}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Dashboard</Text>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => navigation.navigate('Profile')}>
              <LinearGradient
                colors={COLORS.gradients.primary}
                style={styles.profileGradient}>
                <Text style={styles.profileInitial}>M</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Animated.View>

      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: false}
        )}
        scrollEventThrottle={16}>
        
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Bentornato,</Text>
          <Text style={styles.userName}>Santo Mostro</Text>
          <Text style={styles.welcomeSubtitle}>
            Continua il tuo percorso di apprendimento
          </Text>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Le tue statistiche</Text>
          <View style={styles.statsGrid}>
            <StatCard
              title="Esami completati"
              value={userStats.totalExams.toString()}
              icon="check-circle"
              color={COLORS.success}
            />
            <StatCard
              title="Media voti"
              value={userStats.averageScore.toString()}
              icon="trending-up"
              color={COLORS.primary}
            />
            <StatCard
              title="Tasso successo"
              value={`${userStats.successRate}%`}
              icon="target"
              color={COLORS.secondary}
            />
            <StatCard
              title="Giorni di studio"
              value={userStats.studyDays.toString()}
              icon="calendar"
              color={COLORS.accent}
            />
          </View>
        </View>

        {/* Progress Chart */}
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Progresso settimanale</Text>
          <View style={styles.chartContainer}>
            <ProgressChart
              data={userStats.weeklyProgress}
              width={width - SPACING.xl * 2}
              height={200}
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Azioni rapide</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <QuickActionCard
                key={action.id}
                title={action.title}
                subtitle={action.subtitle}
                icon={action.icon}
                gradient={action.gradient}
                onPress={action.onPress}
                delay={index * 100}
              />
            ))}
          </View>
        </View>

        {/* Recent Exams */}
        <View style={styles.recentSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Esami recenti</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Exams')}>
              <Text style={styles.seeAllText}>Vedi tutti</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.recentList}>
            {recentExams.map((exam, index) => (
              <View key={exam.id} style={styles.recentItem}>
                <View style={styles.recentIcon}>
                  <Icon name="book" size={20} color={COLORS.primary} />
                </View>
                <View style={styles.recentContent}>
                  <Text style={styles.recentSubject}>{exam.subject}</Text>
                  <Text style={styles.recentDate}>{exam.date}</Text>
                </View>
                <View style={styles.recentScore}>
                  <Text style={styles.scoreValue}>{exam.score}</Text>
                  <Text style={styles.scoreLabel}>voto</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Performance Tips */}
        <View style={styles.tipsSection}>
          <Text style={styles.sectionTitle}>💡 Suggerimento del giorno</Text>
          <View style={styles.tipCard}>
            <LinearGradient
              colors={COLORS.gradients.ocean}
              style={styles.tipGradient}>
              <Icon name="lightbulb" size={24} color={COLORS.white} />
              <Text style={styles.tipText}>
                Per risultati ottimali, utilizza l'app in condizioni di luce soffusa 
                e assicurati di avere una connessione internet stabile.
              </Text>
            </LinearGradient>
          </View>
        </View>

        {/* Bottom Spacing for Tab Bar */}
        <View style={styles.bottomSpacing} />
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.darker,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    height: 100,
  },
  headerGradient: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.glassBorder,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
  },
  headerTitle: {
    fontSize: FONT_SIZES.title,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.white,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 120, // Space for header
  },
  welcomeSection: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
  },
  welcomeText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.normal,
    color: COLORS.gray400,
  },
  userName: {
    fontSize: FONT_SIZES.header,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.white,
    marginBottom: SPACING.sm,
  },
  welcomeSubtitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.normal,
    color: COLORS.gray500,
  },
  statsSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.white,
    marginBottom: SPACING.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  chartSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  chartContainer: {
    backgroundColor: COLORS.cardBg,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  actionsSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  actionsGrid: {
    gap: SPACING.md,
  },
  recentSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  seeAllText: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.primary,
  },
  recentList: {
    backgroundColor: COLORS.cardBg,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
  },
  recentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  recentContent: {
    flex: 1,
  },
  recentSubject: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.dark,
    marginBottom: 2,
  },
  recentDate: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.normal,
    color: COLORS.gray600,
  },
  recentScore: {
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.primary,
  },
  scoreLabel: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.gray600,
  },
  tipsSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  tipCard: {
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  tipGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  tipText: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.white,
    marginLeft: SPACING.md,
    lineHeight: 22,
  },
  bottomSpacing: {
    height: 100, // Space for bottom tab bar
  },
});

export default DashboardScreen;