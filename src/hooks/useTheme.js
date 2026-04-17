import { useCallback, useEffect, useState } from 'react'

/**
 * Storage key used to persist the user's theme preference across reloads.
 * @type {string}
 */
export const THEME_STORAGE_KEY = 'portfolio-theme'

/** @type {'light'} */
export const THEME_LIGHT = 'light'
/** @type {'dark'} */
export const THEME_DARK = 'dark'

/**
 * Determines the initial theme, in priority order:
 *   1. Previously saved value in localStorage
 *   2. The user's OS-level `prefers-color-scheme` setting
 *   3. Fallback to light
 *
 * Safe to call during SSR — returns the fallback if `window` is undefined.
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
    // localStorage may be unavailable (private mode, disabled cookies, etc.).
    // Fall through to system preference.
  }

  if (
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    return THEME_DARK
  }

  return THEME_LIGHT
}

/**
 * Applies the given theme to the document root by toggling the `dark` class
 * (which Tailwind's `darkMode: 'class'` strategy keys off of).
 *
 * @param {'light' | 'dark'} theme
 */
export function applyThemeToDocument(theme) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  if (theme === THEME_DARK) {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

/**
 * React hook that manages the application theme.
 *
 * - Initializes from localStorage, then OS preference.
 * - Persists changes to localStorage.
 * - Syncs the `dark` class on <html> whenever the theme changes.
 *
 * @returns {{ theme: 'light' | 'dark', toggleTheme: () => void, setTheme: (t: 'light' | 'dark') => void }}
 */
export function useTheme() {
  const [theme, setThemeState] = useState(getInitialTheme)

  useEffect(() => {
    applyThemeToDocument(theme)
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch {
      // Ignore persistence failures — UI still works for the session.
    }
  }, [theme])

  const setTheme = useCallback((next) => {
    if (next !== THEME_LIGHT && next !== THEME_DARK) {
      throw new Error(`Invalid theme: "${next}". Expected "light" or "dark".`)
    }
    setThemeState(next)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === THEME_DARK ? THEME_LIGHT : THEME_DARK))
  }, [])

  return { theme, toggleTheme, setTheme }
}
