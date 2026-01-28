/**
 * Represents a day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
 */
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Represents a time in "HH:mm" format
 */
export type TimeString = string & { readonly __brand: 'TimeString' };

export interface CourseSchedule {
  day: DayOfWeek;
  startTime: TimeString;
  endTime: TimeString;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  instructor: string;
  location: string;
  color: string;
  schedule: CourseSchedule[];
  createdAt: Date;
}

export type CourseFormData = Omit<Course, 'id' | 'createdAt'>;

