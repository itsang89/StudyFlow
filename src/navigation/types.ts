import { NavigatorScreenParams } from '@react-navigation/native';
import { Assignment } from '../types/assignment';
import { Course } from '../types/course';

export type RootTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  ToDoTab: NavigatorScreenParams<ToDoStackParamList>;
  CalendarTab: NavigatorScreenParams<CalendarStackParamList>;
  StatisticsTab: undefined;
  SettingsTab: NavigatorScreenParams<SettingsStackParamList>;
};

export type HomeStackParamList = {
  Home: undefined;
  Timer: { courseId: string };
};

export type ToDoStackParamList = {
  Assignments: undefined;
  AddEditAssignment: { assignmentId?: string };
};

export type CalendarStackParamList = {
  Calendar: undefined;
  DayView: { date: string };
  WeekView: undefined;
};

export type SettingsStackParamList = {
  Settings: undefined;
  CoursesList: undefined;
  AddEditCourse: { courseId?: string };
};

