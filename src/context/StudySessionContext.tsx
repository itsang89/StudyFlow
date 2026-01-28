import React, { createContext, useContext, useReducer, useEffect, ReactNode, useCallback, useMemo, useRef } from 'react';
import { Alert } from 'react-native';
import { StudySession, StudySessionFormData } from '../types/studySession';
import { storage } from '../utils/storage';

interface StudySessionState {
  sessions: StudySession[];
  loading: boolean;
  error: string | null;
}

type StudySessionAction =
  | { type: 'SET_SESSIONS'; payload: StudySession[] }
  | { type: 'ADD_SESSION'; payload: StudySession }
  | { type: 'DELETE_SESSION'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

interface StudySessionContextType extends StudySessionState {
  addSession: (sessionData: StudySessionFormData) => Promise<void>;
  deleteSession: (id: string) => Promise<void>;
  getSessionsByCourse: (courseId: string) => StudySession[];
  getTotalStudyTime: () => number;
  getWeeklyStudyTime: () => number;
  getStudyTimeByDate: (date: Date) => number;
}

const StudySessionContext = createContext<StudySessionContextType | undefined>(undefined);

const studySessionReducer = (state: StudySessionState, action: StudySessionAction): StudySessionState => {
  switch (action.type) {
    case 'SET_SESSIONS':
      return { ...state, sessions: action.payload, loading: false, error: null };
    case 'ADD_SESSION':
      return { ...state, sessions: [...state.sessions, action.payload], error: null };
    case 'DELETE_SESSION':
      return {
        ...state,
        sessions: state.sessions.filter((session) => session.id !== action.payload),
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

export const StudySessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(studySessionReducer, { sessions: [], loading: true, error: null });
  const isInitialMount = useRef(true);

  const loadSessions = useCallback(async () => {
    try {
      const sessions = await storage.load<StudySession[]>(storage.keys.STUDY_SESSIONS);
      dispatch({ type: 'SET_SESSIONS', payload: sessions || [] });
    } catch (error) {
      console.error('Error loading study sessions:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load study sessions' });
    }
  }, []);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  // Persist sessions to storage whenever they change
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const saveSessions = async () => {
      try {
        await storage.save(storage.keys.STUDY_SESSIONS, state.sessions);
      } catch (error) {
        console.error('Error saving study sessions:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to save changes' });
        Alert.alert('Error', 'Failed to save study sessions. Please try again.');
      }
    };

    if (!state.loading) {
      saveSessions();
    }
  }, [state.sessions, state.loading]);

  const addSession = useCallback(async (sessionData: StudySessionFormData): Promise<void> => {
    const newSession: StudySession = {
      ...sessionData,
      id: Date.now().toString(),
    };
    dispatch({ type: 'ADD_SESSION', payload: newSession });
  }, []);

  const deleteSession = useCallback(async (id: string): Promise<void> => {
    dispatch({ type: 'DELETE_SESSION', payload: id });
  }, []);

  const getSessionsByCourse = useCallback((courseId: string): StudySession[] => {
    return state.sessions.filter((s) => s.courseId === courseId);
  }, [state.sessions]);

  const getTotalStudyTime = useCallback((): number => {
    return state.sessions.reduce((total, session) => total + session.duration, 0);
  }, [state.sessions]);

  const getWeeklyStudyTime = useCallback((): number => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return state.sessions
      .filter((session) => {
        const sessionDate = new Date(session.date);
        return sessionDate >= oneWeekAgo;
      })
      .reduce((total, session) => total + session.duration, 0);
  }, [state.sessions]);

  const getStudyTimeByDate = useCallback((date: Date): number => {
    return state.sessions
      .filter((session) => {
        const sessionDate = new Date(session.date);
        return (
          sessionDate.getFullYear() === date.getFullYear() &&
          sessionDate.getMonth() === date.getMonth() &&
          sessionDate.getDate() === date.getDate()
        );
      })
      .reduce((total, session) => total + session.duration, 0);
  }, [state.sessions]);

  const contextValue = useMemo(() => ({
    ...state,
    addSession,
    deleteSession,
    getSessionsByCourse,
    getTotalStudyTime,
    getWeeklyStudyTime,
    getStudyTimeByDate,
  }), [
    state,
    addSession,
    deleteSession,
    getSessionsByCourse,
    getTotalStudyTime,
    getWeeklyStudyTime,
    getStudyTimeByDate
  ]);

  return (
    <StudySessionContext.Provider value={contextValue}>
      {children}
    </StudySessionContext.Provider>
  );
};

export const useStudySessions = () => {
  const context = useContext(StudySessionContext);
  if (context === undefined) {
    throw new Error('useStudySessions must be used within a StudySessionProvider');
  }
  return context;
};

