/**
 * Analytics events - Re-exports from analytics module
 * This file provides backward compatibility with existing imports
 */

// Re-export everything from the new analytics module
export { track, setAnalyticsEnabled, getAnalyticsEnabled, getCurrentSessionId } from './analytics/track';
export { EVENTS, EVENTS as Events } from './analytics/events';
