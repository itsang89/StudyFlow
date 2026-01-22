import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { commonStyles, spacing } from '../theme/styles';

const DayViewScreen = () => {
  return (
    <View style={[commonStyles.container, commonStyles.centerContent]}>
      <Text style={styles.text}>Day View Screen</Text>
      <Text style={styles.subtext}>Coming soon...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    ...typography.h3,
    color: colors.charcoal,
  },
  subtext: {
    ...typography.body,
    color: colors.labelGray,
    marginTop: spacing.sm,
  },
});

export default DayViewScreen;

