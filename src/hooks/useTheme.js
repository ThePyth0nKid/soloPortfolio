import { useEffect, useState, useCallback } from 'react'

const STORAGE_KEY = 'theme'

/**
 * Reads the initial theme synchronously:
 * 1. localStorage (explicit user choice) wins
 * 2. Otherwise falls back to system preference
 * 3. Final fallback: 'light'
 */
function getInitialTheme() {
  if (typeof window === 'undefined') return 'light'

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    // localStorage might be unavailable (private mode, etc) — fall through
  }

  if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  return 'light'
}

export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme)
  // Has the user ever made an explicit choice? If not, we follow the system.
  const [hasExplicitChoice, setHasExplicitChoice] = useState(() => {
    if (typeof window === 'undefined') return false
    try {
      return !!window.localStorage.getItem(STORAGE_KEY)
    } catch {
      return false
    }
  })

  // Apply the theme class to <html>
  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.style.colorScheme = theme
  }, [theme])

  // Follow system preference changes *until* the user makes an explicit choice
  useEffect(() => {
    if (hasExplicitChoice) return
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e) => setTheme(e.matches ? 'dark' : 'light')
    mql.addEventListener?.('change', handler)
    return () => mql.removeEventListener?.('change', handler)
  }, [hasExplicitChoice])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'
      try {
        window.localStorage.setItem(STORAGE_KEY, next)
      } catch {
        // non-fatal
      }
      return next
    })
    setHasExplicitChoice(true)
  }, [])

  return { theme, toggleTheme }
}
