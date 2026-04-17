import { useCallback, useEffect, useState } from 'react'
import {
  DARK_MODE_CLASS,
  PREFERS_DARK_MEDIA_QUERY,
  THEME,
  THEME_STORAGE_KEY,
} from '../constants/theme.js'

/**
 * Read the initially-desired theme.
 *
 * Priority:
 *   1. Value saved in localStorage (user has explicitly chosen before).
 *   2. OS-level `prefers-color-scheme` media query.
 *   3. Light theme, as a safe default.
 *
 * @returns {'light' | 'dark'}
 */
export function getInitialTheme() {
  if (typeof window === 'undefined') {
    return THEME.LIGHT
  }

  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
    if (stored === THEME.LIGHT || stored === THEME.DARK) {
      return stored
    }
  } catch {
    // localStorage may be unavailable (private mode, SSR, etc.). Fall through.
  }

  if (
    typeof window.matchMedia === 'function' &&
    window.matchMedia(PREFERS_DARK_MEDIA_QUERY).matches
  ) {
    return THEME.DARK
  }

  return THEME.LIGHT
}

/**
 * Apply (or remove) the dark-mode class on the <html> element so Tailwind's
 * `dark:` variants take effect.
 *
 * @param {'light' | 'dark'} theme
 */
function applyThemeToDocument(theme) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  if (theme === THEME.DARK) {
    root.classList.add(DARK_MODE_CLASS)
  } else {
    root.classList.remove(DARK_MODE_CLASS)
  }
}

/**
 * React hook that manages the application's light/dark theme.
 *
 * Responsibilities:
 *   - Initializes from localStorage or OS preference.
 *   - Syncs the `dark` class onto <html> whenever the theme changes.
 *   - Persists the selected theme to localStorage.
 *
 * @returns {{
 *   theme: 'light' | 'dark',
 *   toggleTheme: () => void,
 *   setTheme: (next: 'light' | 'dark') => void,
 * }}
 */
export function useTheme() {
  const [theme, setThemeState] = useState(getInitialTheme)

  // Keep <html> class and localStorage in sync with current theme.
  useEffect(() => {
    applyThemeToDocument(theme)
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch {
      // Storage write failures are non-fatal — the UI still works in-session.
    }
  }, [theme])

  const setTheme = useCallback((next) => {
    if (next !== THEME.LIGHT && next !== THEME.DARK) {
      throw new Error(
        `useTheme.setTheme: invalid theme "${next}". Expected "light" or "dark".`,
      )
    }
    setThemeState(next)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((current) =>
      current === THEME.DARK ? THEME.LIGHT : THEME.DARK,
    )
  }, [])

  return { theme, toggleTheme, setTheme }
}
