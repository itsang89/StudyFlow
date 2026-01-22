import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { GlassCard } from './GlassCard';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/styles';

interface AgendaItemProps {
  title: string;
  subtitle?: string;
  timeRange?: string;
  location?: string;
  color: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  badge?: {
    text: string;
    color: string;
  };
  onPress?: () => void;
}

export const AgendaItem: React.FC<AgendaItemProps> = ({
  title,
  subtitle,
  timeRange,
  location,
  color,
  icon,
  badge,
  onPress,
}) => {
  const content = (
    <GlassCard style={styles.container}>
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: `${color}1A` }]}>
          <MaterialIcons name={icon} size={24} color={color} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          {(timeRange || location || subtitle) && (
            <View style={styles.detailsRow}>
              {timeRange && (
                <>
                  <Text style={styles.detail}>{timeRange}</Text>
                  {location && <Text style={styles.separator}>•</Text>}
                </>
              )}
              {location && <Text style={styles.detail}>{location}</Text>}
              {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </View>
          )}
        </View>
      </View>
      {badge && (
        <View style={[styles.badge, { backgroundColor: `${badge.color}1A`, borderColor: `${badge.color}33` }]}>
          <Text style={[styles.badgeText, { color: badge.color }]}>{badge.text}</Text>
        </View>
      )}
    </GlassCard>
  );

  if (onPress) {
    return <TouchableOpacity onPress={onPress} activeOpacity={0.7}>{content}</TouchableOpacity>;
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    ...typography.bodySemibold,
    color: colors.charcoal,
    marginBottom: 4,
  },
  subtitle: {
    ...typography.small,
    color: colors.labelGray,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  detail: {
    ...typography.smallMedium,
    color: colors.labelGray,
    fontSize: 13,
  },
  separator: {
    ...typography.tiny,
    color: colors.labelGray,
    opacity: 0.3,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    marginLeft: spacing.sm,
  },
  badgeText: {
    ...typography.labelSmall,
    fontSize: 10,
  },
});

