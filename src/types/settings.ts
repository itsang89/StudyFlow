export interface NotificationPreferences {
  classReminders: boolean;
  assignmentAlerts: boolean;
}

export interface UserSettings {
  userName: string;
  theme: 'light' | 'dark';
  notificationPreferences: NotificationPreferences;
}

export const defaultSettings: UserSettings = {
  userName: '',
  theme: 'light',
  notificationPreferences: {
    classReminders: true,
    assignmentAlerts: true,
  },
};

