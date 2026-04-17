import { useEffect, useState, useCallback } from 'react'

/**
 * Supported theme values.
 * @typedef {'light' | 'dark'} Theme
 */

export const THEME_STORAGE_KEY = 'portfolio:theme'
export const THEME_LIGHT = 'light'
export const THEME_DARK = 'dark'
const DARK_CLASS = 'dark'

/**
 * Safely read the persisted theme from localStorage.
 * Returns null if unavailable or value is invalid.
 * @returns {Theme | null}
 */
export function readStoredTheme() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
    if (stored === THEME_LIGHT || stored === THEME_DARK) return stored
    return null
  } catch {
    // Access to localStorage can throw (private mode, disabled storage).
    return null
  }
}

/**
 * Determine the user's preferred theme from the OS / browser.
 * Falls back to light if matchMedia isn't available.
 * @returns {Theme}
 */
export function getSystemTheme() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return THEME_LIGHT
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? THEME_DARK
    : THEME_LIGHT
}

/**
 * Resolve the initial theme: stored preference wins, otherwise system.
 * @returns {Theme}
 */
export function getInitialTheme() {
  return readStoredTheme() ?? getSystemTheme()
}

/**
 * Apply a theme to the document root by toggling the `dark` class.
 * Safe to call with no DOM (no-op on SSR).
 * @param {Theme} theme
 */
export function applyThemeToDocument(theme) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  if (theme === THEME_DARK) {
    root.classList.add(DARK_CLASS)
  } else {
    root.classList.remove(DARK_CLASS)
  }
}

/**
 * React hook that manages theme state with localStorage persistence.
 * @returns {{ theme: Theme, toggleTheme: () => void, setTheme: (t: Theme) => void }}
 */
export default function useTheme() {
  const [theme, setThemeState] = useState(getInitialTheme)

  useEffect(() => {
    applyThemeToDocument(theme)
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch {
      // Ignore storage errors — theme still applies for the session.
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
