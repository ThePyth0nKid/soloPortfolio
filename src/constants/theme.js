/**
 * Theme-related constants. Centralized to avoid magic strings scattered
 * throughout the codebase.
 */

/** localStorage key used to persist the user's theme preference. */
export const THEME_STORAGE_KEY = 'theme-preference'

/** Supported theme values. */
export const THEME = Object.freeze({
  LIGHT: 'light',
  DARK: 'dark',
})

/** CSS media query used to detect the OS-level dark mode preference. */
export const PREFERS_DARK_MEDIA_QUERY = '(prefers-color-scheme: dark)'

/** CSS class Tailwind toggles on the <html> element to enable dark mode. */
export const DARK_MODE_CLASS = 'dark'
