/**
 * Analytics events placeholder
 * Replace with your actual analytics implementation (e.g., Mixpanel, Amplitude, Segment)
 */

type EventProperties = Record<string, unknown>;

export function track(eventName: string, properties?: EventProperties): void {
  // TODO: Implement actual analytics tracking
  console.log(`[Analytics] ${eventName}`, properties);
}

// Event name constants for consistency
export const Events = {
  // Auth events
  SIGN_IN: 'sign_in',
  SIGN_UP: 'sign_up',
  SIGN_OUT: 'sign_out',
  
  // Onboarding events
  ONBOARDING_STARTED: 'onboarding_started',
  ONBOARDING_STEP_VIEWED: 'onboarding_step_viewed',
  ONBOARDING_GOAL_SELECTED: 'onboarding_goal_selected',
  ONBOARDING_HABITS_SELECTED: 'onboarding_habits_selected',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  
  // Notification events
  NOTIFICATION_PERMISSION_ALLOWED: 'notification_permission_allowed',
  NOTIFICATION_PERMISSION_DENIED: 'notification_permission_denied',
  
  // Habit events
  HABIT_CREATED: 'habit_created',
  HABIT_UPDATED: 'habit_updated',
  HABIT_ARCHIVED: 'habit_archived',
  HABIT_LOGGED: 'habit_logged',
  
  // Paywall events
  PAYWALL_SHOWN: 'paywall_shown',
  PAYWALL_UPGRADE_CLICKED: 'paywall_upgrade_clicked',
  UPGRADE_SUCCESS: 'upgrade_success',
  
  // General events
  PAGE_VIEW: 'page_view',
  DEMO_DATA_RESET: 'demo_data_reset',
} as const;
