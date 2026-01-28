import React, { createContext, useContext, useReducer, useEffect, ReactNode, useCallback, useMemo, useRef } from 'react';
import { Alert } from 'react-native';
import { Assignment, AssignmentFormData } from '../types/assignment';
import { storage } from '../utils/storage';

interface AssignmentState {
  assignments: Assignment[];
  loading: boolean;
  error: string | null;
}

type AssignmentAction =
  | { type: 'SET_ASSIGNMENTS'; payload: Assignment[] }
  | { type: 'ADD_ASSIGNMENT'; payload: Assignment }
  | { type: 'UPDATE_ASSIGNMENT'; payload: Assignment }
  | { type: 'DELETE_ASSIGNMENT'; payload: string }
  | { type: 'TOGGLE_COMPLETE'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

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
      return { ...state, assignments: action.payload, loading: false, error: null };
    case 'ADD_ASSIGNMENT':
      return { ...state, assignments: [...state.assignments, action.payload], error: null };
    case 'UPDATE_ASSIGNMENT':
      return {
        ...state,
        assignments: state.assignments.map((assignment) =>
          assignment.id === action.payload.id ? action.payload : assignment
        ),
        error: null,
      };
    case 'DELETE_ASSIGNMENT':
      return {
        ...state,
        assignments: state.assignments.filter((assignment) => assignment.id !== action.payload),
        error: null,
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
        error: null,
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

export const AssignmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(assignmentReducer, { assignments: [], loading: true, error: null });
  const isInitialMount = useRef(true);

  const loadAssignments = useCallback(async () => {
    try {
      const assignments = await storage.load<Assignment[]>(storage.keys.ASSIGNMENTS);
      dispatch({ type: 'SET_ASSIGNMENTS', payload: assignments || [] });
    } catch (error) {
      console.error('Error loading assignments:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load assignments' });
    }
  }, []);

  useEffect(() => {
    loadAssignments();
  }, [loadAssignments]);

  // Persist assignments to storage whenever they change
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const saveAssignments = async () => {
      try {
        await storage.save(storage.keys.ASSIGNMENTS, state.assignments);
      } catch (error) {
        console.error('Error saving assignments:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to save changes' });
        Alert.alert('Error', 'Failed to save assignment changes. Please try again.');
      }
    };

    if (!state.loading) {
      saveAssignments();
    }
  }, [state.assignments, state.loading]);

  const addAssignment = useCallback(async (assignmentData: AssignmentFormData): Promise<void> => {
    const newAssignment: Assignment = {
      ...assignmentData,
      id: Date.now().toString(),
      completed: false,
      createdAt: new Date(),
    };
    dispatch({ type: 'ADD_ASSIGNMENT', payload: newAssignment });
  }, []);

  const updateAssignment = useCallback(async (id: string, assignmentData: AssignmentFormData): Promise<void> => {
    const existingAssignment = state.assignments.find((a) => a.id === id);
    if (!existingAssignment) return;

    const updatedAssignment: Assignment = {
      ...existingAssignment,
      ...assignmentData,
    };
    dispatch({ type: 'UPDATE_ASSIGNMENT', payload: updatedAssignment });
  }, [state.assignments]);

  const deleteAssignment = useCallback(async (id: string): Promise<void> => {
    dispatch({ type: 'DELETE_ASSIGNMENT', payload: id });
  }, []);

  const toggleComplete = useCallback(async (id: string): Promise<void> => {
    dispatch({ type: 'TOGGLE_COMPLETE', payload: id });
  }, []);

  const getAssignmentById = useCallback((id: string): Assignment | undefined => {
    return state.assignments.find((a) => a.id === id);
  }, [state.assignments]);

  const getAssignmentsByCourse = useCallback((courseId: string): Assignment[] => {
    return state.assignments.filter((a) => a.courseId === courseId);
  }, [state.assignments]);

  const getUpcomingAssignments = useCallback(() : Assignment[] => {
    const now = new Date();
    return state.assignments
      .filter((a) => !a.completed && a.dueDate >= now)
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  }, [state.assignments]);

  const contextValue = useMemo(() => ({
    ...state,
    addAssignment,
    updateAssignment,
    deleteAssignment,
    toggleComplete,
    getAssignmentById,
    getAssignmentsByCourse,
    getUpcomingAssignments,
  }), [
    state,
    addAssignment,
    updateAssignment,
    deleteAssignment,
    toggleComplete,
    getAssignmentById,
    getAssignmentsByCourse,
    getUpcomingAssignments
  ]);

  return (
    <AssignmentContext.Provider value={contextValue}>
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

