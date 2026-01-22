export interface CourseSchedule {
  day: number; // 0-6 (Sunday-Saturday)
  startTime: string; // "HH:mm" format
  endTime: string; // "HH:mm" format
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

