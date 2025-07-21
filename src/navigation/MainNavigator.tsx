import React from 'react';
import {StyleSheet, Platform} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';

// Screens
import DashboardScreen from '@/screens/main/DashboardScreen';
import ExamsScreen from '@/screens/main/ExamsScreen';
import StudyScreen from '@/screens/main/StudyScreen';
import StatisticsScreen from '@/screens/main/StatisticsScreen';
import CalendarScreen from '@/screens/main/CalendarScreen';

// Types
import {MainTabParamList} from '@/types';
import {COLORS, SPACING, FONT_SIZES, BORDER_RADIUS} from '@/constants';

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray500,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarIconStyle: styles.tabBarIcon,
        tabBarHideOnKeyboard: true,
        tabBarIcon: ({focused, color, size}) => {
          let iconName: string;

          switch (route.name) {
            case 'Dashboard':
              iconName = 'home';
              break;
            case 'Exams':
              iconName = 'camera';
              break;
            case 'Study':
              iconName = 'brain';
              break;
            case 'Statistics':
              iconName = 'bar-chart-2';
              break;
            case 'Calendar':
              iconName = 'calendar';
              break;
            default:
              iconName = 'circle';
          }

          return (
            <Icon
              name={iconName}
              size={focused ? 28 : 24}
              color={focused ? COLORS.primary : color}
              style={{
                opacity: focused ? 1 : 0.7,
                transform: [{scale: focused ? 1.1 : 1}],
              }}
            />
          );
        },
        tabBarBackground: () => (
          <LinearGradient
            colors={[COLORS.glass, COLORS.darker]}
            style={styles.tabBarBackground}
          />
        ),
      })}>
      
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarAccessibilityLabel: 'Dashboard principale',
        }}
      />
      
      <Tab.Screen
        name="Exams"
        component={ExamsScreen}
        options={{
          tabBarLabel: 'Esami',
          tabBarAccessibilityLabel: 'Modalità esami e inquadramento',
        }}
      />
      
      <Tab.Screen
        name="Study"
        component={StudyScreen}
        options={{
          tabBarLabel: 'Studio',
          tabBarAccessibilityLabel: 'Modalità studio neuroscientifico',
        }}
      />
      
      <Tab.Screen
        name="Statistics"
        component={StatisticsScreen}
        options={{
          tabBarLabel: 'Stats',
          tabBarAccessibilityLabel: 'Statistiche e performance',
        }}
      />
      
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          tabBarLabel: 'Calendar',
          tabBarAccessibilityLabel: 'Calendario ed eventi',
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: SPACING.lg,
    left: SPACING.lg,
    right: SPACING.lg,
    elevation: 8,
    backgroundColor: 'transparent',
    borderRadius: BORDER_RADIUS.xl,
    height: 70,
    borderTopWidth: 0,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      android: {
        elevation: 20,
      },
    }),
  },
  tabBarBackground: {
    flex: 1,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  tabBarLabel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    marginTop: 4,
    marginBottom: 8,
  },
  tabBarIcon: {
    marginTop: 8,
  },
});

export default MainNavigator;