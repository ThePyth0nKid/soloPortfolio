import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'theme'

/**
 * Reads the initial theme synchronously.
 * Priority: localStorage override > system preference > 'dark' fallback.
 */
function getInitialTheme() {
  if (typeof window === 'undefined') return 'dark'
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    /* localStorage may be unavailable (private mode, etc.) — fall through */
  }
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
  return prefersDark ? 'dark' : 'light'
}

function applyTheme(theme) {
  const root = document.documentElement
  if (theme === 'dark') root.classList.add('dark')
  else root.classList.remove('dark')
}

export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme)
  // Track whether the user has explicitly chosen a theme. If not, we follow the system.
  const [hasUserPreference, setHasUserPreference] = useState(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      return stored === 'light' || stored === 'dark'
    } catch {
      return false
    }
  })

  // Apply theme to <html> whenever it changes
  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  // If the user hasn't picked a theme, react to system preference changes live
  useEffect(() => {
    if (hasUserPreference) return
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e) => setTheme(e.matches ? 'dark' : 'light')
    mql.addEventListener?.('change', handler)
    return () => mql.removeEventListener?.('change', handler)
  }, [hasUserPreference])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'
      try {
        window.localStorage.setItem(STORAGE_KEY, next)
      } catch {
        /* ignore */
      }
      return next
    })
    setHasUserPreference(true)
  }, [])

  return { theme, toggleTheme }
}
