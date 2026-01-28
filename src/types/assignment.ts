/**
 * Types of assignments available in the app
 */
export type AssignmentType = 'assignment' | 'exam' | 'project';

/**
 * Priority levels for assignments
 */
export type PriorityLevel = 'low' | 'medium' | 'high';

/**
 * Represents an academic assignment or deadline
 */
export interface Assignment {
  /** Unique identifier for the assignment */
  id: string;
  /** Title of the assignment */
  title: string;
  /** ID of the course this assignment belongs to */
  courseId: string;
  /** Due date and time */
  dueDate: Date;
  /** Category of the assignment */
  type: AssignmentType;
  /** Importance level */
  priority: PriorityLevel;
  /** Additional notes or details */
  description: string;
  /** Whether the assignment is completed */
  completed: boolean;
  /** Date when the assignment was marked as completed */
  completedDate?: Date;
  /** Date when the assignment record was created */
  createdAt: Date;
}

/**
 * Data required to create or update an assignment
 */
export type AssignmentFormData = Omit<Assignment, 'id' | 'createdAt' | 'completed' | 'completedDate'>;

