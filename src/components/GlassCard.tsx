import React, { memo } from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { getGlassStyles } from '../theme/styles';
import { useTheme } from '../context/ThemeContext';

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'default' | 'light' | 'strong';
}

export const GlassCard: React.FC<GlassCardProps> = memo(({ 
  children, 
  style, 
  variant = 'default' 
}) => {
  const theme = useTheme();
  const glassStyles = getGlassStyles(theme);

  const variantStyles = {
    light: glassStyles.cardLight,
    strong: glassStyles.cardStrong,
    default: glassStyles.card,
  } as const;

  return (
    <View style={[variantStyles[variant], style]}>
      {children}
    </View>
  );
});
