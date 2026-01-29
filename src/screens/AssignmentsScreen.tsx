import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SectionList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { GlassCard } from '../components/GlassCard';
import { useAssignments } from '../context/AssignmentContext';
import { useCourses } from '../context/CourseContext';
import { useTheme } from '../context/ThemeContext';
import { ThemeColors, priorityColors as commonPriorityColors } from '../theme/colors';
import { typography } from '../theme/typography';
import { getCommonStyles, spacing } from '../theme/styles';
import { ToDoStackParamList } from '../navigation/types';
import { getDueDateText } from '../utils/dateHelpers';
import { Assignment } from '../types/assignment';

type AssignmentsScreenNavigationProp = StackNavigationProp<ToDoStackParamList, 'Assignments'>;

const AssignmentsScreen = () => {
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const styles = useMemo(() => createStyles(theme), [theme]);
  const navigation = useNavigation<AssignmentsScreenNavigationProp>();
  const { assignments, toggleComplete } = useAssignments();
  const { getCourseById } = useCourses();
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const filteredAssignments = useMemo(() => {
    let filtered = assignments;
    
    if (filter === 'pending') {
      filtered = assignments.filter(a => !a.completed);
    } else if (filter === 'completed') {
      filtered = assignments.filter(a => a.completed);
    }

    return filtered.sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      return a.dueDate.getTime() - b.dueDate.getTime();
    });
  }, [assignments, filter]);

  const sections = useMemo(() => {
    const now = new Date();
    const twoDaysFromNow = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
    
    const pending = filteredAssignments.filter(a => !a.completed);
    const completed = filteredAssignments.filter(a => a.completed);
    
    const data = [];
    
    const dueSoonItems = pending.filter(a => a.dueDate <= twoDaysFromNow);
    if (dueSoonItems.length > 0) {
      data.push({ title: 'DUE SOON', data: dueSoonItems });
    }
    
    const laterItems = pending.filter(a => a.dueDate > twoDaysFromNow);
    if (laterItems.length > 0) {
      data.push({ title: 'LATER', data: laterItems });
    }
    
    if (filter === 'all' && completed.length > 0) {
      data.push({ title: 'COMPLETED', data: completed });
    } else if (filter === 'completed' && completed.length > 0) {
      data.push({ title: 'COMPLETED', data: completed });
    }
    
    return data;
  }, [filteredAssignments, filter]);

  const completedCount = assignments.filter(a => a.completed).length;
  const totalCount = assignments.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const getPriorityColor = useCallback((priority: string) => {
    switch (priority) {
      case 'high': return commonPriorityColors.priorityHigh;
      case 'medium': return commonPriorityColors.priorityMedium;
      default: return commonPriorityColors.priorityLow;
    }
  }, []);

  const renderAssignmentItem = useCallback(({ item: assignment }: { item: Assignment }) => {
    const course = getCourseById(assignment.courseId);
    const priorityColor = getPriorityColor(assignment.priority);

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('AddEditAssignment', { assignmentId: assignment.id })}
        activeOpacity={0.7}
        accessibilityLabel={`Edit assignment: ${assignment.title}`}
        accessibilityRole="button"
      >
        <GlassCard style={[styles.assignmentCard, assignment.completed && styles.completedCard]}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => toggleComplete(assignment.id)}
            activeOpacity={0.7}
            accessibilityLabel={assignment.completed ? "Mark as incomplete" : "Mark as complete"}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: assignment.completed }}
          >
            <View style={[
              styles.checkboxInner,
              assignment.completed && styles.checkboxChecked
            ]}>
              {assignment.completed && (
                <MaterialIcons name="check" size={16} color={theme.white} />
              )}
            </View>
          </TouchableOpacity>

          <View style={styles.assignmentContent}>
            <View style={styles.assignmentHeader}>
              <View style={[styles.priorityDot, { backgroundColor: priorityColor }]} />
              <Text style={[
                styles.assignmentTitle,
                assignment.completed && styles.completedText
              ]}>
                {assignment.title}
              </Text>
            </View>
            <View style={styles.assignmentMeta}>
              <Text style={[styles.courseCode, { color: course?.color || theme.primaryAccent }]}>
                {course?.code || 'Unknown'}
              </Text>
              <Text style={styles.dueDate}>
                {assignment.completed ? 'Completed' : getDueDateText(assignment.dueDate)}
              </Text>
            </View>
          </View>
        </GlassCard>
      </TouchableOpacity>
    );
  }, [getCourseById, getPriorityColor, navigation, toggleComplete, theme, styles]);

  const ListHeader = useMemo(() => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <Text style={styles.title}>Assignments</Text>
        <TouchableOpacity style={styles.searchButton} accessibilityLabel="Search assignments" accessibilityRole="button">
          <MaterialIcons name="search" size={20} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Progress */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>DAILY COMPLETION</Text>
          <Text style={styles.progressCount}>{completedCount} / {totalCount}</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${completionPercentage}%` }]} />
        </View>
      </View>
    </View>
  ), [completedCount, totalCount, completionPercentage, theme, styles]);

  const EmptyState = useMemo(() => (
    <GlassCard style={styles.emptyState}>
      <MaterialIcons name="assignment-turned-in" size={64} color={theme.textSecondary} style={{ opacity: 0.3 }} />
      <Text style={styles.emptyStateText}>No assignments yet</Text>
      <Text style={styles.emptyStateSubtext}>Tap + to add your first assignment</Text>
    </GlassCard>
  ), [theme, styles]);

  return (
    <View style={commonStyles.container}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderAssignmentItem}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionTitle}>{title}</Text>
        )}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={EmptyState}
        contentContainerStyle={styles.contentContainer}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
      />

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddEditAssignment', {})}
        activeOpacity={0.8}
        accessibilityLabel="Add new assignment"
        accessibilityRole="button"
      >
        <MaterialIcons name="add" size={28} color={theme.white} />
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (theme: ThemeColors) => StyleSheet.create({
  contentContainer: {
    paddingTop: spacing.xl + 16,
    paddingHorizontal: spacing.lg,
    paddingBottom: 140,
  },
  header: {
    marginBottom: spacing.xl,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h2,
    color: theme.textPrimary,
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : theme.white,
  },
  progressSection: {
    marginTop: spacing.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: spacing.sm,
  },
  progressLabel: {
    ...typography.label,
    color: theme.textSecondary,
  },
  progressCount: {
    ...typography.smallMedium,
    color: theme.textSecondary,
    fontSize: 12,
  },
  progressBar: {
    height: 1.5,
    backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
    borderRadius: 1,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.primaryAccent,
  },
  sectionTitle: {
    ...typography.label,
    color: theme.textSecondary,
    marginBottom: spacing.md,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.xs,
  },
  assignmentCard: {
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  completedCard: {
    opacity: 0.5,
  },
  checkbox: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -spacing.xs,
  },
  checkboxInner: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: theme.textSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.5,
  },
  checkboxChecked: {
    backgroundColor: theme.primaryAccent,
    borderColor: theme.primaryAccent,
    opacity: 1,
  },
  assignmentContent: {
    flex: 1,
  },
  assignmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  assignmentTitle: {
    ...typography.bodyMedium,
    color: theme.textPrimary,
    fontSize: 15,
    flex: 1,
  },
  completedText: {
    textDecorationLine: 'line-through',
  },
  assignmentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  courseCode: {
    ...typography.labelSmall,
    fontSize: 10,
  },
  dueDate: {
    ...typography.tiny,
    color: theme.textSecondary,
    fontSize: 11,
  },
  emptyState: {
    padding: spacing.xl,
    alignItems: 'center',
    marginTop: spacing.xxl,
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
  fab: {
    position: 'absolute',
    bottom: 120,
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.isDark ? theme.primaryAccent : theme.charcoal,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default AssignmentsScreen;
