import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Switch, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { GlassCard } from '../components/GlassCard';
import { useSettings } from '../context/SettingsContext';
import { useTheme } from '../context/ThemeContext';
import { storage } from '../utils/storage';
import { ThemeColors } from '../theme/colors';
import { typography } from '../theme/typography';
import { getCommonStyles, spacing } from '../theme/styles';
import { SettingsStackParamList } from '../navigation/types';

type SettingsScreenNavigationProp = StackNavigationProp<SettingsStackParamList, 'Settings'>;

const SettingsScreen = () => {
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const styles = useMemo(() => createStyles(theme), [theme]);
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const { settings, updateUserName, toggleTheme, toggleNotification } = useSettings();
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(settings.userName);

  const handleSaveName = () => {
    updateUserName(tempName);
    setIsEditingName(false);
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will delete all your courses, assignments, and study sessions. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            await storage.clearAll();
            Alert.alert('Success', 'All data has been cleared. Please restart the app.');
          },
        },
      ]
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
          <Text style={styles.title}>Settings</Text>
        </View>

        {/* Profile Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PROFILE</Text>
          <GlassCard style={styles.card}>
            <View style={styles.profileSection}>
              <MaterialIcons name="person" size={24} color={theme.primaryAccent} />
              {isEditingName ? (
                <View style={styles.nameEditContainer}>
                  <TextInput
                    style={styles.nameInput}
                    value={tempName}
                    onChangeText={setTempName}
                    placeholder="Enter your name"
                    placeholderTextColor={theme.textSecondary}
                    autoFocus
                  />
                  <TouchableOpacity onPress={handleSaveName} style={styles.saveButton}>
                    <MaterialIcons name="check" size={20} color={theme.success} />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity 
                  style={styles.nameDisplay}
                  onPress={() => {
                    setTempName(settings.userName);
                    setIsEditingName(true);
                  }}
                >
                  <Text style={styles.userName}>
                    {settings.userName || 'Set your name'}
                  </Text>
                  <MaterialIcons name="edit" size={18} color={theme.textSecondary} />
                </TouchableOpacity>
              )}
            </View>
          </GlassCard>
        </View>

        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>APPEARANCE</Text>
          <GlassCard style={styles.card}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <MaterialIcons name="brightness-6" size={24} color={theme.textSecondary} />
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Theme</Text>
                  <Text style={styles.settingValue}>
                    {settings.theme === 'light' ? 'Light Mode' : 'Dark Mode'}
                  </Text>
                </View>
              </View>
              <Switch
                value={settings.theme === 'dark'}
                onValueChange={toggleTheme}
                trackColor={{ false: theme.textSecondary, true: theme.primaryAccent }}
                thumbColor={theme.white}
                accessibilityLabel="Toggle dark mode"
                accessibilityRole="switch"
              />
            </View>
          </GlassCard>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>NOTIFICATIONS</Text>
          <GlassCard style={styles.card}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <MaterialIcons name="notifications" size={24} color={theme.textSecondary} />
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Class Reminders</Text>
                  <Text style={styles.settingDescription}>1 hour before class</Text>
                </View>
              </View>
              <Switch
                value={settings.notificationPreferences.classReminders}
                onValueChange={() => toggleNotification('classReminders')}
                trackColor={{ false: theme.textSecondary, true: theme.primaryAccent }}
                thumbColor={theme.white}
                accessibilityLabel="Toggle class reminders"
                accessibilityRole="switch"
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <MaterialIcons name="assignment-late" size={24} color={theme.textSecondary} />
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Assignment Alerts</Text>
                  <Text style={styles.settingDescription}>24 hours before due</Text>
                </View>
              </View>
              <Switch
                value={settings.notificationPreferences.assignmentAlerts}
                onValueChange={() => toggleNotification('assignmentAlerts')}
                trackColor={{ false: theme.textSecondary, true: theme.primaryAccent }}
                thumbColor={theme.white}
                accessibilityLabel="Toggle assignment alerts"
                accessibilityRole="switch"
              />
            </View>
          </GlassCard>
        </View>

        {/* Courses Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MANAGE</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('CoursesList')}
            activeOpacity={0.7}
            accessibilityLabel="Manage your courses"
            accessibilityRole="button"
          >
            <GlassCard style={styles.card}>
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <MaterialIcons name="school" size={24} color={theme.textSecondary} />
                  <Text style={styles.settingLabel}>My Courses</Text>
                </View>
                <MaterialIcons name="chevron-right" size={24} color={theme.textSecondary} />
              </View>
            </GlassCard>
          </TouchableOpacity>
        </View>

        {/* Data Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DATA</Text>
          <TouchableOpacity
            onPress={handleClearData}
            activeOpacity={0.7}
            accessibilityLabel="Clear all app data"
            accessibilityRole="button"
          >
            <GlassCard style={styles.card}>
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <MaterialIcons name="delete-sweep" size={24} color={theme.error} />
                  <Text style={[styles.settingLabel, { color: theme.error }]}>Clear All Data</Text>
                </View>
                <MaterialIcons name="chevron-right" size={24} color={theme.error} />
              </View>
            </GlassCard>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ABOUT</Text>
          <GlassCard style={styles.card}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Version</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Build</Text>
              <Text style={styles.infoValue}>2024.01</Text>
            </View>
          </GlassCard>
        </View>
      </ScrollView>
    </View>
  );
};

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
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h2,
    color: theme.textPrimary,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.label,
    color: theme.textSecondary,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  card: {
    padding: spacing.md,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  nameDisplay: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userName: {
    ...typography.bodySemibold,
    color: theme.textPrimary,
    fontSize: 17,
  },
  nameEditContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  nameInput: {
    flex: 1,
    ...typography.body,
    color: theme.textPrimary,
    padding: spacing.sm,
    backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.5)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.8)',
  },
  saveButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    minHeight: 44,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  settingText: {
    flex: 1,
  },
  settingLabel: {
    ...typography.bodyMedium,
    color: theme.textPrimary,
    marginBottom: 2,
  },
  settingValue: {
    ...typography.small,
    color: theme.textSecondary,
  },
  settingDescription: {
    ...typography.small,
    color: theme.textSecondary,
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
    marginVertical: spacing.sm,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  infoLabel: {
    ...typography.body,
    color: theme.textSecondary,
  },
  infoValue: {
    ...typography.bodyMedium,
    color: theme.textPrimary,
  },
});

export default SettingsScreen;
