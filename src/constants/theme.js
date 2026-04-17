/**
 * Theme-related constants shared across the theme system.
 * Centralized to avoid magic strings scattered across components.
 */

/** Valid theme values. */
export const THEME = Object.freeze({
  LIGHT: 'light',
  DARK: 'dark',
})

/** localStorage key used to persist the user's theme preference. */
export const THEME_STORAGE_KEY = 'portfolio:theme'

/** CSS class Tailwind uses (darkMode: 'class') to activate dark styles. */
export const DARK_CLASS_NAME = 'dark'

/** Media query used to detect the user's OS-level color scheme preference. */
export const PREFERS_DARK_MEDIA_QUERY = '(prefers-color-scheme: dark)'
