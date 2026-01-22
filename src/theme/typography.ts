import { TextStyle } from 'react-native';

export const typography = {
  // Headings
  h1: {
    fontSize: 40,
    fontWeight: '700' as TextStyle['fontWeight'],
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 32,
    fontWeight: '600' as TextStyle['fontWeight'],
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 24,
    fontWeight: '600' as TextStyle['fontWeight'],
    letterSpacing: -0.2,
  },
  h4: {
    fontSize: 20,
    fontWeight: '600' as TextStyle['fontWeight'],
  },
  
  // Body text
  body: {
    fontSize: 16,
    fontWeight: '400' as TextStyle['fontWeight'],
  },
  bodyMedium: {
    fontSize: 16,
    fontWeight: '500' as TextStyle['fontWeight'],
  },
  bodySemibold: {
    fontSize: 16,
    fontWeight: '600' as TextStyle['fontWeight'],
  },
  
  // Small text
  small: {
    fontSize: 14,
    fontWeight: '400' as TextStyle['fontWeight'],
  },
  smallMedium: {
    fontSize: 14,
    fontWeight: '500' as TextStyle['fontWeight'],
  },
  
  // Tiny text
  tiny: {
    fontSize: 12,
    fontWeight: '400' as TextStyle['fontWeight'],
  },
  tinyMedium: {
    fontSize: 12,
    fontWeight: '500' as TextStyle['fontWeight'],
  },
  
  // Label text (small caps style)
  label: {
    fontSize: 11,
    fontWeight: '600' as TextStyle['fontWeight'],
    letterSpacing: 1.6,
    textTransform: 'uppercase' as TextStyle['textTransform'],
  },
  labelSmall: {
    fontSize: 10,
    fontWeight: '700' as TextStyle['fontWeight'],
    letterSpacing: 1.6,
    textTransform: 'uppercase' as TextStyle['textTransform'],
  },
  
  // Special
  massive: {
    fontSize: 64,
    fontWeight: '800' as TextStyle['fontWeight'],
    letterSpacing: -2.5,
  },
};

