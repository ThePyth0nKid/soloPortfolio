import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'theme'

/**
 * useTheme — tiny theme manager.
 *
 * Behavior:
 * - First visit: follow `prefers-color-scheme` (no value stored — we keep
 *   tracking the system until the user explicitly picks one).
 * - Toggle: user choice is persisted to localStorage.
 * - Cross-tab: listens to `storage` events so all tabs stay in sync.
 * - System changes: if the user hasn't picked, we follow system changes live.
 */
export function useTheme() {
  const [theme, setThemeState] = useState(() => getInitialTheme())

  // Apply the class to <html> whenever theme changes.
  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.style.colorScheme = theme
  }, [theme])

  // Follow system changes *only* when user hasn't explicitly chosen.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e) => {
      const stored = safeGet(STORAGE_KEY)
      if (stored !== 'light' && stored !== 'dark') {
        setThemeState(e.matches ? 'dark' : 'light')
      }
    }
    mq.addEventListener?.('change', handler)
    return () => mq.removeEventListener?.('change', handler)
  }, [])

  // Keep tabs in sync.
  useEffect(() => {
    const handler = (e) => {
      if (e.key === STORAGE_KEY && (e.newValue === 'light' || e.newValue === 'dark')) {
        setThemeState(e.newValue)
      }
    }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [])

  const setTheme = useCallback((next) => {
    setThemeState(next)
    safeSet(STORAGE_KEY, next)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'
      safeSet(STORAGE_KEY, next)
      return next
    })
  }, [])

  return { theme, setTheme, toggleTheme }
}

function getInitialTheme() {
  if (typeof window === 'undefined') return 'dark'
  const stored = safeGet(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
  return prefersDark ? 'dark' : 'light'
}

function safeGet(key) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, value)
  } catch {
    /* ignore (private mode, quota, etc.) */
  }
}
