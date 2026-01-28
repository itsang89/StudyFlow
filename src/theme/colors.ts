export const colors = {
  // Backgrounds
  bgMain: '#F4F7F9',
  bgAlt: '#F9F9F9',
  
  // Primary colors
  charcoal: '#1A1C1E',
  primaryAccent: '#13a4ec',
  primaryBlue: '#4A90E2',
  accentBlue: '#89A8D0',
  
  // Text colors
  labelGray: '#6B7280',
  textSecondary: '#8E8E93',
  textLight: 'rgba(0, 0, 0, 0.4)',
  
  // Status colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  
  // Course colors (for user selection)
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
  
  // UI elements
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

// Derived colors
export const priorityColors = {
  priorityLow: colors.success,
  priorityMedium: colors.warning,
  priorityHigh: colors.error,
};

export const opacity = {
  glass: 'rgba(255, 255, 255, 0.4)',
  glassBorder: 'rgba(255, 255, 255, 0.5)',
  glassLight: 'rgba(255, 255, 255, 0.2)',
  glassStrong: 'rgba(255, 255, 255, 0.6)',
  glassNav: 'rgba(255, 255, 255, 0.7)',
  glassNavBorder: 'rgba(255, 255, 255, 0.5)',
};

export const courseColors = [
  { name: 'Blue', value: colors.courseBlue },
  { name: 'Purple', value: colors.coursePurple },
  { name: 'Green', value: colors.courseGreen },
  { name: 'Orange', value: colors.courseOrange },
  { name: 'Red', value: colors.courseRed },
  { name: 'Pink', value: colors.coursePink },
  { name: 'Indigo', value: colors.courseIndigo },
  { name: 'Teal', value: colors.courseTeal },
  { name: 'Amber', value: colors.courseAmber },
  { name: 'Cyan', value: colors.courseCyan },
];

