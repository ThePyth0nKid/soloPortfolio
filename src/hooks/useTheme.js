import { useCallback, useEffect, useState } from 'react'
import {
  THEME_DARK,
  THEME_LIGHT,
  applyTheme,
  resolveInitialTheme,
  storeTheme,
} from '../lib/theme.js'

/** @typedef {'light' | 'dark'} Theme */

/**
 * React hook that manages the active theme.
 *
 * - Initializes from localStorage, falling back to system preference.
 * - Applies the `dark` class to <html> whenever the theme changes.
 * - Persists changes to localStorage.
 *
 * @returns {{ theme: Theme, toggleTheme: () => void, setTheme: (t: Theme) => void }}
 */
export default function useTheme() {
  const [theme, setThemeState] = useState(/** @type {Theme} */ (THEME_LIGHT))

  // Resolve the real initial theme on mount (client only).
  useEffect(() => {
    const initial = resolveInitialTheme()
    setThemeState(initial)
    applyTheme(initial)
  }, [])

  const setTheme = useCallback(/** @param {Theme} next */ (next) => {
    if (next !== THEME_LIGHT && next !== THEME_DARK) {
      throw new Error(`Invalid theme: ${String(next)}`)
    }
    setThemeState(next)
    applyTheme(next)
    storeTheme(next)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(theme === THEME_DARK ? THEME_LIGHT : THEME_DARK)
  }, [theme, setTheme])

  return { theme, toggleTheme, setTheme }
}
