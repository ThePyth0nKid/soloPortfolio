import { useEffect, useState, useCallback } from 'react'

const STORAGE_KEY = 'theme'

/**
 * Reads the initial theme synchronously so there's no flash.
 * Priority: localStorage → system preference → light.
 */
function getInitialTheme() {
  if (typeof window === 'undefined') return 'light'
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch (_) {
    /* localStorage might be unavailable (private mode, etc.) — fall through */
  }
  if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  return 'light'
}

function applyTheme(theme) {
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
  root.style.colorScheme = theme
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

  // Apply theme to <html> whenever it changes
  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  // Follow system changes until the user makes an explicit choice
  useEffect(() => {
    if (hasUserPreference) return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e) => setTheme(e.matches ? 'dark' : 'light')
    mq.addEventListener?.('change', handler)
    return () => mq.removeEventListener?.('change', handler)
  }, [hasUserPreference])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'
      try {
        window.localStorage.setItem(STORAGE_KEY, next)
      } catch (_) {
        /* ignore storage errors — the toggle still works in-session */
      }
      return next
    })
    setHasUserPreference(true)
  }, [])

  return { theme, toggleTheme }
}
