import React, { createContext, useContext, useReducer, useEffect, ReactNode, useCallback, useMemo, useRef } from 'react';
import { Alert } from 'react-native';
import { UserSettings, defaultSettings } from '../types/settings';
import { storage } from '../utils/storage';

interface SettingsState {
  settings: UserSettings;
  loading: boolean;
  error: string | null;
}

type SettingsAction =
  | { type: 'SET_SETTINGS'; payload: UserSettings }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<UserSettings> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

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
      return { ...state, settings: action.payload, loading: false, error: null };
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload }, error: null };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(settingsReducer, {
    settings: defaultSettings,
    loading: true,
    error: null,
  });
  const isInitialMount = useRef(true);

  const loadSettings = useCallback(async () => {
    try {
      const settings = await storage.load<UserSettings>(storage.keys.SETTINGS);
      dispatch({ type: 'SET_SETTINGS', payload: settings || defaultSettings });
    } catch (error) {
      console.error('Error loading settings:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load settings' });
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  // Persist settings to storage whenever they change
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const saveSettings = async () => {
      try {
        await storage.save(storage.keys.SETTINGS, state.settings);
      } catch (error) {
        console.error('Error saving settings:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to save settings' });
        Alert.alert('Error', 'Failed to save settings. Please try again.');
      }
    };

    if (!state.loading) {
      saveSettings();
    }
  }, [state.settings, state.loading]);

  const updateSettings = useCallback(async (newSettings: Partial<UserSettings>): Promise<void> => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: newSettings });
  }, []);

  const toggleTheme = useCallback(async (): Promise<void> => {
    const newTheme = state.settings.theme === 'light' ? 'dark' : 'light';
    await updateSettings({ theme: newTheme });
  }, [state.settings.theme, updateSettings]);

  const updateUserName = useCallback(async (name: string): Promise<void> => {
    await updateSettings({ userName: name });
  }, [updateSettings]);

  const toggleNotification = useCallback(async (key: 'classReminders' | 'assignmentAlerts'): Promise<void> => {
    const updatedPreferences = {
      ...state.settings.notificationPreferences,
      [key]: !state.settings.notificationPreferences[key],
    };
    await updateSettings({ notificationPreferences: updatedPreferences });
  }, [state.settings.notificationPreferences, updateSettings]);

  const contextValue = useMemo(() => ({
    ...state,
    updateSettings,
    toggleTheme,
    updateUserName,
    toggleNotification,
  }), [state, updateSettings, toggleTheme, updateUserName, toggleNotification]);

  return (
    <SettingsContext.Provider value={contextValue}>
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

