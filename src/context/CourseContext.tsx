import React, { createContext, useContext, useReducer, useEffect, ReactNode, useCallback, useMemo, useRef } from 'react';
import { Alert } from 'react-native';
import { Course, CourseFormData } from '../types/course';
import { storage } from '../utils/storage';

interface CourseState {
  courses: Course[];
  loading: boolean;
  error: string | null;
}

type CourseAction =
  | { type: 'SET_COURSES'; payload: Course[] }
  | { type: 'ADD_COURSE'; payload: Course }
  | { type: 'UPDATE_COURSE'; payload: Course }
  | { type: 'DELETE_COURSE'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

interface CourseContextType extends CourseState {
  addCourse: (courseData: CourseFormData) => Promise<void>;
  updateCourse: (id: string, courseData: CourseFormData) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  getCourseById: (id: string) => Course | undefined;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

const courseReducer = (state: CourseState, action: CourseAction): CourseState => {
  switch (action.type) {
    case 'SET_COURSES':
      return { ...state, courses: action.payload, loading: false, error: null };
    case 'ADD_COURSE':
      return { ...state, courses: [...state.courses, action.payload], error: null };
    case 'UPDATE_COURSE':
      return {
        ...state,
        courses: state.courses.map((course) =>
          course.id === action.payload.id ? action.payload : course
        ),
        error: null,
      };
    case 'DELETE_COURSE':
      return {
        ...state,
        courses: state.courses.filter((course) => course.id !== action.payload),
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

export const CourseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(courseReducer, { courses: [], loading: true, error: null });
  const isInitialMount = useRef(true);

  const loadCourses = useCallback(async () => {
    try {
      const courses = await storage.load<Course[]>(storage.keys.COURSES);
      dispatch({ type: 'SET_COURSES', payload: courses || [] });
    } catch (error) {
      console.error('Error loading courses:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load courses' });
    }
  }, []);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  // Persist courses to storage whenever they change
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    const saveCourses = async () => {
      try {
        await storage.save(storage.keys.COURSES, state.courses);
      } catch (error) {
        console.error('Error saving courses:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to save changes' });
        Alert.alert('Error', 'Failed to save course changes. Please try again.');
      }
    };

    if (!state.loading) {
      saveCourses();
    }
  }, [state.courses, state.loading]);

  const addCourse = useCallback(async (courseData: CourseFormData): Promise<void> => {
    const newCourse: Course = {
      ...courseData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    dispatch({ type: 'ADD_COURSE', payload: newCourse });
  }, []);

  const updateCourse = useCallback(async (id: string, courseData: CourseFormData): Promise<void> => {
    const existingCourse = state.courses.find((c) => c.id === id);
    if (!existingCourse) return;

    const updatedCourse: Course = {
      ...existingCourse,
      ...courseData,
    };
    dispatch({ type: 'UPDATE_COURSE', payload: updatedCourse });
  }, [state.courses]);

  const deleteCourse = useCallback(async (id: string): Promise<void> => {
    dispatch({ type: 'DELETE_COURSE', payload: id });
  }, []);

  const getCourseById = useCallback((id: string): Course | undefined => {
    return state.courses.find((c) => c.id === id);
  }, [state.courses]);

  const contextValue = useMemo(() => ({
    ...state,
    addCourse,
    updateCourse,
    deleteCourse,
    getCourseById,
  }), [state, addCourse, updateCourse, deleteCourse, getCourseById]);

  return (
    <CourseContext.Provider value={contextValue}>
      {children}
    </CourseContext.Provider>
  );
};

export const useCourses = () => {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error('useCourses must be used within a CourseProvider');
  }
  return context;
};

