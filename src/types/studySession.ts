export interface StudySession {
  id: string;
  courseId: string;
  startTime: Date;
  endTime: Date;
  duration: number; // seconds
  notes: string;
  date: Date;
}

export type StudySessionFormData = Omit<StudySession, 'id'>;

