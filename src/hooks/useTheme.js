import { useEffect, useState, useCallback } from 'react'

const STORAGE_KEY = 'theme'

/**
 * Read the initial theme synchronously to avoid a flash-of-wrong-theme.
 * Order of precedence: localStorage → system preference → 'dark' (site default).
 */
function getInitialTheme() {
  if (typeof window === 'undefined') return 'dark'
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    // localStorage may be unavailable (private mode, etc.) — fall through
  }
  if (window.matchMedia?.('(prefers-color-scheme: light)').matches) {
    return 'light'
  }
  return 'dark'
}

export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme)
  // Track whether the user has made an explicit choice — if not, follow the system.
  const [userOverride, setUserOverride] = useState(() => {
    if (typeof window === 'undefined') return false
    try {
      return !!window.localStorage.getItem(STORAGE_KEY)
    } catch {
      return false
    }
  })

  // Apply the theme class to <html> whenever it changes.
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    root.style.colorScheme = theme
  }, [theme])

  // Follow system preference changes — but only if the user hasn't explicitly chosen.
  useEffect(() => {
    if (userOverride) return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e) => setTheme(e.matches ? 'dark' : 'light')
    mq.addEventListener?.('change', handler)
    return () => mq.removeEventListener?.('change', handler)
  }, [userOverride])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'
      try {
        window.localStorage.setItem(STORAGE_KEY, next)
      } catch {
        // ignore storage errors — theme still works in-session
      }
      return next
    })
    setUserOverride(true)
  }, [])

  return { theme, toggleTheme }
}
