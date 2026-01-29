import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { useSettings } from './SettingsContext';
import { lightColors, darkColors, ThemeColors } from '../theme/colors';

interface ThemeContextType {
  colors: ThemeColors;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { settings } = useSettings();
  
  const isDark = settings.theme === 'dark';
  const colors = useMemo(() => (isDark ? darkColors : lightColors), [isDark]);

  const value = useMemo(() => ({
    colors,
    isDark
  }), [colors, isDark]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context.colors;
};

export const useThemeStatus = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeStatus must be used within a ThemeProvider');
  }
  return { isDark: context.isDark };
};
