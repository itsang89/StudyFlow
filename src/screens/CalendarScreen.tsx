import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { GlassCard } from '../components/GlassCard';
import { AgendaItem } from '../components/AgendaItem';
import { useCourses } from '../context/CourseContext';
import { useAssignments } from '../context/AssignmentContext';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { commonStyles, spacing } from '../theme/styles';
import { CalendarStackParamList } from '../navigation/types';
import { getDueDateText, isSameDay, formatDate } from '../utils/dateHelpers';

type CalendarScreenNavigationProp = StackNavigationProp<CalendarStackParamList, 'Calendar'>;

const CalendarScreen = () => {
  const navigation = useNavigation<CalendarScreenNavigationProp>();
  const { courses } = useCourses();
  const { assignments } = useAssignments();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filter, setFilter] = useState<'all' | 'classes' | 'assignments'>('all');

  // Get events for selected date
  const selectedDateEvents = useMemo(() => {
    const dayOfWeek = selectedDate.getDay();
    const events: any[] = [];

    // Get classes for this day
    if (filter === 'all' || filter === 'classes') {
      courses.forEach((course) => {
        course.schedule.forEach((schedule) => {
          if (schedule.day === dayOfWeek) {
            events.push({
              type: 'class',
              id: `class-${course.id}-${schedule.day}-${schedule.startTime}`,
              course,
              schedule,
              time: schedule.startTime,
            });
          }
        });
      });
    }

    // Get assignments for this day
    if (filter === 'all' || filter === 'assignments') {
      const dayAssignments = assignments.filter(
        (assignment) => !assignment.completed && isSameDay(assignment.dueDate, selectedDate)
      );

      dayAssignments.forEach((assignment) => {
        const course = courses.find((c) => c.id === assignment.courseId);
        if (course) {
          events.push({
            type: 'assignment',
            id: `assignment-${assignment.id}`,
            assignment,
            course,
            time: assignment.dueDate.toISOString(),
          });
        }
      });
    }

    return events.sort((a, b) => a.time.localeCompare(b.time));
  }, [selectedDate, courses, assignments, filter]);

  // Get marked dates for calendar
  const markedDates = useMemo(() => {
    const marked: any = {};

    // Get all dates that have assignments (more efficient to group assignments first)
    const assignmentDates = new Set();
    assignments.forEach(assignment => {
      if (!assignment.completed) {
        assignmentDates.add(assignment.dueDate.toISOString().split('T')[0]);
      }
    });

    // Get all days of week that have classes
    const classDays = new Set();
    courses.forEach(course => {
      course.schedule.forEach(s => classDays.add(s.day));
    });

    // Mark days with events (limit to a reasonable range)
    const today = new Date();
    const startDate = new Date(today);
    startDate.setMonth(today.getMonth() - 1); // 1 month ago
    
    for (let i = 0; i < 120; i++) {
      const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      const dateString = date.toISOString().split('T')[0];
      const dayOfWeek = date.getDay();

      const hasClasses = classDays.has(dayOfWeek);
      const hasAssignments = assignmentDates.has(dateString);

      if (hasClasses || hasAssignments) {
        marked[dateString] = {
          marked: true,
          dotColor: colors.primaryAccent,
        };
      }
    }

    // Mark selected date
    const selectedDateString = selectedDate.toISOString().split('T')[0];
    marked[selectedDateString] = {
      ...marked[selectedDateString],
      selected: true,
      selectedColor: colors.charcoal,
    };

    return marked;
  }, [courses, assignments, selectedDate]);

  const handleDayPress = useCallback((day: DateData) => {
    setSelectedDate(new Date(day.timestamp));
  }, []);

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
          color={colors.warning}
          icon="assignment-late"
          badge={{
            text: getDueDateText(item.assignment.dueDate),
            color: colors.warning,
          }}
        />
      );
    }
  }, []);

  return (
    <View style={commonStyles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Calendar</Text>
          <TouchableOpacity 
            style={styles.weekViewButton} 
            onPress={() => navigation.navigate('WeekView')}
            accessibilityLabel="View week view"
            accessibilityRole="button"
          >
            <MaterialIcons name="view-week" size={20} color={colors.primaryAccent} />
          </TouchableOpacity>
        </View>

        {/* Calendar */}
        <GlassCard style={styles.calendarCard}>
          <Calendar
            current={selectedDate.toISOString().split('T')[0]}
            onDayPress={handleDayPress}
            markedDates={markedDates}
            theme={{
              backgroundColor: 'transparent',
              calendarBackground: 'transparent',
              textSectionTitleColor: colors.labelGray,
              selectedDayBackgroundColor: colors.charcoal,
              selectedDayTextColor: colors.white,
              todayTextColor: colors.primaryAccent,
              dayTextColor: colors.charcoal,
              textDisabledColor: colors.labelGray,
              dotColor: colors.primaryAccent,
              selectedDotColor: colors.white,
              arrowColor: colors.charcoal,
              monthTextColor: colors.charcoal,
              textDayFontFamily: 'System',
              textMonthFontFamily: 'System',
              textDayHeaderFontFamily: 'System',
              textDayFontWeight: '400',
              textMonthFontWeight: '600',
              textDayHeaderFontWeight: '600',
              textDayFontSize: 14,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 11,
            }}
          />
        </GlassCard>

        {/* Filter Buttons */}
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>SHOW</Text>
          <View style={styles.filterButtons}>
            <TouchableOpacity
              style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
              onPress={() => setFilter('all')}
              activeOpacity={0.7}
              accessibilityLabel="Show all events"
              accessibilityRole="button"
              accessibilityState={{ selected: filter === 'all' }}
            >
              <Text style={[styles.filterButtonText, filter === 'all' && styles.filterButtonTextActive]}>
                All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filter === 'classes' && styles.filterButtonActive]}
              onPress={() => setFilter('classes')}
              activeOpacity={0.7}
              accessibilityLabel="Show classes only"
              accessibilityRole="button"
              accessibilityState={{ selected: filter === 'classes' }}
            >
              <Text style={[styles.filterButtonText, filter === 'classes' && styles.filterButtonTextActive]}>
                Classes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filter === 'assignments' && styles.filterButtonActive]}
              onPress={() => setFilter('assignments')}
              activeOpacity={0.7}
              accessibilityLabel="Show assignments only"
              accessibilityRole="button"
              accessibilityState={{ selected: filter === 'assignments' }}
            >
              <Text style={[styles.filterButtonText, filter === 'assignments' && styles.filterButtonTextActive]}>
                Assignments
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Selected Day Events */}
        <View style={styles.eventsSection}>
          <Text style={styles.eventsTitle}>{formatDate(selectedDate, 'EEEE, MMMM d')}</Text>
          
          <View style={styles.eventsList}>
            {selectedDateEvents.length === 0 ? (
              <GlassCard style={styles.emptyState}>
                <MaterialIcons name="event-available" size={48} color={colors.labelGray} style={{ opacity: 0.3 }} />
                <Text style={styles.emptyStateText}>No events on this day</Text>
              </GlassCard>
            ) : (
              <FlatList
                data={selectedDateEvents}
                renderItem={renderAgendaItem}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h2,
    color: colors.charcoal,
  },
  weekViewButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.white,
  },
  calendarCard: {
    padding: spacing.md,
    marginBottom: spacing.xl,
  },
  filterSection: {
    marginBottom: spacing.xl,
  },
  filterLabel: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  filterButton: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  filterButtonActive: {
    backgroundColor: colors.charcoal,
    borderColor: colors.charcoal,
  },
  filterButtonText: {
    ...typography.bodyMedium,
    color: colors.charcoal,
  },
  filterButtonTextActive: {
    color: colors.white,
  },
  eventsSection: {
    marginBottom: spacing.xl,
  },
  eventsTitle: {
    ...typography.h4,
    color: colors.charcoal,
    marginBottom: spacing.md,
  },
  eventsList: {
    gap: spacing.sm,
  },
  emptyState: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyStateText: {
    ...typography.bodyMedium,
    color: colors.labelGray,
    marginTop: spacing.md,
  },
});

export default CalendarScreen;

