import React, { useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { GlassCard } from '../components/GlassCard';
import { useCourses } from '../context/CourseContext';
import { useStudySessions } from '../context/StudySessionContext';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { commonStyles, spacing } from '../theme/styles';
import { formatDuration, formatDurationLong } from '../utils/timeHelpers';
import { formatDate, isSameDay } from '../utils/dateHelpers';

const screenWidth = Dimensions.get('window').width;

const StatisticsScreen = () => {
  const { courses } = useCourses();
  const { sessions, getTotalStudyTime, getWeeklyStudyTime } = useStudySessions();

  const totalTime = getTotalStudyTime();
  const weeklyTime = getWeeklyStudyTime();

  // Study time by course
  const studyByCourse = useMemo(() => {
    const courseMap: { [key: string]: number } = {};
    
    sessions.forEach((session) => {
      if (courseMap[session.courseId]) {
        courseMap[session.courseId] += session.duration;
      } else {
        courseMap[session.courseId] = session.duration;
      }
    });

    return Object.entries(courseMap)
      .map(([courseId, duration]) => {
        const course = courses.find((c) => c.id === courseId);
        return {
          courseId,
          courseName: course?.code || 'Unknown',
          courseColor: course?.color || colors.primaryAccent,
          duration,
        };
      })
      .sort((a, b) => b.duration - a.duration);
  }, [sessions, courses]);

  // Get last 7 days of study time
  const weeklyData = useMemo(() => {
    const days = [];
    const today = new Date();
    
    // Group sessions by date first for better performance
    const sessionMap: { [key: string]: number } = {};
    sessions.forEach(session => {
      const dateString = new Date(session.date).toISOString().split('T')[0];
      sessionMap[dateString] = (sessionMap[dateString] || 0) + session.duration;
    });

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const dateString = date.toISOString().split('T')[0];
      const dayName = formatDate(date, 'EEE');
      
      const dayTotal = sessionMap[dateString] || 0;

      days.push({
        day: dayName,
        hours: dayTotal / 3600, // Convert to hours
      });
    }
    
    return days;
  }, [sessions]);

  // Pie chart data
  const pieChartData = useMemo(() => studyByCourse.slice(0, 5).map((item) => ({
    name: item.courseName,
    population: item.duration / 60, // Convert to minutes
    color: item.courseColor,
    legendFontColor: colors.labelGray,
    legendFontSize: 12,
  })), [studyByCourse]);

  // Bar chart data
  const barChartData = useMemo(() => ({
    labels: weeklyData.map((d) => d.day),
    datasets: [
      {
        data: weeklyData.map((d) => Math.max(d.hours, 0.1)), // Minimum 0.1 to show bar
      },
    ],
  }), [weeklyData]);

  const chartConfig = {
    backgroundColor: colors.white,
    backgroundGradientFrom: colors.white,
    backgroundGradientTo: colors.white,
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(19, 164, 236, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: colors.primaryAccent,
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: 'rgba(0, 0, 0, 0.05)',
    },
  };

  const weeklyPercentageChange = useMemo(() => {
    // Calculate percentage change from previous week
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    
    const previousWeekTime = sessions
      .filter((s) => {
        const sessionDate = new Date(s.date);
        return sessionDate >= twoWeeksAgo && sessionDate < oneWeekAgo;
      })
      .reduce((sum, s) => sum + s.duration, 0);
    
    if (previousWeekTime === 0) return weeklyTime > 0 ? 100 : 0;
    
    return Math.round(((weeklyTime - previousWeekTime) / previousWeekTime) * 100);
  }, [sessions, weeklyTime]);

  const recentSessions = useMemo(() => {
    return sessions
      .slice()
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 10);
  }, [sessions]);

  const renderSessionItem = useCallback(({ item: session }: { item: any }) => {
    const course = courses.find((c) => c.id === session.courseId);
    return (
      <GlassCard key={session.id} style={styles.sessionCard}>
        <View 
          style={[styles.sessionColorBar, { backgroundColor: course?.color || colors.primaryAccent }]} 
          accessibilityLabel={`Course color for ${course?.code || 'Unknown'}`}
        />
        <View style={styles.sessionContent}>
          <View style={styles.sessionHeader}>
            <Text style={styles.sessionCourse}>{course?.code || 'Unknown'}</Text>
            <Text style={styles.sessionDuration} accessibilityLabel={`Duration: ${formatDurationLong(session.duration)}`}>
              {formatDurationLong(session.duration)}
            </Text>
          </View>
          <Text style={styles.sessionDate}>{formatDate(session.date, 'MMM dd, yyyy')}</Text>
          {session.notes && (
            <Text style={styles.sessionNotes} numberOfLines={2}>{session.notes}</Text>
          )}
        </View>
      </GlassCard>
    );
  }, [courses]);

  return (
    <View style={commonStyles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header} accessibilityRole="header">
          <Text style={styles.subtitle}>TOTAL STUDY TIME</Text>
          <Text style={styles.massiveTime} accessibilityLabel={`Total study time: ${formatDuration(totalTime)}`}>
            {formatDuration(totalTime)}
          </Text>
          <View style={styles.changeIndicator} accessibilityLabel={`${Math.abs(weeklyPercentageChange)}% ${weeklyPercentageChange >= 0 ? 'increase' : 'decrease'} from last week`}>
            <MaterialIcons 
              name={weeklyPercentageChange >= 0 ? 'trending-up' : 'trending-down'} 
              size={18} 
              color={weeklyPercentageChange >= 0 ? colors.success : colors.error} 
            />
            <Text style={[
              styles.changeText,
              { color: weeklyPercentageChange >= 0 ? colors.success : colors.error }
            ]}>
              {Math.abs(weeklyPercentageChange)}% {weeklyPercentageChange >= 0 ? 'increase' : 'decrease'}
            </Text>
          </View>
        </View>

        {/* Focus Distribution */}
        {pieChartData.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Focus Distribution</Text>
              <Text style={styles.sectionSubtitle}>This Week</Text>
            </View>
            <GlassCard style={styles.chartCard}>
              <View accessibilityLabel="Pie chart showing study time distribution by course">
                <PieChart
                  data={pieChartData}
                  width={screenWidth - spacing.lg * 4}
                  height={200}
                  chartConfig={chartConfig}
                  accessor="population"
                  backgroundColor="transparent"
                  paddingLeft="0"
                  absolute
                />
              </View>
            </GlassCard>
          </View>
        )}

        {/* Activity Trend */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Activity Trend</Text>
            <Text style={styles.sectionSubtitle}>Last 7 Days</Text>
          </View>
          <GlassCard style={styles.chartCard}>
            <View accessibilityLabel="Bar chart showing study activity trend over the last 7 days">
              <BarChart
                data={barChartData}
                width={screenWidth - spacing.lg * 4}
                height={200}
                yAxisLabel=""
                yAxisSuffix="h"
                chartConfig={chartConfig}
                style={styles.barChart}
                fromZero
                showBarTops={false}
              />
            </View>
          </GlassCard>
        </View>

        {/* Study Sessions List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Sessions</Text>
          <View style={styles.sessionsList}>
            {sessions.length === 0 ? (
              <GlassCard style={styles.emptyState}>
                <MaterialIcons name="timer-off" size={48} color={colors.labelGray} style={{ opacity: 0.3 }} />
                <Text style={styles.emptyStateText}>No study sessions yet</Text>
                <Text style={styles.emptyStateSubtext}>Start a timer to track your study time</Text>
              </GlassCard>
            ) : (
              <FlatList
                data={recentSessions}
                renderItem={renderSessionItem}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                contentContainerStyle={{ gap: spacing.sm }}
                removeClippedSubviews={true}
                initialNumToRender={5}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: spacing.xl + 16,
    paddingHorizontal: spacing.lg,
    paddingBottom: 120,
  },
  header: {
    marginBottom: spacing.xl,
  },
  subtitle: {
    ...typography.label,
    color: colors.textLight,
    marginBottom: spacing.sm,
  },
  massiveTime: {
    ...typography.massive,
    color: colors.charcoal,
    marginBottom: spacing.xs,
  },
  changeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  changeText: {
    ...typography.bodyMedium,
    fontSize: 14,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.charcoal,
    fontSize: 17,
  },
  sectionSubtitle: {
    ...typography.smallMedium,
    color: colors.textLight,
    fontSize: 13,
  },
  chartCard: {
    padding: spacing.md,
    alignItems: 'center',
  },
  barChart: {
    borderRadius: 16,
  },
  sessionsList: {
    gap: spacing.sm,
  },
  sessionCard: {
    padding: 0,
    overflow: 'hidden',
  },
  sessionColorBar: {
    width: 4,
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  sessionContent: {
    padding: spacing.md,
    paddingLeft: spacing.md + 8,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  sessionCourse: {
    ...typography.bodySemibold,
    color: colors.charcoal,
  },
  sessionDuration: {
    ...typography.bodyMedium,
    color: colors.primaryAccent,
  },
  sessionDate: {
    ...typography.small,
    color: colors.labelGray,
    marginBottom: spacing.xs,
  },
  sessionNotes: {
    ...typography.small,
    color: colors.labelGray,
    fontStyle: 'italic',
  },
  emptyState: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyStateText: {
    ...typography.bodySemibold,
    color: colors.labelGray,
    marginTop: spacing.md,
  },
  emptyStateSubtext: {
    ...typography.small,
    color: colors.labelGray,
    opacity: 0.7,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
});

export default StatisticsScreen;

