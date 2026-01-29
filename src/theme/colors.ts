// Common colors that stay the same in both modes
const commonColors = {
  primaryAccent: '#13a4ec',
  primaryBlue: '#4A90E2',
  accentBlue: '#89A8D0',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  transparent: 'transparent',
  white: '#FFFFFF',
  black: '#000000',
  
  // Course colors
  courseBlue: '#4A90E2',
  coursePurple: '#9333EA',
  courseGreen: '#10B981',
  courseOrange: '#F59E0B',
  courseRed: '#EF4444',
  coursePink: '#EC4899',
  courseIndigo: '#6366F1',
  courseTeal: '#14B8A6',
  courseAmber: '#FBBF24',
  courseCyan: '#06B6D4',
};

export const lightColors = {
  ...commonColors,
  isDark: false,
  bgMain: '#F4F7F9',
  bgAlt: '#F9F9F9',
  charcoal: '#1A1C1E',
  textPrimary: '#1A1C1E', // charcoal
  textSecondary: '#6B7280', // labelGray
  textMuted: '#8E8E93',
  textLight: 'rgba(0, 0, 0, 0.4)',
  border: 'rgba(0, 0, 0, 0.05)',
  glassBackground: 'rgba(255, 255, 255, 0.4)',
  glassBorder: 'rgba(255, 255, 255, 0.5)',
  cardBackground: '#FFFFFF',
  
  // Legacy aliases for compatibility during transition
  labelGray: '#6B7280',
};

export const darkColors = {
  ...commonColors,
  isDark: true,
  bgMain: '#0F1419',
  bgAlt: '#1A1E23',
  charcoal: '#F8FAFC', // Near white for dark mode
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  textLight: 'rgba(255, 255, 255, 0.4)',
  border: 'rgba(255, 255, 255, 0.1)',
  glassBackground: 'rgba(255, 255, 255, 0.08)',
  glassBorder: 'rgba(255, 255, 255, 0.1)',
  cardBackground: '#1A1E23',
  
  // Legacy aliases
  labelGray: '#94A3B8',
};

export type ThemeColors = typeof lightColors;

// Default colors for non-context components if needed
export const colors = lightColors;

export const priorityColors = {
  priorityLow: commonColors.success,
  priorityMedium: commonColors.warning,
  priorityHigh: commonColors.error,
};

export const courseColors = [
  { name: 'Blue', value: commonColors.courseBlue },
  { name: 'Purple', value: commonColors.coursePurple },
  { name: 'Green', value: commonColors.courseGreen },
  { name: 'Orange', value: commonColors.courseOrange },
  { name: 'Red', value: commonColors.courseRed },
  { name: 'Pink', value: commonColors.coursePink },
  { name: 'Indigo', value: commonColors.courseIndigo },
  { name: 'Teal', value: commonColors.courseTeal },
  { name: 'Amber', value: commonColors.courseAmber },
  { name: 'Cyan', value: commonColors.courseCyan },
];

export const opacity = {
  glass: 'rgba(255, 255, 255, 0.4)',
  glassBorder: 'rgba(255, 255, 255, 0.5)',
  glassLight: 'rgba(255, 255, 255, 0.2)',
  glassStrong: 'rgba(255, 255, 255, 0.6)',
  glassNav: 'rgba(255, 255, 255, 0.7)',
  glassNavBorder: 'rgba(255, 255, 255, 0.5)',
};
