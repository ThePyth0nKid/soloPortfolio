import { useCallback, useEffect, useState } from 'react'

/**
 * useTheme — single source of truth for light/dark mode.
 *
 * Behavior:
 *  - First visit: follows system preference (prefers-color-scheme).
 *  - User toggle: persists to localStorage under 'theme' = 'light' | 'dark'.
 *  - If user hasn't explicitly chosen, reacts live to system preference changes.
 *  - Applies/removes the `dark` class on <html> so Tailwind's darkMode:'class' works.
 */
export function useTheme() {
  const getInitial = () => {
    if (typeof window === 'undefined') return 'dark'
    try {
      const stored = localStorage.getItem('theme')
      if (stored === 'light' || stored === 'dark') return stored
    } catch {
      /* ignore */
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  const [theme, setThemeState] = useState(getInitial)

  // Apply theme to <html>
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
  }, [theme])

  // Follow system changes only if the user hasn't explicitly chosen
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e) => {
      try {
        if (localStorage.getItem('theme')) return // user has a preference — don't override
      } catch {
        /* ignore */
      }
      setThemeState(e.matches ? 'dark' : 'light')
    }
    mq.addEventListener?.('change', handler)
    return () => mq.removeEventListener?.('change', handler)
  }, [])

  const setTheme = useCallback((next) => {
    setThemeState(next)
    try {
      localStorage.setItem('theme', next)
    } catch {
      /* ignore */
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'
      try {
        localStorage.setItem('theme', next)
      } catch {
        /* ignore */
      }
      return next
    })
  }, [])

  return { theme, setTheme, toggleTheme }
}
