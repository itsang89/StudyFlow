import { StyleSheet, ViewStyle } from 'react-native';
import { ThemeColors } from './colors';

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

export const getGlassStyles = (theme: ThemeColors) => StyleSheet.create({
  card: {
    backgroundColor: theme.glassBackground,
    borderRadius: borderRadius.xxl,
    borderWidth: 1,
    borderColor: theme.glassBorder,
    shadowColor: theme.isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(31, 38, 135, 0.03)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 32,
    elevation: 3,
  },
  cardLight: {
    backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.2)',
    borderRadius: borderRadius.xxl,
    borderWidth: 1,
    borderColor: theme.glassBorder,
    shadowColor: theme.isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(31, 38, 135, 0.03)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 32,
    elevation: 3,
  },
  cardStrong: {
    backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.6)',
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: theme.glassBorder,
    shadowColor: 'rgba(0, 0, 0, 0.05)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
  },
  nav: {
    backgroundColor: theme.isDark ? 'rgba(15, 20, 25, 0.8)' : 'rgba(255, 255, 255, 0.7)',
    borderTopWidth: 1,
    borderTopColor: theme.glassBorder,
  },
});

export const getCommonStyles = (theme: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bgMain,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: theme.isDark ? 0.3 : 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  shadowLarge: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: theme.isDark ? 0.4 : 0.15,
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
