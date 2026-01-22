import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { UserSettings, defaultSettings } from '../types/settings';
import { storage } from '../utils/storage';

interface SettingsState {
  settings: UserSettings;
  loading: boolean;
}

type SettingsAction =
  | { type: 'SET_SETTINGS'; payload: UserSettings }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<UserSettings> }
  | { type: 'SET_LOADING'; payload: boolean };

interface SettingsContextType extends SettingsState {
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>;
  toggleTheme: () => Promise<void>;
  updateUserName: (name: string) => Promise<void>;
  toggleNotification: (key: 'classReminders' | 'assignmentAlerts') => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const settingsReducer = (state: SettingsState, action: SettingsAction): SettingsState => {
  switch (action.type) {
    case 'SET_SETTINGS':
      return { ...state, settings: action.payload, loading: false };
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(settingsReducer, {
    settings: defaultSettings,
    loading: true,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await storage.load<UserSettings>(storage.keys.SETTINGS);
      dispatch({ type: 'SET_SETTINGS', payload: settings || defaultSettings });
    } catch (error) {
      console.error('Error loading settings:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const saveSettings = async (settings: UserSettings) => {
    try {
      await storage.save(storage.keys.SETTINGS, settings);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    const updatedSettings = { ...state.settings, ...newSettings };
    dispatch({ type: 'UPDATE_SETTINGS', payload: newSettings });
    await saveSettings(updatedSettings);
  };

  const toggleTheme = async () => {
    const newTheme = state.settings.theme === 'light' ? 'dark' : 'light';
    await updateSettings({ theme: newTheme });
  };

  const updateUserName = async (name: string) => {
    await updateSettings({ userName: name });
  };

  const toggleNotification = async (key: 'classReminders' | 'assignmentAlerts') => {
    const updatedPreferences = {
      ...state.settings.notificationPreferences,
      [key]: !state.settings.notificationPreferences[key],
    };
    await updateSettings({ notificationPreferences: updatedPreferences });
  };

  return (
    <SettingsContext.Provider
      value={{
        ...state,
        updateSettings,
        toggleTheme,
        updateUserName,
        toggleNotification,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

