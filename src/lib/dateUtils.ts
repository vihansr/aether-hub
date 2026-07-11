/**
 * Date & Time Utility Functions
 * 
 * Centralizes date formatting and timezone-consistent date strings
 * used across Aether Hub activity logs and calendar schedules.
 */

/**
 * Returns today's date formatted as a local `YYYY-MM-DD` string,
 * avoiding UTC offset issues where `new Date().toISOString()` rolls
 * over to the next or previous day prematurely.
 *
 * @returns {string} Today's date formatted as 'YYYY-MM-DD'
 */
export const getTodayDateString = (): string => {
  const d = new Date();
  const offset = d.getTimezoneOffset();
  const localDate = new Date(d.getTime() - offset * 60 * 1000);
  return localDate.toISOString().split('T')[0];
};

/**
 * Returns a date string for `n` days ago formatted as `YYYY-MM-DD`.
 *
 * @param daysAgo - Number of days in the past
 * @returns {string} Date formatted as 'YYYY-MM-DD'
 */
export const getPastDateString = (daysAgo: number): string => {
  const d = new Date(Date.now() - daysAgo * 24 * 3600 * 1000);
  const offset = d.getTimezoneOffset();
  const localDate = new Date(d.getTime() - offset * 60 * 1000);
  return localDate.toISOString().split('T')[0];
};
