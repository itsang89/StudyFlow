import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { ThemeColors } from '../theme/colors';
import { typography } from '../theme/typography';
import { getCommonStyles, spacing } from '../theme/styles';

const WeekViewScreen = () => {
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={[commonStyles.container, commonStyles.centerContent]}>
      <Text style={styles.text}>Week View Screen</Text>
      <Text style={styles.subtext}>Coming soon...</Text>
    </View>
  );
};

const createStyles = (theme: ThemeColors) => StyleSheet.create({
  text: {
    ...typography.h3,
    color: theme.textPrimary,
  },
  subtext: {
    ...typography.body,
    color: theme.textSecondary,
    marginTop: spacing.sm,
  },
});

export default WeekViewScreen;
