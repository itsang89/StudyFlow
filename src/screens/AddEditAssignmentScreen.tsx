import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, KeyboardAvoidingView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import { GlassCard } from '../components/GlassCard';
import { useCourses } from '../context/CourseContext';
import { useAssignments } from '../context/AssignmentContext';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { commonStyles, spacing } from '../theme/styles';
import { ToDoStackParamList } from '../navigation/types';
import { AssignmentType, PriorityLevel } from '../types/assignment';
import { formatDateTime } from '../utils/dateHelpers';

type AddEditAssignmentScreenNavigationProp = StackNavigationProp<ToDoStackParamList, 'AddEditAssignment'>;
type AddEditAssignmentScreenRouteProp = RouteProp<ToDoStackParamList, 'AddEditAssignment'>;

const AddEditAssignmentScreen = () => {
  const navigation = useNavigation<AddEditAssignmentScreenNavigationProp>();
  const route = useRoute<AddEditAssignmentScreenRouteProp>();
  const { assignmentId } = route.params;
  
  const { courses } = useCourses();
  const { getAssignmentById, addAssignment, updateAssignment, deleteAssignment } = useAssignments();
  
  const existingAssignment = assignmentId ? getAssignmentById(assignmentId) : null;
  const isEditing = !!existingAssignment;

  const [title, setTitle] = useState(existingAssignment?.title || '');
  const [courseId, setCourseId] = useState(existingAssignment?.courseId || '');
  const [dueDate, setDueDate] = useState(existingAssignment?.dueDate || new Date());
  const [type, setType] = useState<AssignmentType>(existingAssignment?.type || 'assignment');
  const [priority, setPriority] = useState<PriorityLevel>(existingAssignment?.priority || 'medium');
  const [description, setDescription] = useState(existingAssignment?.description || '');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSave = async () => {
    if (!title.trim() || !courseId) {
      alert('Please fill in title and select a course');
      return;
    }

    const assignmentData = {
      title: title.trim(),
      courseId,
      dueDate,
      type,
      priority,
      description: description.trim(),
    };

    if (isEditing && assignmentId) {
      await updateAssignment(assignmentId, assignmentData);
    } else {
      await addAssignment(assignmentData);
    }

    navigation.goBack();
  };

  const handleDelete = async () => {
    if (assignmentId) {
      await deleteAssignment(assignmentId);
      navigation.goBack();
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={commonStyles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.headerButton}
          accessibilityLabel="Cancel and go back"
          accessibilityRole="button"
        >
          <MaterialIcons name="close" size={24} color={colors.charcoal} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEditing ? 'Edit' : 'Add'} Assignment</Text>
        <TouchableOpacity 
          onPress={handleSave} 
          style={styles.headerButton}
          accessibilityLabel="Save assignment"
          accessibilityRole="button"
        >
          <MaterialIcons name="check" size={24} color={colors.primaryAccent} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <View style={styles.field}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Assignment title"
            placeholderTextColor={colors.labelGray}
            value={title}
            onChangeText={setTitle}
            accessibilityLabel="Assignment title input"
          />
        </View>

        {/* Course Selection */}
        <View style={styles.field}>
          <Text style={styles.label}>Course</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.courseSelector}>
            {courses.map(course => (
              <TouchableOpacity
                key={course.id}
                style={[
                  styles.courseChip,
                  courseId === course.id && styles.courseChipSelected
                ]}
                onPress={() => setCourseId(course.id)}
                activeOpacity={0.7}
                accessibilityLabel={`Select course ${course.code}`}
                accessibilityRole="radio"
                accessibilityState={{ checked: courseId === course.id }}
              >
                <View style={[styles.courseChipDot, { backgroundColor: course.color }]} />
                <Text style={[
                  styles.courseChipText,
                  courseId === course.id && styles.courseChipTextSelected
                ]}>
                  {course.code}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Due Date */}
        <View style={styles.field}>
          <Text style={styles.label}>Due Date</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
            activeOpacity={0.7}
            accessibilityLabel="Change due date and time"
            accessibilityRole="button"
          >
            <MaterialIcons name="calendar-today" size={20} color={colors.primaryAccent} />
            <Text style={styles.dateButtonText}>{formatDateTime(dueDate)}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={dueDate}
              mode="datetime"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                setShowDatePicker(Platform.OS === 'ios');
                if (selectedDate) {
                  setDueDate(selectedDate);
                }
              }}
            />
          )}
        </View>

        {/* Type */}
        <View style={styles.field}>
          <Text style={styles.label}>Type</Text>
          <View style={styles.optionsRow}>
            {(['assignment', 'exam', 'project'] as AssignmentType[]).map(t => (
              <TouchableOpacity
                key={t}
                style={[
                  styles.optionChip,
                  type === t && styles.optionChipSelected
                ]}
                onPress={() => setType(t)}
                activeOpacity={0.7}
                accessibilityLabel={`Type: ${t}`}
                accessibilityRole="radio"
                accessibilityState={{ checked: type === t }}
              >
                <Text style={[
                  styles.optionChipText,
                  type === t && styles.optionChipTextSelected
                ]}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Priority */}
        <View style={styles.field}>
          <Text style={styles.label}>Priority</Text>
          <View style={styles.optionsRow}>
            {(['low', 'medium', 'high'] as PriorityLevel[]).map(p => (
              <TouchableOpacity
                key={p}
                style={[
                  styles.optionChip,
                  priority === p && styles.optionChipSelected
                ]}
                onPress={() => setPriority(p)}
                activeOpacity={0.7}
                accessibilityLabel={`Priority: ${p}`}
                accessibilityRole="radio"
                accessibilityState={{ checked: priority === p }}
              >
                <Text style={[
                  styles.optionChipText,
                  priority === p && styles.optionChipTextSelected
                ]}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Description */}
        <View style={styles.field}>
          <Text style={styles.label}>Description (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Add notes or details..."
            placeholderTextColor={colors.labelGray}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            accessibilityLabel="Assignment description input"
          />
        </View>

        {/* Delete Button */}
        {isEditing && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
            activeOpacity={0.7}
            accessibilityLabel="Delete this assignment"
            accessibilityRole="button"
          >
            <MaterialIcons name="delete-outline" size={20} color={colors.error} />
            <Text style={styles.deleteButtonText}>Delete Assignment</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
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
    backgroundColor: colors.bgMain,
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...typography.h4,
    color: colors.charcoal,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  field: {
    marginBottom: spacing.xl,
  },
  label: {
    ...typography.bodyMedium,
    color: colors.charcoal,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 12,
    padding: spacing.md,
    ...typography.body,
    color: colors.charcoal,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  textArea: {
    minHeight: 100,
    paddingTop: spacing.md,
  },
  courseSelector: {
    marginTop: spacing.xs,
  },
  courseChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    marginRight: spacing.sm,
  },
  courseChipSelected: {
    backgroundColor: colors.primaryAccent,
    borderColor: colors.primaryAccent,
  },
  courseChipDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.xs,
  },
  courseChipText: {
    ...typography.bodyMedium,
    color: colors.charcoal,
  },
  courseChipTextSelected: {
    color: colors.white,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  dateButtonText: {
    ...typography.body,
    color: colors.charcoal,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  optionChip: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
  },
  optionChipSelected: {
    backgroundColor: colors.charcoal,
    borderColor: colors.charcoal,
  },
  optionChipText: {
    ...typography.bodyMedium,
    color: colors.charcoal,
  },
  optionChipTextSelected: {
    color: colors.white,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    marginTop: spacing.lg,
  },
  deleteButtonText: {
    ...typography.bodyMedium,
    color: colors.error,
  },
});

export default AddEditAssignmentScreen;

