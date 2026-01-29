import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { GlassCard } from '../components/GlassCard';
import { AgendaItem } from '../components/AgendaItem';
import { useCourses } from '../context/CourseContext';
import { useAssignments } from '../context/AssignmentContext';
import { useTheme } from '../context/ThemeContext';
import { ThemeColors } from '../theme/colors';
import { typography } from '../theme/typography';
import { getCommonStyles, spacing } from '../theme/styles';
import { HomeStackParamList } from '../navigation/types';
import { getDueDateText, isSameDay } from '../utils/dateHelpers';

type HomeScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'Home'>;

const HomeScreen = () => {
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const styles = useMemo(() => createStyles(theme), [theme]);
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { courses } = useCourses();
  const { assignments } = useAssignments();
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [showCoursePicker, setShowCoursePicker] = useState(false);

  // Get today's classes and assignments
  const todayItems = useMemo(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const items: any[] = [];

    // Get today's classes
    courses.forEach((course) => {
      course.schedule.forEach((schedule) => {
        if (schedule.day === dayOfWeek) {
          items.push({
            type: 'class',
            id: `class-${course.id}-${schedule.day}-${schedule.startTime}`,
            course,
            schedule,
            time: schedule.startTime,
          });
        }
      });
    });

    // Get today's assignments
    const todayAssignments = assignments.filter(
      (assignment) => !assignment.completed && isSameDay(assignment.dueDate, today)
    );

    todayAssignments.forEach((assignment) => {
      const course = courses.find((c) => c.id === assignment.courseId);
      if (course) {
        items.push({
          type: 'assignment',
          id: `assignment-${assignment.id}`,
          assignment,
          course,
          time: assignment.dueDate.toISOString(),
        });
      }
    });

    // Sort by time
    return items.sort((a, b) => a.time.localeCompare(b.time));
  }, [courses, assignments]);

  const handleStartSession = useCallback(() => {
    if (selectedCourseId) {
      navigation.navigate('Timer', { courseId: selectedCourseId });
    } else if (courses.length > 0) {
      setShowCoursePicker(true);
    }
  }, [selectedCourseId, courses.length, navigation]);

  const renderAgendaItem = useCallback(({ item }: { item: any }) => {
    if (item.type === 'class') {
      return (
        <AgendaItem
          title={`${item.course.code}: ${item.course.name}`}
          timeRange={`${item.schedule.startTime} - ${item.schedule.endTime}`}
          location={item.course.location}
          color={item.course.color}
          icon="school"
        />
      );
    } else {
      return (
        <AgendaItem
          title={item.assignment.title}
          subtitle={item.course.name}
          color={theme.warning}
          icon="assignment-late"
          badge={{
            text: getDueDateText(item.assignment.dueDate),
            color: theme.warning,
          }}
        />
      );
    }
  }, [theme]);

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);

  return (
    <View style={commonStyles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Good {getTimeOfDay()}</Text>
          <Text style={styles.title}>Ready to Study?</Text>
        </View>

        {/* Start Studying Card */}
        <GlassCard variant="light" style={styles.startCard}>
          <View style={styles.startCardContent}>
            <View style={styles.startCardHeader}>
              <Text style={styles.startCardLabel}>NEXT SESSION</Text>
              <Text style={styles.startCardTitle}>Start Studying</Text>
              <Text style={styles.startCardSubtitle}>Ready to crush your goals today?</Text>
            </View>

            {/* Course Selector */}
            <TouchableOpacity
              style={styles.courseSelector}
              onPress={() => setShowCoursePicker(true)}
              activeOpacity={0.7}
              accessibilityLabel="Select a course for study session"
              accessibilityRole="button"
            >
              <View style={styles.courseSelectorContent}>
                <View style={styles.courseSelectorIcon}>
                  <MaterialIcons name="menu-book" size={24} color={theme.textPrimary} />
                </View>
                <View style={styles.courseSelectorText}>
                  <Text style={styles.courseSelectorLabel}>SELECT COURSE</Text>
                  <Text style={styles.courseSelectorValue}>
                    {selectedCourse ? `${selectedCourse.code}: ${selectedCourse.name}` : 'Choose a course'}
                  </Text>
                </View>
              </View>
              <MaterialIcons name="expand-more" size={24} color={theme.textSecondary} />
            </TouchableOpacity>

            {/* Start Button */}
            <TouchableOpacity
              style={[styles.startButton, !selectedCourseId && styles.startButtonDisabled]}
              onPress={handleStartSession}
              activeOpacity={0.8}
              disabled={!selectedCourseId}
              accessibilityLabel="Start studying session"
              accessibilityRole="button"
            >
              <MaterialIcons name="play-circle-filled" size={28} color={theme.white} />
              <Text style={styles.startButtonText}>Start Session</Text>
            </TouchableOpacity>
          </View>

          {/* Decorative blur circles */}
          <View style={styles.blurCircle1} />
          <View style={styles.blurCircle2} />
        </GlassCard>

        {/* Today's Agenda */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Schedule</Text>
            <TouchableOpacity onPress={() => navigation.navigate('CalendarTab' as any)} accessibilityLabel="View full calendar" accessibilityRole="button">
              <Text style={styles.viewAll}>View all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.agendaList}>
            {todayItems.length === 0 ? (
              <GlassCard style={styles.emptyState}>
                <MaterialIcons name="event-available" size={48} color={theme.textSecondary} style={{ opacity: 0.3 }} />
                <Text style={styles.emptyStateText}>No classes or assignments today</Text>
                <Text style={styles.emptyStateSubtext}>Enjoy your free day!</Text>
              </GlassCard>
            ) : (
              <FlatList
                data={todayItems}
                renderItem={renderAgendaItem}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                contentContainerStyle={{ gap: spacing.sm }}
                removeClippedSubviews={true}
                initialNumToRender={5}
                maxToRenderPerBatch={10}
                windowSize={5}
              />
            )}
          </View>
        </View>
      </ScrollView>

      {/* Course Picker Modal */}
      <Modal
        visible={showCoursePicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCoursePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Course</Text>
              <TouchableOpacity onPress={() => setShowCoursePicker(false)} accessibilityLabel="Close course picker" accessibilityRole="button">
                <MaterialIcons name="close" size={24} color={theme.textPrimary} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={courses}
              keyExtractor={(item) => item.id}
              renderItem={({ item: course }) => (
                <TouchableOpacity
                  key={course.id}
                  style={styles.courseOption}
                  onPress={() => {
                    setSelectedCourseId(course.id);
                    setShowCoursePicker(false);
                  }}
                  accessibilityLabel={`Select course ${course.code} ${course.name}`}
                  accessibilityRole="button"
                >
                  <View style={[styles.courseColorDot, { backgroundColor: course.color }]} />
                  <View style={styles.courseOptionText}>
                    <Text style={styles.courseOptionTitle}>{course.code}</Text>
                    <Text style={styles.courseOptionSubtitle}>{course.name}</Text>
                  </View>
                  {selectedCourseId === course.id && (
                    <MaterialIcons name="check" size={24} color={theme.primaryAccent} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

function getTimeOfDay(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Morning';
  if (hour < 18) return 'Afternoon';
  return 'Evening';
}

const createStyles = (theme: ThemeColors) => StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: spacing.xl + 16,
    paddingHorizontal: spacing.lg,
    paddingBottom: 120,
  },
  header: {
    marginBottom: spacing.lg,
  },
  greeting: {
    ...typography.label,
    color: theme.primaryAccent,
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.h1,
    color: theme.textPrimary,
  },
  startCard: {
    padding: spacing.lg,
    marginBottom: spacing.xl,
    minHeight: 340,
    overflow: 'hidden',
  },
  startCardContent: {
    position: 'relative',
    zIndex: 10,
  },
  startCardHeader: {
    marginBottom: spacing.xl,
  },
  startCardLabel: {
    ...typography.labelSmall,
    color: theme.primaryAccent,
    marginBottom: spacing.sm,
  },
  startCardTitle: {
    ...typography.h1,
    color: theme.textPrimary,
    marginBottom: spacing.xs,
  },
  startCardSubtitle: {
    ...typography.small,
    color: theme.textSecondary,
  },
  courseSelector: {
    backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.6)',
    borderRadius: 16,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: theme.glassBorder,
  },
  courseSelectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  courseSelectorIcon: {
    backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(26, 28, 30, 0.05)',
    padding: 10,
    borderRadius: 12,
    marginRight: spacing.md,
  },
  courseSelectorText: {
    flex: 1,
  },
  courseSelectorLabel: {
    ...typography.labelSmall,
    color: theme.textSecondary,
    marginBottom: 2,
  },
  courseSelectorValue: {
    ...typography.bodySemibold,
    color: theme.textPrimary,
  },
  startButton: {
    backgroundColor: theme.isDark ? theme.primaryAccent : theme.charcoal,
    borderRadius: 16,
    paddingVertical: spacing.md + 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  startButtonDisabled: {
    opacity: 0.5,
  },
  startButtonText: {
    ...typography.bodySemibold,
    color: theme.isDark ? theme.charcoal : theme.white,
    fontSize: 18,
  },
  blurCircle1: {
    position: 'absolute',
    top: -64,
    right: -64,
    width: 192,
    height: 192,
    backgroundColor: theme.primaryAccent,
    opacity: 0.15,
    borderRadius: 96,
  },
  blurCircle2: {
    position: 'absolute',
    bottom: -64,
    left: -64,
    width: 160,
    height: 160,
    backgroundColor: '#6366F1',
    opacity: 0.1,
    borderRadius: 80,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  sectionTitle: {
    ...typography.h3,
    color: theme.textPrimary,
  },
  viewAll: {
    ...typography.smallMedium,
    color: theme.primaryAccent,
  },
  agendaList: {
    gap: spacing.sm,
  },
  emptyState: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyStateText: {
    ...typography.bodySemibold,
    color: theme.textSecondary,
    marginTop: spacing.md,
  },
  emptyStateSubtext: {
    ...typography.small,
    color: theme.textSecondary,
    opacity: 0.7,
    marginTop: spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.cardBackground,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  modalTitle: {
    ...typography.h3,
    color: theme.textPrimary,
  },
  courseOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  courseColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.md,
  },
  courseOptionText: {
    flex: 1,
  },
  courseOptionTitle: {
    ...typography.bodySemibold,
    color: theme.textPrimary,
  },
  courseOptionSubtitle: {
    ...typography.small,
    color: theme.textSecondary,
    marginTop: 2,
  },
});

export default HomeScreen;
