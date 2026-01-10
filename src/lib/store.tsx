import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { User, Habit, HabitLog, AppSettings, Streak, WeeklyInsights, DayStats } from './types';
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval, parseISO, isEqual } from 'date-fns';

interface AppState {
  user: User | null;
  habits: Habit[];
  logs: HabitLog[];
  settings: AppSettings;
  isLoading: boolean;
}

interface AppContextValue extends AppState {
  // Auth actions
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
  updateUser: (updates: Partial<User>) => void;
  
  // Habit actions
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt'>) => Habit;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  archiveHabit: (id: string) => void;
  
  // Log actions
  logHabit: (habitId: string, completed: boolean, value?: number) => void;
  getLogsForDate: (date: string) => HabitLog[];
  
  // Streak calculations
  getStreak: (habitId: string) => Streak;
  getAllStreaks: () => Streak[];
  
  // Insights
  getWeeklyInsights: (weekStart: Date) => WeeklyInsights;
  getTodayProgress: () => { completed: number; total: number };
  
  // Settings
  updateSettings: (updates: Partial<AppSettings>) => void;
  
  // Utilities
  upgradeToPro: () => void;
  resetDemoData: () => void;
  canAddMoreHabits: () => boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

const STORAGE_KEYS = {
  user: 'looply_user',
  habits: 'looply_habits',
  logs: 'looply_logs',
  settings: 'looply_settings',
};

const defaultSettings: AppSettings = {
  notificationPermission: 'unknown',
};

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

function getToday(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({
    user: null,
    habits: [],
    logs: [],
    settings: defaultSettings,
    isLoading: true,
  });

  // Load from localStorage on mount
  useEffect(() => {
    const user = localStorage.getItem(STORAGE_KEYS.user);
    const habits = localStorage.getItem(STORAGE_KEYS.habits);
    const logs = localStorage.getItem(STORAGE_KEYS.logs);
    const settings = localStorage.getItem(STORAGE_KEYS.settings);

    setState({
      user: user ? JSON.parse(user) : null,
      habits: habits ? JSON.parse(habits) : [],
      logs: logs ? JSON.parse(logs) : [],
      settings: settings ? JSON.parse(settings) : defaultSettings,
      isLoading: false,
    });
  }, []);

  // Persist to localStorage on changes
  useEffect(() => {
    if (state.isLoading) return;
    
    if (state.user) {
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(state.user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.user);
    }
    localStorage.setItem(STORAGE_KEYS.habits, JSON.stringify(state.habits));
    localStorage.setItem(STORAGE_KEYS.logs, JSON.stringify(state.logs));
    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(state.settings));
  }, [state]);

  const signIn = useCallback(async (email: string, _password: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const existingUser = localStorage.getItem(STORAGE_KEYS.user);
    if (existingUser) {
      const user = JSON.parse(existingUser);
      if (user.email === email) {
        setState(prev => ({ ...prev, user }));
        return;
      }
    }
    
    // Create new user on sign in (mock behavior)
    const user: User = {
      id: generateId(),
      name: email.split('@')[0],
      email,
      plan: 'free',
      createdAt: new Date().toISOString(),
      hasCompletedOnboarding: false,
    };
    setState(prev => ({ ...prev, user }));
  }, []);

  const signUp = useCallback(async (name: string, email: string, _password: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user: User = {
      id: generateId(),
      name,
      email,
      plan: 'free',
      createdAt: new Date().toISOString(),
      hasCompletedOnboarding: false,
    };
    setState(prev => ({ ...prev, user, habits: [], logs: [] }));
  }, []);

  const signOut = useCallback(() => {
    setState(prev => ({ ...prev, user: null }));
    localStorage.removeItem(STORAGE_KEYS.user);
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    setState(prev => ({
      ...prev,
      user: prev.user ? { ...prev.user, ...updates } : null,
    }));
  }, []);

