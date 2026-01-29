import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { ThemeColors } from '../theme/colors';
import { typography } from '../theme/typography';
import { getGlassStyles, spacing } from '../theme/styles';
import { RootTabParamList, HomeStackParamList, ToDoStackParamList, CalendarStackParamList, SettingsStackParamList } from './types';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import TimerScreen from '../screens/TimerScreen';
import AssignmentsScreen from '../screens/AssignmentsScreen';
import AddEditAssignmentScreen from '../screens/AddEditAssignmentScreen';
import CalendarScreen from '../screens/CalendarScreen';
import DayViewScreen from '../screens/DayViewScreen';
import WeekViewScreen from '../screens/WeekViewScreen';
import StatisticsScreen from '../screens/StatisticsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import CoursesListScreen from '../screens/CoursesListScreen';
import AddEditCourseScreen from '../screens/AddEditCourseScreen';

const Tab = createBottomTabNavigator<RootTabParamList>();
const HomeStack = createStackNavigator<HomeStackParamList>();
const ToDoStack = createStackNavigator<ToDoStackParamList>();
const CalendarStack = createStackNavigator<CalendarStackParamList>();
const SettingsStack = createStackNavigator<SettingsStackParamList>();

// Stack Navigators
function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen 
        name="Timer" 
        component={TimerScreen}
        options={{ presentation: 'modal' }}
      />
    </HomeStack.Navigator>
  );
}

function ToDoStackNavigator() {
  return (
    <ToDoStack.Navigator screenOptions={{ headerShown: false }}>
      <ToDoStack.Screen name="Assignments" component={AssignmentsScreen} />
      <ToDoStack.Screen 
        name="AddEditAssignment" 
        component={AddEditAssignmentScreen}
        options={{ presentation: 'modal' }}
      />
    </ToDoStack.Navigator>
  );
}

function CalendarStackNavigator() {
  return (
    <CalendarStack.Navigator screenOptions={{ headerShown: false }}>
      <CalendarStack.Screen name="Calendar" component={CalendarScreen} />
      <CalendarStack.Screen name="DayView" component={DayViewScreen} />
      <CalendarStack.Screen name="WeekView" component={WeekViewScreen} />
    </CalendarStack.Navigator>
  );
}

function SettingsStackNavigator() {
  return (
    <SettingsStack.Navigator screenOptions={{ headerShown: false }}>
      <SettingsStack.Screen name="Settings" component={SettingsScreen} />
      <SettingsStack.Screen name="CoursesList" component={CoursesListScreen} />
      <SettingsStack.Screen 
        name="AddEditCourse" 
        component={AddEditCourseScreen}
        options={{ presentation: 'modal' }}
      />
    </SettingsStack.Navigator>
  );
}

// Custom Tab Bar
interface TabBarButtonProps {
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  isFocused: boolean;
  onPress: () => void;
  theme: ThemeColors;
}

const TabBarButton: React.FC<TabBarButtonProps> = ({ label, icon, isFocused, onPress, theme }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.tabButton}
      activeOpacity={0.7}
      accessibilityLabel={`${label} tab`}
      accessibilityRole="tab"
      accessibilityState={{ selected: isFocused }}
    >
      <MaterialIcons
        name={icon}
        size={26}
        color={isFocused ? (theme.isDark ? theme.primaryAccent : theme.charcoal) : theme.textSecondary}
        style={{ opacity: isFocused ? 1 : 0.6 }}
      />
      <Text
        style={[
          styles.tabLabel,
          {
            color: isFocused ? (theme.isDark ? theme.primaryAccent : theme.charcoal) : theme.textSecondary,
            opacity: isFocused ? 1 : 0.6,
          },
        ]}
      >
        {label}
      </Text>
      {isFocused && <View style={[styles.indicator, { backgroundColor: theme.isDark ? theme.primaryAccent : theme.charcoal }]} />}
    </TouchableOpacity>
  );
};

function CustomTabBar({ state, descriptors, navigation }: any) {
  const theme = useTheme();
  const glassStyles = getGlassStyles(theme);

  return (
    <View style={[styles.tabBar, glassStyles.nav]}>
      <View style={styles.tabBarContent}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          let icon: keyof typeof MaterialIcons.glyphMap = 'home';
          let label = '';

          switch (route.name) {
            case 'HomeTab':
              icon = 'home';
              label = 'Home';
              break;
            case 'ToDoTab':
              icon = 'assignment';
              label = 'To-Do';
              break;
            case 'CalendarTab':
              icon = 'calendar-today';
              label = 'Calendar';
              break;
            case 'StatisticsTab':
              icon = 'bar-chart';
              label = 'Stats';
              break;
            case 'SettingsTab':
              icon = 'settings';
              label = 'Settings';
              break;
          }

          return (
            <TabBarButton
              key={route.key}
              label={label}
              icon={icon}
              isFocused={isFocused}
              onPress={onPress}
              theme={theme}
            />
          );
        })}
      </View>
    </View>
  );
}

// Main Tab Navigator
export function BottomTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="HomeTab" component={HomeStackNavigator} />
      <Tab.Screen name="ToDoTab" component={ToDoStackNavigator} />
      <Tab.Screen name="CalendarTab" component={CalendarStackNavigator} />
      <Tab.Screen name="StatisticsTab" component={StatisticsScreen} />
      <Tab.Screen name="SettingsTab" component={SettingsStackNavigator} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    paddingTop: 8,
  },
  tabBarContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
    minWidth: 60,
  },
  tabLabel: {
    ...typography.labelSmall,
    fontSize: 10,
    marginTop: 2,
  },
  indicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
  },
});
