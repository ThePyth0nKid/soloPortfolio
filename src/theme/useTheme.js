import { useCallback, useEffect, useState } from 'react'
import { THEME } from './constants'
import {
  applyThemeToDocument,
  resolveInitialTheme,
  writeStoredTheme,
} from './themeUtils'

/**
 * React hook that manages the active theme.
 *
 * - Initialises from localStorage, falling back to the system preference.
 * - Applies the `dark` class to `<html>` whenever the theme changes.
 * - Persists the user's choice on every change.
 *
 * @returns {{ theme: 'light' | 'dark', toggleTheme: () => void, setTheme: (theme: 'light' | 'dark') => void }}
 */
export function useTheme() {
  const [theme, setThemeState] = useState(resolveInitialTheme)

  useEffect(() => {
    applyThemeToDocument(theme)
    writeStoredTheme(theme)
  }, [theme])

  const setTheme = useCallback((next) => {
    if (next !== THEME.LIGHT && next !== THEME.DARK) {
      throw new Error(`Invalid theme: ${String(next)}`)
    }
    setThemeState(next)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === THEME.DARK ? THEME.LIGHT : THEME.DARK))
  }, [])

  return { theme, toggleTheme, setTheme }
}
