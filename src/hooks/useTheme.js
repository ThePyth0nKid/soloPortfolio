import { useCallback, useEffect, useState } from 'react'
import {
  DARK_CLASS_NAME,
  PREFERS_DARK_MEDIA_QUERY,
  THEME,
  THEME_STORAGE_KEY,
} from '../constants/theme.js'

/**
 * Read a persisted theme from localStorage.
 *
 * Returns `null` if nothing valid is stored, or if localStorage is unavailable
 * (e.g. SSR, privacy mode, disabled storage).
 *
 * @returns {'light' | 'dark' | null}
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
    // Accessing localStorage can throw in some sandboxed contexts.
    return null
  }
}

/**
 * Detect the OS-level color scheme preference.
 *
 * @returns {'light' | 'dark'}
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
 * Determine the initial theme on first render.
 *
 * Priority: persisted user choice → system preference → light fallback.
 *
 * @returns {'light' | 'dark'}
 */
export function resolveInitialTheme() {
  return readStoredTheme() ?? getSystemTheme()
}

/**
 * Apply the theme to the document root by toggling the Tailwind `dark` class.
 *
 * Safe to call with `document === undefined` (no-op on the server).
 *
 * @param {'light' | 'dark'} theme
 */
export function applyThemeToDocument(theme) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  if (theme === THEME.DARK) {
    root.classList.add(DARK_CLASS_NAME)
  } else {
    root.classList.remove(DARK_CLASS_NAME)
  }
}

/**
 * Manage the site's theme: light or dark.
 *
 * - Persists explicit user choices to localStorage.
 * - Falls back to `prefers-color-scheme` on first visit.
 * - Syncs the Tailwind `dark` class on `<html>`.
 *
 * @returns {{
 *   theme: 'light' | 'dark',
 *   toggleTheme: () => void,
 *   setTheme: (next: 'light' | 'dark') => void,
 * }}
 */
export function useTheme() {
  const [theme, setThemeState] = useState(resolveInitialTheme)

  // Keep <html> in sync with state.
  useEffect(() => {
    applyThemeToDocument(theme)
  }, [theme])

  const setTheme = useCallback((next) => {
    if (next !== THEME.LIGHT && next !== THEME.DARK) {
      throw new Error(
        `useTheme: invalid theme "${next}". Expected "${THEME.LIGHT}" or "${THEME.DARK}".`,
      )
    }
    setThemeState(next)
    try {
      window.localStorage?.setItem(THEME_STORAGE_KEY, next)
    } catch {
      // Storage failures should not break the UI — theme still applies in-memory.
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(theme === THEME.DARK ? THEME.LIGHT : THEME.DARK)
  }, [theme, setTheme])

  return { theme, toggleTheme, setTheme }
}
