import { useCallback, useEffect, useState } from 'react'

/**
 * Key used to persist the user's theme preference in localStorage.
 * @type {string}
 */
export const THEME_STORAGE_KEY = 'theme'

/** @typedef {'light' | 'dark'} Theme */

export const LIGHT = /** @type {const} */ ('light')
export const DARK = /** @type {const} */ ('dark')

/**
 * Reads the stored theme from localStorage, if present and valid.
 * @returns {Theme | null} The stored theme, or null if none/invalid/unavailable.
 */
export function getStoredTheme() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null
  }
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
    if (stored === LIGHT || stored === DARK) {
      return stored
    }
    return null
  } catch {
    // localStorage may throw in private-browsing contexts.
    return null
  }
}

/**
 * Detects the user's OS-level color scheme preference.
 * Falls back to 'light' if the matchMedia API is unavailable.
 * @returns {Theme}
 */
export function getSystemTheme() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return LIGHT
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? DARK : LIGHT
}

/**
 * Resolves the initial theme: stored preference wins, otherwise fall back
 * to the system preference.
 * @returns {Theme}
 */
export function resolveInitialTheme() {
  return getStoredTheme() ?? getSystemTheme()
}

/**
 * Applies the given theme to the <html> element by toggling the `dark` class.
 * @param {Theme} theme
 */
function applyThemeToDocument(theme) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  if (theme === DARK) {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

/**
 * React hook that manages the active theme.
 * - Initializes from localStorage, falling back to system preference.
 * - Persists changes to localStorage.
 * - Syncs the `dark` class on <html>.
 *
 * @returns {{ theme: Theme, toggleTheme: () => void, setTheme: (t: Theme) => void }}
 */
export default function useTheme() {
  const [theme, setThemeState] = useState(resolveInitialTheme)

  useEffect(() => {
    applyThemeToDocument(theme)
    try {
      window.localStorage?.setItem(THEME_STORAGE_KEY, theme)
    } catch {
      // Ignore storage errors (quota, private mode).
    }
  }, [theme])

  const setTheme = useCallback((next) => {
    if (next !== LIGHT && next !== DARK) {
      throw new Error(`Invalid theme: ${String(next)}. Expected '${LIGHT}' or '${DARK}'.`)
    }
    setThemeState(next)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === DARK ? LIGHT : DARK))
  }, [])

  return { theme, toggleTheme, setTheme }
}
