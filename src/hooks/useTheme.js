import { useCallback, useEffect, useState } from 'react'

/**
 * localStorage key used to persist the user's explicit theme choice.
 * Kept as a module-level constant so it can be imported by tests.
 */
export const THEME_STORAGE_KEY = 'theme'

/** Valid theme values. */
export const THEMES = Object.freeze({
  LIGHT: 'light',
  DARK: 'dark',
})

const VALID_THEMES = new Set(Object.values(THEMES))

/**
 * Resolves the initial theme using the following priority:
 *   1. A previously-persisted value in localStorage (if valid).
 *   2. The OS-level `prefers-color-scheme: dark` media query.
 *   3. Fallback to light mode.
 *
 * This function is SSR-safe: if `window` is undefined it returns light.
 *
 * @returns {'light' | 'dark'}
 */
export function getInitialTheme() {
  if (typeof window === 'undefined') {
    return THEMES.LIGHT
  }

  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
    if (stored && VALID_THEMES.has(stored)) {
      return stored
    }
  } catch {
    // localStorage access can throw in private/locked-down browsers; ignore.
  }

  const prefersDark =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches

  return prefersDark ? THEMES.DARK : THEMES.LIGHT
}

/**
 * Applies the given theme to the `<html>` element by toggling the `dark` class
 * (matches the Tailwind `darkMode: 'class'` configuration).
 *
 * @param {'light' | 'dark'} theme
 */
export function applyThemeToDocument(theme) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  if (theme === THEMES.DARK) {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

/**
 * React hook that manages the current theme, persists it to localStorage,
 * and syncs it to the `<html>` element.
 *
 * @returns {{ theme: 'light' | 'dark', toggleTheme: () => void, setTheme: (t: 'light' | 'dark') => void }}
 */
export default function useTheme() {
  const [theme, setThemeState] = useState(getInitialTheme)

  useEffect(() => {
    applyThemeToDocument(theme)
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch {
      // Persisting is best-effort; swallow quota / access errors.
    }
  }, [theme])

  const setTheme = useCallback((next) => {
    if (!VALID_THEMES.has(next)) {
      throw new Error(
        `Invalid theme: "${next}". Expected one of: ${[...VALID_THEMES].join(', ')}`,
      )
    }
    setThemeState(next)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((current) =>
      current === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK,
    )
  }, [])

  return { theme, toggleTheme, setTheme }
}
