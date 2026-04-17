import { useCallback, useEffect, useState } from 'react'

/**
 * Storage key used to persist the user's theme preference in localStorage.
 * @type {string}
 */
export const THEME_STORAGE_KEY = 'theme'

/** @type {'light'} */
export const THEME_LIGHT = 'light'
/** @type {'dark'} */
export const THEME_DARK = 'dark'

/**
 * Media query used to detect whether the user's OS prefers a dark color scheme.
 * @type {string}
 */
const PREFERS_DARK_MEDIA_QUERY = '(prefers-color-scheme: dark)'

/**
 * Reads the initial theme.
 *
 * Priority:
 *   1. Persisted value in localStorage (if valid).
 *   2. The OS-level `prefers-color-scheme` media query.
 *   3. Light as a safe default.
 *
 * Safe to call in non-browser environments (returns the light default).
 *
 * @returns {'light' | 'dark'}
 */
export function getInitialTheme() {
  if (typeof window === 'undefined') {
    return THEME_LIGHT
  }

  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
    if (stored === THEME_LIGHT || stored === THEME_DARK) {
      return stored
    }
  } catch {
    // localStorage can throw in private-mode / sandboxed contexts — fall through.
  }

  if (
    typeof window.matchMedia === 'function' &&
    window.matchMedia(PREFERS_DARK_MEDIA_QUERY).matches
  ) {
    return THEME_DARK
  }

  return THEME_LIGHT
}

/**
 * React hook that manages the current theme, syncs it with `localStorage`,
 * and applies the `dark` class to `<html>` for Tailwind's `darkMode: 'class'`.
 *
 * @returns {{
 *   theme: 'light' | 'dark',
 *   toggleTheme: () => void,
 *   setTheme: (next: 'light' | 'dark') => void,
 * }}
 */
export default function useTheme() {
  const [theme, setThemeState] = useState(getInitialTheme)

  // Apply the theme to <html> and persist it whenever it changes.
  useEffect(() => {
    if (typeof document === 'undefined') return

    const root = document.documentElement
    if (theme === THEME_DARK) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch {
      // Ignore storage failures — the in-memory state is still authoritative.
    }
  }, [theme])

  const setTheme = useCallback((next) => {
    if (next !== THEME_LIGHT && next !== THEME_DARK) {
      throw new Error(
        `Invalid theme "${next}". Expected "${THEME_LIGHT}" or "${THEME_DARK}".`,
      )
    }
    setThemeState(next)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((current) => (current === THEME_DARK ? THEME_LIGHT : THEME_DARK))
  }, [])

  return { theme, toggleTheme, setTheme }
}
