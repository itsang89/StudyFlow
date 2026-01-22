import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { StudySession, StudySessionFormData } from '../types/studySession';
import { storage } from '../utils/storage';

interface StudySessionState {
  sessions: StudySession[];
  loading: boolean;
}

type StudySessionAction =
  | { type: 'SET_SESSIONS'; payload: StudySession[] }
  | { type: 'ADD_SESSION'; payload: StudySession }
  | { type: 'DELETE_SESSION'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean };

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
      return { ...state, sessions: action.payload, loading: false };
    case 'ADD_SESSION':
      return { ...state, sessions: [...state.sessions, action.payload] };
    case 'DELETE_SESSION':
      return {
        ...state,
        sessions: state.sessions.filter((session) => session.id !== action.payload),
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

export const StudySessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(studySessionReducer, { sessions: [], loading: true });

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const sessions = await storage.load<StudySession[]>(storage.keys.STUDY_SESSIONS);
      dispatch({ type: 'SET_SESSIONS', payload: sessions || [] });
    } catch (error) {
      console.error('Error loading study sessions:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const saveSessions = async (sessions: StudySession[]) => {
    try {
      await storage.save(storage.keys.STUDY_SESSIONS, sessions);
    } catch (error) {
      console.error('Error saving study sessions:', error);
    }
  };

  const addSession = async (sessionData: StudySessionFormData) => {
    const newSession: StudySession = {
      ...sessionData,
      id: Date.now().toString(),
    };
    dispatch({ type: 'ADD_SESSION', payload: newSession });
    await saveSessions([...state.sessions, newSession]);
  };

  const deleteSession = async (id: string) => {
    dispatch({ type: 'DELETE_SESSION', payload: id });
    const updatedSessions = state.sessions.filter((s) => s.id !== id);
    await saveSessions(updatedSessions);
  };

  const getSessionsByCourse = (courseId: string): StudySession[] => {
    return state.sessions.filter((s) => s.courseId === courseId);
  };

  const getTotalStudyTime = (): number => {
    return state.sessions.reduce((total, session) => total + session.duration, 0);
  };

  const getWeeklyStudyTime = (): number => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return state.sessions
      .filter((session) => session.date >= oneWeekAgo)
      .reduce((total, session) => total + session.duration, 0);
  };

  const getStudyTimeByDate = (date: Date): number => {
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
  };

  return (
    <StudySessionContext.Provider
      value={{
        ...state,
        addSession,
        deleteSession,
        getSessionsByCourse,
        getTotalStudyTime,
        getWeeklyStudyTime,
        getStudyTimeByDate,
      }}
    >
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

