import { useCallback, useEffect, useState } from 'react'

/**
 * Supported theme values.
 * @typedef {'light' | 'dark'} Theme
 */

/** localStorage key used to persist the user's explicit theme preference. */
export const THEME_STORAGE_KEY = 'theme'

/** CSS class applied to <html> when dark mode is active (matches Tailwind darkMode: 'class'). */
export const DARK_CLASS = 'dark'

/** Media query used to detect the user's OS-level color scheme preference. */
export const PREFERS_DARK_MEDIA_QUERY = '(prefers-color-scheme: dark)'

const VALID_THEMES = /** @type {const} */ (['light', 'dark'])

/**
 * Reads the initial theme to use on mount.
 *
 * Precedence:
 *   1. Value stored in localStorage (if valid)
 *   2. OS-level `prefers-color-scheme` media query
 *   3. Fallback: 'light'
 *
 * @returns {Theme}
 */
export function getInitialTheme() {
  if (typeof window === 'undefined') {
    return 'light'
  }

  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
    if (stored && VALID_THEMES.includes(/** @type {Theme} */ (stored))) {
      return /** @type {Theme} */ (stored)
    }
  } catch {
    // localStorage can throw in private mode / sandboxed contexts — fall through.
  }

  if (typeof window.matchMedia === 'function' && window.matchMedia(PREFERS_DARK_MEDIA_QUERY).matches) {
    return 'dark'
  }

  return 'light'
}

/**
 * Applies the given theme to the document root by toggling the `dark` class.
 *
 * @param {Theme} theme
 * @returns {void}
 */
export function applyTheme(theme) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add(DARK_CLASS)
  } else {
    root.classList.remove(DARK_CLASS)
  }
}

/**
 * React hook that manages the active theme, persists the user's explicit
 * choice to localStorage, and applies it to the <html> element.
 *
 * @returns {{ theme: Theme, toggleTheme: () => void, setTheme: (t: Theme) => void }}
 */
export default function useTheme() {
  const [theme, setThemeState] = useState(/** @type {Theme} */ ('light'))

  // Initialise on mount (client-only — avoids SSR hydration issues).
  useEffect(() => {
    const initial = getInitialTheme()
    setThemeState(initial)
    applyTheme(initial)
  }, [])

  const setTheme = useCallback((/** @type {Theme} */ next) => {
    if (!VALID_THEMES.includes(next)) {
      throw new Error(`Invalid theme: "${next}". Expected one of: ${VALID_THEMES.join(', ')}.`)
    }
    setThemeState(next)
    applyTheme(next)
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      // Non-fatal: persistence is best-effort.
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }, [theme, setTheme])

  return { theme, toggleTheme, setTheme }
}
