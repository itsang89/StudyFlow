import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Course, CourseFormData } from '../types/course';
import { storage } from '../utils/storage';

interface CourseState {
  courses: Course[];
  loading: boolean;
}

type CourseAction =
  | { type: 'SET_COURSES'; payload: Course[] }
  | { type: 'ADD_COURSE'; payload: Course }
  | { type: 'UPDATE_COURSE'; payload: Course }
  | { type: 'DELETE_COURSE'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean };

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
      return { ...state, courses: action.payload, loading: false };
    case 'ADD_COURSE':
      return { ...state, courses: [...state.courses, action.payload] };
    case 'UPDATE_COURSE':
      return {
        ...state,
        courses: state.courses.map((course) =>
          course.id === action.payload.id ? action.payload : course
        ),
      };
    case 'DELETE_COURSE':
      return {
        ...state,
        courses: state.courses.filter((course) => course.id !== action.payload),
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

export const CourseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(courseReducer, { courses: [], loading: true });

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const courses = await storage.load<Course[]>(storage.keys.COURSES);
      dispatch({ type: 'SET_COURSES', payload: courses || [] });
    } catch (error) {
      console.error('Error loading courses:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const saveCourses = async (courses: Course[]) => {
    try {
      await storage.save(storage.keys.COURSES, courses);
    } catch (error) {
      console.error('Error saving courses:', error);
    }
  };

  const addCourse = async (courseData: CourseFormData) => {
    const newCourse: Course = {
      ...courseData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    dispatch({ type: 'ADD_COURSE', payload: newCourse });
    await saveCourses([...state.courses, newCourse]);
  };

  const updateCourse = async (id: string, courseData: CourseFormData) => {
    const existingCourse = state.courses.find((c) => c.id === id);
    if (!existingCourse) return;

    const updatedCourse: Course = {
      ...existingCourse,
      ...courseData,
    };
    dispatch({ type: 'UPDATE_COURSE', payload: updatedCourse });
    const updatedCourses = state.courses.map((c) => (c.id === id ? updatedCourse : c));
    await saveCourses(updatedCourses);
  };

  const deleteCourse = async (id: string) => {
    dispatch({ type: 'DELETE_COURSE', payload: id });
    const updatedCourses = state.courses.filter((c) => c.id !== id);
    await saveCourses(updatedCourses);
  };

  const getCourseById = (id: string): Course | undefined => {
    return state.courses.find((c) => c.id === id);
  };

  return (
    <CourseContext.Provider
      value={{
        ...state,
        addCourse,
        updateCourse,
        deleteCourse,
        getCourseById,
      }}
    >
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

