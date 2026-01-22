import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Assignment, AssignmentFormData } from '../types/assignment';
import { storage } from '../utils/storage';

interface AssignmentState {
  assignments: Assignment[];
  loading: boolean;
}

type AssignmentAction =
  | { type: 'SET_ASSIGNMENTS'; payload: Assignment[] }
  | { type: 'ADD_ASSIGNMENT'; payload: Assignment }
  | { type: 'UPDATE_ASSIGNMENT'; payload: Assignment }
  | { type: 'DELETE_ASSIGNMENT'; payload: string }
  | { type: 'TOGGLE_COMPLETE'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean };

interface AssignmentContextType extends AssignmentState {
  addAssignment: (assignmentData: AssignmentFormData) => Promise<void>;
  updateAssignment: (id: string, assignmentData: AssignmentFormData) => Promise<void>;
  deleteAssignment: (id: string) => Promise<void>;
  toggleComplete: (id: string) => Promise<void>;
  getAssignmentById: (id: string) => Assignment | undefined;
  getAssignmentsByCourse: (courseId: string) => Assignment[];
  getUpcomingAssignments: () => Assignment[];
}

const AssignmentContext = createContext<AssignmentContextType | undefined>(undefined);

const assignmentReducer = (state: AssignmentState, action: AssignmentAction): AssignmentState => {
  switch (action.type) {
    case 'SET_ASSIGNMENTS':
      return { ...state, assignments: action.payload, loading: false };
    case 'ADD_ASSIGNMENT':
      return { ...state, assignments: [...state.assignments, action.payload] };
    case 'UPDATE_ASSIGNMENT':
      return {
        ...state,
        assignments: state.assignments.map((assignment) =>
          assignment.id === action.payload.id ? action.payload : assignment
        ),
      };
    case 'DELETE_ASSIGNMENT':
      return {
        ...state,
        assignments: state.assignments.filter((assignment) => assignment.id !== action.payload),
      };
    case 'TOGGLE_COMPLETE':
      return {
        ...state,
        assignments: state.assignments.map((assignment) =>
          assignment.id === action.payload
            ? {
                ...assignment,
                completed: !assignment.completed,
                completedDate: !assignment.completed ? new Date() : undefined,
              }
            : assignment
        ),
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

export const AssignmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(assignmentReducer, { assignments: [], loading: true });

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      const assignments = await storage.load<Assignment[]>(storage.keys.ASSIGNMENTS);
      dispatch({ type: 'SET_ASSIGNMENTS', payload: assignments || [] });
    } catch (error) {
      console.error('Error loading assignments:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const saveAssignments = async (assignments: Assignment[]) => {
    try {
      await storage.save(storage.keys.ASSIGNMENTS, assignments);
    } catch (error) {
      console.error('Error saving assignments:', error);
    }
  };

  const addAssignment = async (assignmentData: AssignmentFormData) => {
    const newAssignment: Assignment = {
      ...assignmentData,
      id: Date.now().toString(),
      completed: false,
      createdAt: new Date(),
    };
    dispatch({ type: 'ADD_ASSIGNMENT', payload: newAssignment });
    await saveAssignments([...state.assignments, newAssignment]);
  };

  const updateAssignment = async (id: string, assignmentData: AssignmentFormData) => {
    const existingAssignment = state.assignments.find((a) => a.id === id);
    if (!existingAssignment) return;

    const updatedAssignment: Assignment = {
      ...existingAssignment,
      ...assignmentData,
    };
    dispatch({ type: 'UPDATE_ASSIGNMENT', payload: updatedAssignment });
    const updatedAssignments = state.assignments.map((a) =>
      a.id === id ? updatedAssignment : a
    );
    await saveAssignments(updatedAssignments);
  };

  const deleteAssignment = async (id: string) => {
    dispatch({ type: 'DELETE_ASSIGNMENT', payload: id });
    const updatedAssignments = state.assignments.filter((a) => a.id !== id);
    await saveAssignments(updatedAssignments);
  };

  const toggleComplete = async (id: string) => {
    dispatch({ type: 'TOGGLE_COMPLETE', payload: id });
    const updatedAssignments = state.assignments.map((assignment) =>
      assignment.id === id
        ? {
            ...assignment,
            completed: !assignment.completed,
            completedDate: !assignment.completed ? new Date() : undefined,
          }
        : assignment
    );
    await saveAssignments(updatedAssignments);
  };

  const getAssignmentById = (id: string): Assignment | undefined => {
    return state.assignments.find((a) => a.id === id);
  };

  const getAssignmentsByCourse = (courseId: string): Assignment[] => {
    return state.assignments.filter((a) => a.courseId === courseId);
  };

  const getUpcomingAssignments = (): Assignment[] => {
    const now = new Date();
    return state.assignments
      .filter((a) => !a.completed && a.dueDate >= now)
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  };

  return (
    <AssignmentContext.Provider
      value={{
        ...state,
        addAssignment,
        updateAssignment,
        deleteAssignment,
        toggleComplete,
        getAssignmentById,
        getAssignmentsByCourse,
        getUpcomingAssignments,
      }}
    >
      {children}
    </AssignmentContext.Provider>
  );
};

export const useAssignments = () => {
  const context = useContext(AssignmentContext);
  if (context === undefined) {
    throw new Error('useAssignments must be used within an AssignmentProvider');
  }
  return context;
};

