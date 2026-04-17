/**
 * Shared constants for the theme system.
 *
 * Centralized so components, hooks, and tests never drift on string values.
 */

/** Valid theme values. */
export const THEME = Object.freeze({
  LIGHT: 'light',
  DARK: 'dark',
})

/** localStorage key used to persist the user's explicit theme choice. */
export const THEME_STORAGE_KEY = 'portfolio:theme'

/** CSS class applied to <html> when dark mode is active (Tailwind `darkMode: 'class'`). */
export const DARK_CLASS_NAME = 'dark'

/** Media query used to detect the OS-level dark preference. */
export const PREFERS_DARK_MEDIA_QUERY = '(prefers-color-scheme: dark)'
