/**
 * Analytics event names
 * 
 * This file contains all event names as typed string literals.
 * Use these constants when calling track() to ensure consistency.
 */

export const EVENTS = {
  // Auth events
  AUTH_SIGNIN_VIEWED: 'auth_signin_viewed',
  AUTH_SIGNIN_SUBMITTED: 'auth_signin_submitted',
  AUTH_SIGNIN_SUCCEEDED: 'auth_signin_succeeded',
  AUTH_SIGNIN_FAILED: 'auth_signin_failed',
  AUTH_SIGNUP_VIEWED: 'auth_signup_viewed',
  AUTH_SIGNUP_SUBMITTED: 'auth_signup_submitted',
  AUTH_SIGNUP_SUCCEEDED: 'auth_signup_succeeded',
  AUTH_SIGNOUT: 'auth_signout',
  
  // Post-auth routing
  ROUTED_TO_ONBOARDING: 'routed_to_onboarding',
  ROUTED_TO_HOME: 'routed_to_home',
  
  // Onboarding events
  ONBOARDING_STEP_VIEWED: 'onboarding_step_viewed',
  ONBOARDING_STEP_COMPLETED: 'onboarding_step_completed',
  ONBOARDING_GOAL_SELECTED: 'onboarding_goal_selected',
  ONBOARDING_HABIT_TOGGLED: 'onboarding_habit_toggled',
  ONBOARDING_REMINDER_SET: 'onboarding_reminder_set',
  ONBOARDING_REMINDER_SKIPPED: 'onboarding_reminder_skipped',
  NOTIFICATION_PERMISSION_PROMPT_ACCEPTED: 'notification_permission_prompt_accepted',
  NOTIFICATION_PERMISSION_PROMPT_DISMISSED: 'notification_permission_prompt_dismissed',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  
  // Home events
  HOME_VIEWED: 'home_viewed',
  HOME_CTA_LOG_CLICKED: 'home_cta_log_clicked',
  
  // Log events
  LOG_TODAY_VIEWED: 'log_today_viewed',
  HABIT_LOG_TOGGLED: 'habit_log_toggled',
  HABIT_LOG_VALUE_CHANGED: 'habit_log_value_changed',
  DAY_COMPLETED_CLICKED: 'day_completed_clicked',
  DAY_COMPLETED_SUCCEEDED: 'day_completed_succeeded',
  DAY_COMPLETION_DIALOG_SHOWN: 'day_completion_dialog_shown',
  DAY_COMPLETION_VIEW_INSIGHTS_CLICKED: 'day_completion_view_insights_clicked',
  
  // Habits events
  HABITS_VIEWED: 'habits_viewed',
  HABIT_ADD_CLICKED: 'habit_add_clicked',
  HABIT_ADD_DIALOG_OPENED: 'habit_add_dialog_opened',
  HABIT_CREATED: 'habit_created',
  HABIT_UPDATED: 'habit_updated',
  HABIT_ARCHIVED: 'habit_archived',
  HABIT_REACTIVATED: 'habit_reactivated',
  
  // Insights events
  INSIGHTS_VIEWED: 'insights_viewed',
  INSIGHTS_WEEK_CHANGED: 'insights_week_changed',
  PRO_INSIGHTS_LOCKED_VIEWED: 'pro_insights_locked_viewed',
  
  // Settings events
  SETTINGS_VIEWED: 'settings_viewed',
  PLAN_SECTION_VIEWED: 'plan_section_viewed',
  DEMO_RESET_CLICKED: 'demo_reset_clicked',
  DEMO_RESET_CONFIRMED: 'demo_reset_confirmed',
  
  // Paywall events
  PAYWALL_TRIGGERED: 'paywall_triggered',
  PAYWALL_VIEWED: 'paywall_viewed',
  UPGRADE_CLICKED: 'upgrade_clicked',
  UPGRADE_SUCCEEDED: 'upgrade_succeeded',
  PAYWALL_DISMISSED: 'paywall_dismissed',
} as const;

// Export type for TypeScript users
export type EventName = typeof EVENTS[keyof typeof EVENTS];
