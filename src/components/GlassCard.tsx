import React from 'react';
import { View, ViewStyle, StyleSheet, StyleProp } from 'react-native';
import { glassStyles } from '../theme/styles';

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'default' | 'light' | 'strong';
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  style, 
  variant = 'default' 
}) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'light':
        return glassStyles.cardLight;
      case 'strong':
        return glassStyles.cardStrong;
      default:
        return glassStyles.card;
    }
  };

  return (
    <View style={[getVariantStyle(), style]}>
      {children}
    </View>
  );
};

