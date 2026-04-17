import { useEffect, useState, useCallback } from 'react'

const STORAGE_KEY = 'theme'

/**
 * Resolves the initial theme on first render.
 * Priority: saved preference → system preference → 'dark' fallback.
 * Runs synchronously so the first paint matches the final theme (no flash).
 */
function getInitialTheme() {
  if (typeof window === 'undefined') return 'dark'
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    /* localStorage may be unavailable (private mode, etc.) — fall through */
  }
  if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) return 'dark'
  return 'light'
}

export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme)
  const [hasUserPreference, setHasUserPreference] = useState(() => {
    try {
      return !!window.localStorage.getItem(STORAGE_KEY)
    } catch {
      return false
    }
  })

  // Apply theme to <html> and persist (only if user has explicitly chosen)
  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.setAttribute('data-theme', theme)
  }, [theme])

  // Follow system changes *only* until the user picks their own preference
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
        /* ignore persistence failures */
      }
      return next
    })
    setHasUserPreference(true)
  }, [])

  return { theme, toggleTheme }
}
