import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { GlassCard } from '../components/GlassCard';
import { useAssignments } from '../context/AssignmentContext';
import { useCourses } from '../context/CourseContext';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { commonStyles, spacing } from '../theme/styles';
import { ToDoStackParamList } from '../navigation/types';
import { getDueDateText } from '../utils/dateHelpers';
import { Assignment } from '../types/assignment';

type AssignmentsScreenNavigationProp = StackNavigationProp<ToDoStackParamList, 'Assignments'>;

const AssignmentsScreen = () => {
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

  const { dueSoon, later } = useMemo(() => {
    const now = new Date();
    const twoDaysFromNow = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
    
    const pending = filteredAssignments.filter(a => !a.completed);
    
    return {
      dueSoon: pending.filter(a => a.dueDate <= twoDaysFromNow),
      later: pending.filter(a => a.dueDate > twoDaysFromNow),
    };
  }, [filteredAssignments]);

  const completedCount = assignments.filter(a => a.completed).length;
  const totalCount = assignments.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return colors.priorityHigh;
      case 'medium': return colors.priorityMedium;
      default: return colors.priorityLow;
    }
  };

  const renderAssignmentItem = (assignment: Assignment) => {
    const course = getCourseById(assignment.courseId);
    const priorityColor = getPriorityColor(assignment.priority);

    return (
      <TouchableOpacity
        key={assignment.id}
        onPress={() => navigation.navigate('AddEditAssignment', { assignmentId: assignment.id })}
        activeOpacity={0.7}
      >
        <GlassCard style={[styles.assignmentCard, assignment.completed && styles.completedCard]}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => toggleComplete(assignment.id)}
            activeOpacity={0.7}
          >
            <View style={[
              styles.checkboxInner,
              assignment.completed && styles.checkboxChecked
            ]}>
              {assignment.completed && (
                <MaterialIcons name="check" size={16} color={colors.white} />
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
              <Text style={[styles.courseCode, { color: course?.color || colors.primaryAccent }]}>
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
  };

  return (
    <View style={commonStyles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.title}>Assignments</Text>
            <TouchableOpacity style={styles.searchButton}>
              <MaterialIcons name="search" size={20} color={colors.textSecondary} />
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

        {/* Due Soon Section */}
        {dueSoon.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>DUE SOON</Text>
            <View style={styles.assignmentsList}>
              {dueSoon.map(renderAssignmentItem)}
            </View>
          </View>
        )}

        {/* Later Section */}
        {later.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>LATER</Text>
            <View style={styles.assignmentsList}>
              {later.map(renderAssignmentItem)}
            </View>
          </View>
        )}

        {/* Completed Section */}
        {filter === 'all' && completedCount > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>COMPLETED</Text>
            <View style={styles.assignmentsList}>
              {filteredAssignments.filter(a => a.completed).map(renderAssignmentItem)}
            </View>
          </View>
        )}

        {/* Empty State */}
        {filteredAssignments.length === 0 && (
          <GlassCard style={styles.emptyState}>
            <MaterialIcons name="assignment-turned-in" size={64} color={colors.labelGray} style={{ opacity: 0.3 }} />
            <Text style={styles.emptyStateText}>No assignments yet</Text>
            <Text style={styles.emptyStateSubtext}>Tap + to add your first assignment</Text>
          </GlassCard>
        )}
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddEditAssignment', {})}
        activeOpacity={0.8}
      >
        <MaterialIcons name="add" size={28} color={colors.white} />
      </TouchableOpacity>
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
    color: colors.charcoal,
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.white,
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
    color: colors.textSecondary,
  },
  progressCount: {
    ...typography.smallMedium,
    color: colors.textSecondary,
    fontSize: 12,
  },
  progressBar: {
    height: 1.5,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 1,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accentBlue,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  assignmentsList: {
    gap: spacing.sm,
  },
  assignmentCard: {
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  completedCard: {
    opacity: 0.5,
  },
  checkbox: {
    padding: spacing.xs,
  },
  checkboxInner: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: colors.labelGray,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.5,
  },
  checkboxChecked: {
    backgroundColor: colors.accentBlue,
    borderColor: colors.accentBlue,
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
    color: colors.charcoal,
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
    color: colors.textSecondary,
    fontSize: 11,
  },
  emptyState: {
    padding: spacing.xl,
    alignItems: 'center',
    marginTop: spacing.xxl,
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
  },
  fab: {
    position: 'absolute',
    bottom: 120,
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.charcoal,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default AssignmentsScreen;

