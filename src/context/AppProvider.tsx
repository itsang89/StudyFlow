import React, { ReactNode } from 'react';
import { CourseProvider } from './CourseContext';
import { AssignmentProvider } from './AssignmentContext';
import { StudySessionProvider } from './StudySessionContext';
import { SettingsProvider } from './SettingsContext';

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <SettingsProvider>
      <CourseProvider>
        <AssignmentProvider>
          <StudySessionProvider>
            {children}
          </StudySessionProvider>
        </AssignmentProvider>
      </CourseProvider>
    </SettingsProvider>
  );
};

