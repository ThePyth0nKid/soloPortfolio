import { useCallback, useEffect, useState } from 'react'
import {
  DARK_CLASS_NAME,
  PREFERS_DARK_MEDIA_QUERY,
  THEME,
  THEME_STORAGE_KEY,
} from '../constants/theme.js'

/**
 * @typedef {typeof THEME.LIGHT | typeof THEME.DARK} Theme
 */

/**
 * Safely read the persisted theme from localStorage.
 * Returns null if unavailable, invalid, or if storage access throws
 * (e.g. SSR, privacy mode, disabled cookies).
 *
 * @returns {Theme | null}
 */
function readStoredTheme() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null
  }
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
    if (stored === THEME.LIGHT || stored === THEME.DARK) {
      return stored
    }
    return null
  } catch {
    return null
  }
}

/**
 * Detect the OS-level preferred color scheme.
 * Falls back to light when matchMedia is unavailable.
 *
 * @returns {Theme}
 */
function getSystemTheme() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return THEME.LIGHT
  }
  return window.matchMedia(PREFERS_DARK_MEDIA_QUERY).matches
    ? THEME.DARK
    : THEME.LIGHT
}

/**
 * Compute the initial theme: stored preference first, else system preference.
 *
 * @returns {Theme}
 */
function resolveInitialTheme() {
  return readStoredTheme() ?? getSystemTheme()
}

/**
 * Apply the theme to the `<html>` element by toggling the `dark` class,
 * matching Tailwind's `darkMode: 'class'` strategy.
 *
 * @param {Theme} theme
 */
function applyThemeToDocument(theme) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  if (theme === THEME.DARK) {
    root.classList.add(DARK_CLASS_NAME)
  } else {
    root.classList.remove(DARK_CLASS_NAME)
  }
}

/**
 * React hook that manages the application theme.
 *
 * Behavior:
 * - On first visit: defaults to the OS-level `prefers-color-scheme`.
 * - On subsequent visits: restores the user's persisted choice.
 * - Persists any user change to localStorage.
 * - Applies the theme to `<html>` via the `dark` class.
 *
 * @returns {{ theme: Theme, toggleTheme: () => void, setTheme: (t: Theme) => void }}
 */
export function useTheme() {
  const [theme, setThemeState] = useState(resolveInitialTheme)

  // Sync DOM + storage whenever theme changes.
  useEffect(() => {
    applyThemeToDocument(theme)
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem(THEME_STORAGE_KEY, theme)
      } catch {
        // Ignore storage write failures (quota, privacy mode, etc.)
      }
    }
  }, [theme])

  const setTheme = useCallback((next) => {
    if (next !== THEME.LIGHT && next !== THEME.DARK) {
      throw new Error(
        `useTheme: invalid theme "${String(next)}". Expected "${THEME.LIGHT}" or "${THEME.DARK}".`,
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
