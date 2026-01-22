import { StyleSheet, ViewStyle } from 'react-native';
import { colors } from './colors';

export const glassStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.glassBackground,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    shadowColor: 'rgba(31, 38, 135, 0.03)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 32,
    elevation: 3,
  },
  cardLight: {
    backgroundColor: colors.glassBackgroundLight,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: 'rgba(31, 38, 135, 0.03)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 32,
    elevation: 3,
  },
  cardStrong: {
    backgroundColor: colors.glassBackgroundStrong,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.glassBackgroundStrong,
    shadowColor: 'rgba(0, 0, 0, 0.05)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
  },
  nav: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.5)',
  },
});

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgMain,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  shadowLarge: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
});

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

