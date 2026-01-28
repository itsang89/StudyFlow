/**
 * Represents a completed study session
 */
export interface StudySession {
  /** Unique identifier for the session */
  id: string;
  /** ID of the course studied */
  courseId: string;
  /** Start date and time */
  startTime: Date;
  /** End date and time */
  endTime: Date;
  /** Total duration in seconds */
  duration: number;
  /** Personal notes about the session */
  notes: string;
  /** Reference date for the session (usually same as startTime) */
  date: Date;
}

/**
 * Data required to save a new study session
 */
export type StudySessionFormData = Omit<StudySession, 'id'>;

