export type Plan = 'free' | 'pro';

export type HabitType = 'walk' | 'water' | 'meditate' | 'sleep' | 'custom';

export type NotificationPermission = 'unknown' | 'allowed' | 'denied';

export interface User {
  id: string;
  name: string;
  email: string;
  plan: Plan;
  createdAt: string;
  hasCompletedOnboarding: boolean;
}

export interface Habit {
  id: string;
  title: string;
  type: HabitType;
  frequency: 'daily';
  target?: number;
  unit?: string;
  icon?: string;
  createdAt: string;
  active: boolean;
}

export interface HabitLog {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD
  value?: number;
  completed: boolean;
  createdAt: string;
}

export interface AppSettings {
  notificationPermission: NotificationPermission;
  reminderTime?: string; // HH:mm format
}

export interface Streak {
  habitId: string;
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate?: string;
}

export interface DayStats {
  date: string;
  totalHabits: number;
  completedHabits: number;
  completionRate: number;
}

export interface WeeklyInsights {
  completionRate: number;
  bestDay: { day: string; rate: number } | null;
  hardestDay: { day: string; rate: number } | null;
  mostConsistentHabit: Habit | null;
  dailyStats: DayStats[];
}
