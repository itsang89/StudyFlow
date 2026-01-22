import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, AppState, AppStateStatus } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { GlassCard } from '../components/GlassCard';
import { useCourses } from '../context/CourseContext';
import { useStudySessions } from '../context/StudySessionContext';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { commonStyles, spacing } from '../theme/styles';
import { HomeStackParamList } from '../navigation/types';
import { formatTimerDisplay, formatDuration } from '../utils/timeHelpers';

type TimerScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'Timer'>;
type TimerScreenRouteProp = RouteProp<HomeStackParamList, 'Timer'>;

const TimerScreen = () => {
  const navigation = useNavigation<TimerScreenNavigationProp>();
  const route = useRoute<TimerScreenRouteProp>();
  const { courseId } = route.params;
  
  const { getCourseById } = useCourses();
  const { addSession, getStudyTimeByDate } = useStudySessions();
  const course = getCourseById(courseId);

  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [notes, setNotes] = useState('');
  
  const startTimeRef = useRef(new Date());
  const backgroundTimeRef = useRef<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Timer logic
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  // Background timer support
  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      subscription.remove();
    };
  }, [isRunning]);

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === 'background' && isRunning) {
      backgroundTimeRef.current = new Date();
    } else if (nextAppState === 'active' && isRunning && backgroundTimeRef.current) {
      const timeInBackground = Math.floor((new Date().getTime() - backgroundTimeRef.current.getTime()) / 1000);
      setSeconds((prev) => prev + timeInBackground);
      backgroundTimeRef.current = null;
    }
  };

  const handlePause = () => {
    setIsRunning(!isRunning);
  };

  const handleStop = () => {
    setIsRunning(false);
    setShowCompleteModal(true);
  };

  const handleSaveSession = async () => {
    const endTime = new Date();
    await addSession({
      courseId,
      startTime: startTimeRef.current,
      endTime,
      duration: seconds,
      notes,
      date: new Date(),
    });
    setShowCompleteModal(false);
    navigation.goBack();
  };

  const handleDiscard = () => {
    setShowCompleteModal(false);
    navigation.goBack();
  };

  const todayStudyTime = getStudyTimeByDate(new Date());

  if (!course) {
    return (
      <View style={[commonStyles.container, commonStyles.centerContent]}>
        <Text style={styles.errorText}>Course not found</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Decorative background circles */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.courseCode}>{course.code}</Text>
        <View style={styles.statusBadge}>
          <View style={[styles.statusDot, isRunning && styles.statusDotActive]} />
          <Text style={styles.statusText}>{isRunning ? 'Focus Active' : 'Paused'}</Text>
        </View>
      </View>

      {/* Timer Display */}
      <View style={styles.timerContainer}>
        <GlassCard style={styles.timerCircle}>
          <View style={styles.timerInner}>
            <Text style={styles.timerText}>{formatTimerDisplay(seconds)}</Text>
            <Text style={styles.timerLabel}>ELAPSED</Text>
          </View>
        </GlassCard>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.controlButton, styles.controlButtonSecondary]}
            onPress={handlePause}
            activeOpacity={0.8}
          >
            <MaterialIcons 
              name={isRunning ? 'pause' : 'play-arrow'} 
              size={24} 
              color={colors.charcoal} 
            />
            <Text style={styles.controlButtonTextSecondary}>
              {isRunning ? 'Pause' : 'Resume'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.controlButton, styles.controlButtonSecondary]}
            onPress={handleStop}
            activeOpacity={0.8}
          >
            <MaterialIcons name="stop" size={24} color={colors.charcoal} />
            <Text style={styles.controlButtonTextSecondary}>End</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>STREAK</Text>
            <Text style={styles.statValue}>- Days</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>TODAY</Text>
            <Text style={styles.statValue}>{formatDuration(todayStudyTime + seconds)}</Text>
          </View>
        </View>
      </View>

      {/* Session Complete Modal */}
      <Modal
        visible={showCompleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCompleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <GlassCard style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <MaterialIcons name="check-circle" size={64} color={colors.success} />
              <Text style={styles.modalTitle}>Session Complete!</Text>
              <Text style={styles.modalSubtitle}>Great work today</Text>
            </View>

            <View style={styles.modalStats}>
              <View style={styles.modalStatItem}>
                <Text style={styles.modalStatLabel}>Duration</Text>
                <Text style={styles.modalStatValue}>{formatDuration(seconds)}</Text>
              </View>
              <View style={styles.modalStatDivider} />
              <View style={styles.modalStatItem}>
                <Text style={styles.modalStatLabel}>Course</Text>
                <Text style={styles.modalStatValue}>{course.code}</Text>
              </View>
            </View>

            <View style={styles.notesSection}>
              <Text style={styles.notesLabel}>Session Notes (Optional)</Text>
              <TextInput
                style={styles.notesInput}
                placeholder="Add any notes about this study session..."
                placeholderTextColor={colors.labelGray}
                multiline
                numberOfLines={4}
                value={notes}
                onChangeText={setNotes}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={handleDiscard}
                activeOpacity={0.8}
              >
                <Text style={styles.modalButtonTextSecondary}>Discard</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={handleSaveSession}
                activeOpacity={0.8}
              >
                <Text style={styles.modalButtonText}>Save Session</Text>
              </TouchableOpacity>
            </View>
          </GlassCard>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgAlt,
  },
  bgCircle1: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 320,
    height: 320,
    backgroundColor: colors.white,
    opacity: 0.6,
    borderRadius: 160,
  },
  bgCircle2: {
    position: 'absolute',
    top: '50%',
    left: -80,
    width: 256,
    height: 256,
    backgroundColor: colors.primaryAccent,
    opacity: 0.05,
    borderRadius: 128,
  },
  header: {
    paddingTop: spacing.xl + 24,
    alignItems: 'center',
    marginBottom: 'auto',
  },
  courseCode: {
    ...typography.labelSmall,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.labelGray,
    opacity: 0.4,
  },
  statusDotActive: {
    backgroundColor: colors.primaryAccent,
    opacity: 0.8,
  },
  statusText: {
    ...typography.smallMedium,
    color: colors.labelGray,
    fontSize: 13,
  },
  timerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  timerCircle: {
    width: 300,
    height: 300,
    borderRadius: 150,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  timerInner: {
    alignItems: 'center',
  },
  timerText: {
    fontSize: 64,
    fontWeight: '300',
    color: colors.charcoal,
    letterSpacing: -2,
  },
  timerLabel: {
    ...typography.label,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  controls: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl + 80,
    marginTop: 'auto',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  controlButton: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  controlButtonSecondary: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  controlButtonTextSecondary: {
    ...typography.bodyMedium,
    color: colors.charcoal,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    ...typography.labelSmall,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  statValue: {
    ...typography.bodySemibold,
    color: colors.charcoal,
    fontSize: 18,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.labelGray,
    opacity: 0.2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    padding: spacing.xl,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  modalTitle: {
    ...typography.h2,
    color: colors.charcoal,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  modalSubtitle: {
    ...typography.body,
    color: colors.labelGray,
  },
  modalStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing.lg,
    marginBottom: spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 16,
  },
  modalStatItem: {
    alignItems: 'center',
  },
  modalStatLabel: {
    ...typography.label,
    color: colors.labelGray,
    marginBottom: spacing.xs,
  },
  modalStatValue: {
    ...typography.h4,
    color: colors.charcoal,
  },
  modalStatDivider: {
    width: 1,
    backgroundColor: colors.labelGray,
    opacity: 0.2,
  },
  notesSection: {
    marginBottom: spacing.xl,
  },
  notesLabel: {
    ...typography.bodyMedium,
    color: colors.charcoal,
    marginBottom: spacing.sm,
  },
  notesInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 12,
    padding: spacing.md,
    ...typography.body,
    color: colors.charcoal,
    minHeight: 100,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  modalButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonPrimary: {
    backgroundColor: colors.charcoal,
  },
  modalButtonSecondary: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  modalButtonText: {
    ...typography.bodySemibold,
    color: colors.white,
  },
  modalButtonTextSecondary: {
    ...typography.bodySemibold,
    color: colors.charcoal,
  },
  errorText: {
    ...typography.h4,
    color: colors.error,
    marginBottom: spacing.lg,
  },
  backButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    backgroundColor: colors.charcoal,
    borderRadius: 12,
  },
  backButtonText: {
    ...typography.bodySemibold,
    color: colors.white,
  },
});

export default TimerScreen;

