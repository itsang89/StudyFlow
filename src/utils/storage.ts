import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  COURSES: '@studyflow_courses',
  ASSIGNMENTS: '@studyflow_assignments',
  STUDY_SESSIONS: '@studyflow_study_sessions',
  SETTINGS: '@studyflow_settings',
};

export const storage = {
  // Generic save function
  async save<T>(key: string, data: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(data);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error('Error saving data:', error);
      throw error;
    }
  },

  // Generic load function
  async load<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue, dateReviver) : null;
    } catch (error) {
      console.error('Error loading data:', error);
      return null;
    }
  },

  // Generic delete function
  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing data:', error);
      throw error;
    }
  },

  // Clear all app data
  async clearAll(): Promise<void> {
    try {
      const keys = Object.values(STORAGE_KEYS);
      await AsyncStorage.multiRemove(keys);
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw error;
    }
  },

  keys: STORAGE_KEYS,
};

// Helper function to revive Date objects when parsing JSON
function dateReviver(key: string, value: any): any {
  const dateFields = ['createdAt', 'dueDate', 'completedDate', 'startTime', 'endTime', 'date'];
  if (dateFields.includes(key) && typeof value === 'string') {
    return new Date(value);
  }
  return value;
}

