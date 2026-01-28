import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { GlassCard } from '../components/GlassCard';
import { useCourses } from '../context/CourseContext';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { commonStyles, spacing } from '../theme/styles';
import { SettingsStackParamList } from '../navigation/types';
import { getDayShortName } from '../utils/dateHelpers';

type CoursesListScreenNavigationProp = StackNavigationProp<SettingsStackParamList, 'CoursesList'>;

const CoursesListScreen = () => {
  const navigation = useNavigation<CoursesListScreenNavigationProp>();
  const { courses } = useCourses();

  return (
    <View style={commonStyles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.charcoal} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Courses</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {courses.length === 0 ? (
          <GlassCard style={styles.emptyState}>
            <MaterialIcons name="school" size={64} color={colors.labelGray} style={{ opacity: 0.3 }} />
            <Text style={styles.emptyStateText}>No courses yet</Text>
            <Text style={styles.emptyStateSubtext}>Tap + to add your first course</Text>
          </GlassCard>
        ) : (
          <View style={styles.coursesList}>
            {courses.map((course) => (
              <TouchableOpacity
                key={course.id}
                onPress={() => navigation.navigate('AddEditCourse', { courseId: course.id })}
                activeOpacity={0.7}
                accessibilityLabel={`Edit course ${course.code} ${course.name}`}
                accessibilityRole="button"
              >
                <GlassCard style={styles.courseCard}>
                  <View 
                    style={[styles.courseColorBar, { backgroundColor: course.color }]} 
                    accessibilityLabel="Course color"
                  />
                  <View style={styles.courseContent}>
                    <View style={styles.courseHeader}>
                      <View style={styles.courseInfo}>
                        <Text style={styles.courseCode}>{course.code}</Text>
                        <Text style={styles.courseName}>{course.name}</Text>
                      </View>
                      <MaterialIcons name="chevron-right" size={24} color={colors.labelGray} />
                    </View>
                    
                    {course.instructor && (
                      <View style={styles.courseDetail}>
                        <MaterialIcons name="person" size={16} color={colors.labelGray} />
                        <Text style={styles.courseDetailText}>{course.instructor}</Text>
                      </View>
                    )}
                    
                    {course.location && (
                      <View style={styles.courseDetail}>
                        <MaterialIcons name="place" size={16} color={colors.labelGray} />
                        <Text style={styles.courseDetailText}>{course.location}</Text>
                      </View>
                    )}
                    
                    {course.schedule.length > 0 && (
                      <View style={styles.scheduleChips}>
                        {course.schedule.map((schedule, index) => (
                          <View key={index} style={styles.scheduleChip} accessibilityLabel={`Class at ${schedule.startTime}`}>
                            <Text style={styles.scheduleChipText}>
                              {getDayShortName(schedule.day)} {schedule.startTime}
                            </Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                </GlassCard>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddEditCourse', {})}
        activeOpacity={0.8}
        accessibilityLabel="Add new course"
        accessibilityRole="button"
      >
        <MaterialIcons name="add" size={28} color={colors.white} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl + 16,
    paddingBottom: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...typography.h4,
    color: colors.charcoal,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 120,
  },
  coursesList: {
    gap: spacing.md,
  },
  courseCard: {
    padding: 0,
    overflow: 'hidden',
  },
  courseColorBar: {
    width: 4,
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  courseContent: {
    padding: spacing.md,
    paddingLeft: spacing.md + 8,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  courseInfo: {
    flex: 1,
  },
  courseCode: {
    ...typography.bodySemibold,
    color: colors.charcoal,
    fontSize: 17,
  },
  courseName: {
    ...typography.body,
    color: colors.labelGray,
    marginTop: 2,
  },
  courseDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  courseDetailText: {
    ...typography.small,
    color: colors.labelGray,
  },
  scheduleChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  scheduleChip: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 8,
  },
  scheduleChipText: {
    ...typography.tiny,
    color: colors.labelGray,
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
    bottom: 100,
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

export default CoursesListScreen;

