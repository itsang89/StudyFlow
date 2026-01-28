import React, { memo } from 'react';
import { View, ViewStyle, StyleSheet, StyleProp } from 'react-native';
import { glassStyles } from '../theme/styles';

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'default' | 'light' | 'strong';
}

const variantStyles = {
  light: glassStyles.cardLight,
  strong: glassStyles.cardStrong,
  default: glassStyles.card,
} as const;

export const GlassCard: React.FC<GlassCardProps> = memo(({ 
  children, 
  style, 
  variant = 'default' 
}) => {
  return (
    <View style={[variantStyles[variant], style]}>
      {children}
    </View>
  );
});

