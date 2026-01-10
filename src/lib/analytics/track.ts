/**
 * Analytics tracking module
 * 
 * TODO: Journium SDK integration
 * When ready to integrate Journium SDK:
 * 1. Replace console.log with journium.track(eventName, properties)
 * 2. Initialize Journium SDK in main.tsx or App.tsx
 * 3. Remove the feature flag check if Journium handles it
 */

// Feature flag key in localStorage
const ANALYTICS_ENABLED_KEY = 'analyticsEnabled';
const SESSION_ID_KEY = 'sessionId';

// Generate a session ID for this tab session
function getSessionId(): string {
  let sessionId = sessionStorage.getItem(SESSION_ID_KEY);
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    sessionStorage.setItem(SESSION_ID_KEY, sessionId);
  }
  return sessionId;
}

// Check if analytics is enabled
function isAnalyticsEnabled(): boolean {
  const enabled = localStorage.getItem(ANALYTICS_ENABLED_KEY);
  // Default to true if not set (first time)
  if (enabled === null) {
    localStorage.setItem(ANALYTICS_ENABLED_KEY, 'true');
    return true;
  }
  return enabled === 'true';
}

// Get device type
function getDevice(): 'mobile' | 'desktop' {
  return window.innerWidth < 768 ? 'mobile' : 'desktop';
}

// Get user ID from localStorage (if logged in)
function getUserId(): string | null {
  try {
    const userStr = localStorage.getItem('looply_user');
    if (userStr) {
      const user = JSON.parse(userStr);
      return user.id || null;
    }
  } catch (e) {
    // Ignore parse errors
  }
  return null;
}

// Get user plan from localStorage
function getUserPlan(): 'free' | 'pro' | null {
  try {
    const userStr = localStorage.getItem('looply_user');
    if (userStr) {
      const user = JSON.parse(userStr);
      return user.plan || null;
    }
  } catch (e) {
    // Ignore parse errors
  }
  return null;
}

/**
 * Track an analytics event
 * 
 * @param eventName - The name of the event to track
 * @param props - Optional properties to attach to the event
 */
export function track(eventName: string, props?: Record<string, any>): void {
  // Check feature flag
  if (!isAnalyticsEnabled()) {
    return;
  }

  // Build common properties
  const commonProps = {
    ts: new Date().toISOString(),
    path: window.location.pathname,
    userId: getUserId(),
    plan: getUserPlan(),
    device: getDevice(),
    sessionId: getSessionId(),
  };

  // Merge with provided properties
  const allProps = {
    ...commonProps,
    ...props,
  };

  // TODO: replace console.log with journium.track(eventName, allProps)
  console.log('[track]', eventName, allProps);
}

/**
 * Enable or disable analytics tracking
 */
export function setAnalyticsEnabled(enabled: boolean): void {
  localStorage.setItem(ANALYTICS_ENABLED_KEY, enabled ? 'true' : 'false');
}

/**
 * Check if analytics is currently enabled
 */
export function getAnalyticsEnabled(): boolean {
  return isAnalyticsEnabled();
}

/**
 * Get the current session ID
 */
export function getCurrentSessionId(): string {
  return getSessionId();
}
