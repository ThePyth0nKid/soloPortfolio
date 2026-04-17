/**
 * Centralised theme-related constants. Extracted to avoid magic strings
 * scattered across the codebase and to keep the source of truth in one place.
 */

/** Key used to persist the user's theme choice in localStorage. */
export const THEME_STORAGE_KEY = 'portfolio:theme'

/** Supported theme values. */
export const THEME = Object.freeze({
  LIGHT: 'light',
  DARK: 'dark',
})

/** CSS class applied to <html> that enables Tailwind's `dark:` variants. */
export const DARK_CLASS = 'dark'

/** Media query used to detect the OS-level colour-scheme preference. */
export const PREFERS_DARK_MEDIA_QUERY = '(prefers-color-scheme: dark)'
