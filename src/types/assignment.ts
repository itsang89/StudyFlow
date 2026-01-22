export type AssignmentType = 'assignment' | 'exam' | 'project';
export type PriorityLevel = 'low' | 'medium' | 'high';

export interface Assignment {
  id: string;
  title: string;
  courseId: string;
  dueDate: Date;
  type: AssignmentType;
  priority: PriorityLevel;
  description: string;
  completed: boolean;
  completedDate?: Date;
  createdAt: Date;
}

export type AssignmentFormData = Omit<Assignment, 'id' | 'createdAt' | 'completed' | 'completedDate'>;

