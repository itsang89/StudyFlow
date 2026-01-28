import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, Alert, KeyboardAvoidingView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import { GlassCard } from '../components/GlassCard';
import { CourseColorPicker } from '../components/CourseColorPicker';
import { useCourses } from '../context/CourseContext';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { commonStyles, spacing } from '../theme/styles';
import { SettingsStackParamList } from '../navigation/types';
import { CourseSchedule, TimeString, DayOfWeek } from '../types/course';
import { getDayName } from '../utils/dateHelpers';

type AddEditCourseScreenNavigationProp = StackNavigationProp<SettingsStackParamList, 'AddEditCourse'>;
type AddEditCourseScreenRouteProp = RouteProp<SettingsStackParamList, 'AddEditCourse'>;

const AddEditCourseScreen = () => {
  const navigation = useNavigation<AddEditCourseScreenNavigationProp>();
  const route = useRoute<AddEditCourseScreenRouteProp>();
  const { courseId } = route.params;
  
  const { getCourseById, addCourse, updateCourse, deleteCourse } = useCourses();
  const existingCourse = courseId ? getCourseById(courseId) : null;
  const isEditing = !!existingCourse;

  const [name, setName] = useState(existingCourse?.name || '');
  const [code, setCode] = useState(existingCourse?.code || '');
  const [instructor, setInstructor] = useState(existingCourse?.instructor || '');
  const [location, setLocation] = useState(existingCourse?.location || '');
  const [color, setColor] = useState(existingCourse?.color || '#4A90E2');
  const [schedule, setSchedule] = useState<CourseSchedule[]>(existingCourse?.schedule || []);
  const [showTimePicker, setShowTimePicker] = useState<{ type: 'start' | 'end'; index: number } | null>(null);

  const handleSave = async () => {
    if (!name.trim() || !code.trim()) {
      Alert.alert('Error', 'Please fill in course name and code');
      return;
    }

    const courseData = {
      name: name.trim(),
      code: code.trim(),
      instructor: instructor.trim(),
      location: location.trim(),
      color,
      schedule,
    };

    if (isEditing && courseId) {
      await updateCourse(courseId, courseData);
    } else {
      await addCourse(courseData);
    }

    navigation.goBack();
  };

  const handleDelete = async () => {
    if (courseId) {
      Alert.alert(
        'Delete Course',
        'Are you sure? This will also delete all related assignments.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              await deleteCourse(courseId);
              navigation.goBack();
            },
          },
        ]
      );
    }
  };

  const addScheduleSlot = () => {
    setSchedule([...schedule, { 
      day: 1 as DayOfWeek, 
      startTime: '09:00' as TimeString, 
      endTime: '10:00' as TimeString 
    }]);
  };

  const removeScheduleSlot = (index: number) => {
    setSchedule(schedule.filter((_, i) => i !== index));
  };

  const updateScheduleSlot = (index: number, field: keyof CourseSchedule, value: any) => {
    const newSchedule = [...schedule];
    newSchedule[index] = { ...newSchedule[index], [field]: value };
    setSchedule(newSchedule);
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(null);
    }
    
    if (selectedTime && showTimePicker) {
      const hours = selectedTime.getHours().toString().padStart(2, '0');
      const minutes = selectedTime.getMinutes().toString().padStart(2, '0');
      const timeString = `${hours}:${minutes}` as TimeString;
      
      const field = showTimePicker.type === 'start' ? 'startTime' : 'endTime';
      updateScheduleSlot(showTimePicker.index, field, timeString);
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
        <Text style={styles.headerTitle}>{isEditing ? 'Edit' : 'Add'} Course</Text>
        <TouchableOpacity 
          onPress={handleSave} 
          style={styles.headerButton}
          accessibilityLabel="Save course"
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
        {/* Basic Info */}
        <View style={styles.field}>
          <Text style={styles.label}>Course Code</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., CS101"
            placeholderTextColor={colors.labelGray}
            value={code}
            onChangeText={setCode}
            accessibilityLabel="Course code input"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Course Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Introduction to Computer Science"
            placeholderTextColor={colors.labelGray}
            value={name}
            onChangeText={setName}
            accessibilityLabel="Course name input"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Instructor (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Professor name"
            placeholderTextColor={colors.labelGray}
            value={instructor}
            onChangeText={setInstructor}
            accessibilityLabel="Instructor name input"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Location (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Room 302"
            placeholderTextColor={colors.labelGray}
            value={location}
            onChangeText={setLocation}
            accessibilityLabel="Location input"
          />
        </View>

        {/* Color Picker */}
        <View style={styles.field}>
          <Text style={styles.label}>Course Color</Text>
          <CourseColorPicker selectedColor={color} onColorSelect={setColor} />
        </View>

        {/* Schedule */}
        <View style={styles.field}>
          <View style={styles.sectionHeader}>
            <Text style={styles.label}>Class Schedule</Text>
            <TouchableOpacity 
              onPress={addScheduleSlot} 
              style={styles.addButton}
              accessibilityLabel="Add new class schedule slot"
              accessibilityRole="button"
            >
              <MaterialIcons name="add" size={20} color={colors.primaryAccent} />
              <Text style={styles.addButtonText}>Add Time Slot</Text>
            </TouchableOpacity>
          </View>

          {schedule.map((slot, index) => (
            <GlassCard key={index} style={styles.scheduleCard}>
              <View style={styles.scheduleSlot}>
                <View style={styles.scheduleRow}>
                  <Text style={styles.scheduleLabel}>Day</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.dayButtons}>
                      {[1, 2, 3, 4, 5, 6, 0].map((day) => (
                        <TouchableOpacity
                          key={day}
                          style={[
                            styles.dayButton,
                            slot.day === day && styles.dayButtonSelected,
                          ]}
                          onPress={() => updateScheduleSlot(index, 'day', day)}
                          accessibilityLabel={`Select ${getDayName(day)}`}
                          accessibilityRole="radio"
                          accessibilityState={{ checked: slot.day === day }}
                        >
                          <Text
                            style={[
                              styles.dayButtonText,
                              slot.day === day && styles.dayButtonTextSelected,
                            ]}
                          >
                            {getDayName(day).substring(0, 3)}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                </View>

                <View style={styles.timeRow}>
                  <View style={styles.timeField}>
                    <Text style={styles.scheduleLabel}>Start</Text>
                    <TouchableOpacity
                      style={styles.timeButton}
                      onPress={() => setShowTimePicker({ type: 'start', index })}
                      accessibilityLabel="Set start time"
                      accessibilityRole="button"
                    >
                      <MaterialIcons name="access-time" size={16} color={colors.primaryAccent} />
                      <Text style={styles.timeButtonText}>{slot.startTime}</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.timeField}>
                    <Text style={styles.scheduleLabel}>End</Text>
                    <TouchableOpacity
                      style={styles.timeButton}
                      onPress={() => setShowTimePicker({ type: 'end', index })}
                      accessibilityLabel="Set end time"
                      accessibilityRole="button"
                    >
                      <MaterialIcons name="access-time" size={16} color={colors.primaryAccent} />
                      <Text style={styles.timeButtonText}>{slot.endTime}</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeScheduleSlot(index)}
                  accessibilityLabel="Remove this schedule slot"
                  accessibilityRole="button"
                >
                  <MaterialIcons name="close" size={20} color={colors.error} />
                </TouchableOpacity>
              </View>
            </GlassCard>
          ))}

          {schedule.length === 0 && (
            <Text style={styles.emptyScheduleText}>No class schedule added yet</Text>
          )}
        </View>

        {/* Delete Button */}
        {isEditing && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
            activeOpacity={0.7}
            accessibilityLabel="Delete this course"
            accessibilityRole="button"
          >
            <MaterialIcons name="delete-outline" size={20} color={colors.error} />
            <Text style={styles.deleteButtonText}>Delete Course</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Time Picker */}
      {showTimePicker && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleTimeChange}
        />
      )}
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  addButtonText: {
    ...typography.bodyMedium,
    color: colors.primaryAccent,
  },
  scheduleCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  scheduleSlot: {
    position: 'relative',
  },
  scheduleRow: {
    marginBottom: spacing.md,
  },
  scheduleLabel: {
    ...typography.smallMedium,
    color: colors.labelGray,
    marginBottom: spacing.xs,
  },
  dayButtons: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  dayButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    minWidth: 48,
    alignItems: 'center',
  },
  dayButtonSelected: {
    backgroundColor: colors.charcoal,
    borderColor: colors.charcoal,
  },
  dayButtonText: {
    ...typography.smallMedium,
    color: colors.charcoal,
  },
  dayButtonTextSelected: {
    color: colors.white,
  },
  timeRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  timeField: {
    flex: 1,
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 8,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  timeButtonText: {
    ...typography.bodyMedium,
    color: colors.charcoal,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyScheduleText: {
    ...typography.body,
    color: colors.labelGray,
    textAlign: 'center',
    paddingVertical: spacing.lg,
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

export default AddEditCourseScreen;