  const addHabit = useCallback((habitData: Omit<Habit, 'id' | 'createdAt'>): Habit => {
    const habit: Habit = {
      ...habitData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setState(prev => ({ ...prev, habits: [...prev.habits, habit] }));
    return habit;
  }, []);

  const updateHabit = useCallback((id: string, updates: Partial<Habit>) => {
    setState(prev => ({
      ...prev,
      habits: prev.habits.map(h => h.id === id ? { ...h, ...updates } : h),
    }));
  }, []);

  const archiveHabit = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      habits: prev.habits.map(h => h.id === id ? { ...h, active: false } : h),
    }));
  }, []);

  const logHabit = useCallback((habitId: string, completed: boolean, value?: number) => {
    const today = getToday();
    setState(prev => {
      const existingLogIndex = prev.logs.findIndex(
        l => l.habitId === habitId && l.date === today
      );
      
      const newLog: HabitLog = {
        id: existingLogIndex >= 0 ? prev.logs[existingLogIndex].id : generateId(),
        habitId,
        date: today,
        completed,
        value,
        createdAt: new Date().toISOString(),
      };

      const newLogs = existingLogIndex >= 0
        ? prev.logs.map((l, i) => i === existingLogIndex ? newLog : l)
        : [...prev.logs, newLog];

      return { ...prev, logs: newLogs };
    });
  }, []);

  const getLogsForDate = useCallback((date: string): HabitLog[] => {
    return state.logs.filter(l => l.date === date);
  }, [state.logs]);

  const getStreak = useCallback((habitId: string): Streak => {
    const habitLogs = state.logs
      .filter(l => l.habitId === habitId && l.completed)
      .sort((a, b) => b.date.localeCompare(a.date));

    if (habitLogs.length === 0) {
      return { habitId, currentStreak: 0, longestStreak: 0 };
    }

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let checkDate = new Date();
    
    // Check if today is logged
    const todayStr = getToday();
    const todayLogged = habitLogs.some(l => l.date === todayStr);
    
    if (!todayLogged) {
      // Start checking from yesterday if today not logged
      checkDate = subDays(checkDate, 1);
    }

    for (let i = 0; i < 365; i++) {
      const dateStr = format(checkDate, 'yyyy-MM-dd');
      const hasLog = habitLogs.some(l => l.date === dateStr);
      
      if (hasLog) {
        tempStreak++;
        if (i < 30) currentStreak = tempStreak; // Only count recent as current
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        if (i < 30) currentStreak = tempStreak;
        tempStreak = 0;
      }
      
      checkDate = subDays(checkDate, 1);
    }
    
    longestStreak = Math.max(longestStreak, tempStreak);
    
    return {
      habitId,
      currentStreak,
      longestStreak,
      lastCompletedDate: habitLogs[0]?.date,
    };
  }, [state.logs]);

  const getAllStreaks = useCallback((): Streak[] => {
    return state.habits.filter(h => h.active).map(h => getStreak(h.id));
  }, [state.habits, getStreak]);

  const getWeeklyInsights = useCallback((weekStart: Date): WeeklyInsights => {
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: startOfWeek(weekStart, { weekStartsOn: 1 }), end: weekEnd });
    
    const activeHabits = state.habits.filter(h => h.active);
    
    const dailyStats: DayStats[] = days.map(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const dayLogs = state.logs.filter(l => l.date === dateStr);
      const completed = dayLogs.filter(l => l.completed).length;
      
      return {
        date: dateStr,
        totalHabits: activeHabits.length,
        completedHabits: completed,
        completionRate: activeHabits.length > 0 ? (completed / activeHabits.length) * 100 : 0,
      };
    });

    const totalPossible = dailyStats.reduce((sum, d) => sum + d.totalHabits, 0);
    const totalCompleted = dailyStats.reduce((sum, d) => sum + d.completedHabits, 0);
    const completionRate = totalPossible > 0 ? (totalCompleted / totalPossible) * 100 : 0;

    const sortedByRate = [...dailyStats].sort((a, b) => b.completionRate - a.completionRate);
    const bestDay = sortedByRate[0]?.completionRate > 0 
      ? { day: format(parseISO(sortedByRate[0].date), 'EEEE'), rate: sortedByRate[0].completionRate }
      : null;
    const hardestDay = sortedByRate[sortedByRate.length - 1]?.completionRate < 100
      ? { day: format(parseISO(sortedByRate[sortedByRate.length - 1].date), 'EEEE'), rate: sortedByRate[sortedByRate.length - 1].completionRate }
      : null;

    // Find most consistent habit
    let mostConsistentHabit: Habit | null = null;
    let bestConsistency = 0;
    
    for (const habit of activeHabits) {
      const habitCompletions = days.filter(day => {
        const dateStr = format(day, 'yyyy-MM-dd');
        return state.logs.some(l => l.habitId === habit.id && l.date === dateStr && l.completed);
      }).length;
      
      if (habitCompletions > bestConsistency) {
        bestConsistency = habitCompletions;
        mostConsistentHabit = habit;
      }
    }

    return {
      completionRate,
      bestDay,
      hardestDay,
      mostConsistentHabit,
      dailyStats,
    };
  }, [state.habits, state.logs]);

  const getTodayProgress = useCallback(() => {
    const today = getToday();
    const activeHabits = state.habits.filter(h => h.active);
    const todayLogs = state.logs.filter(l => l.date === today && l.completed);
    
    return {
      completed: todayLogs.length,
      total: activeHabits.length,
    };
  }, [state.habits, state.logs]);

  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    setState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...updates },
    }));
  }, []);

  const upgradeToPro = useCallback(() => {
    setState(prev => ({
      ...prev,
      user: prev.user ? { ...prev.user, plan: 'pro' } : null,
    }));
  }, []);

  const resetDemoData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.user);
    localStorage.removeItem(STORAGE_KEYS.habits);
    localStorage.removeItem(STORAGE_KEYS.logs);
    localStorage.removeItem(STORAGE_KEYS.settings);
    
    setState({
      user: null,
      habits: [],
      logs: [],
      settings: defaultSettings,
      isLoading: false,
    });
  }, []);

  const canAddMoreHabits = useCallback((): boolean => {
    if (state.user?.plan === 'pro') return true;
    const activeHabits = state.habits.filter(h => h.active);
    return activeHabits.length < 3;
  }, [state.user?.plan, state.habits]);

  const value: AppContextValue = {
    ...state,
    signIn,
    signUp,
    signOut,
    updateUser,
    addHabit,
    updateHabit,
    archiveHabit,
    logHabit,
    getLogsForDate,
    getStreak,
    getAllStreaks,
    getWeeklyInsights,
    getTodayProgress,
    updateSettings,
    upgradeToPro,
    resetDemoData,
    canAddMoreHabits,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
