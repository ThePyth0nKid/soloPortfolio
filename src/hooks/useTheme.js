import { useEffect, useState, useCallback } from 'react'

const STORAGE_KEY = 'theme'

/**
 * Read the initial theme synchronously so there's no flash of wrong theme.
 * Priority: explicit user choice (localStorage) → system preference → 'light'.
 */
function getInitialTheme() {
  if (typeof window === 'undefined') return 'light'
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    // localStorage can throw in some privacy modes — fall through
  }
  if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
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

  // Apply theme to <html> + persist
  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.setAttribute('data-theme', theme)
  }, [theme])

  // Follow system changes *only* if the user hasn't made an explicit choice
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
      } catch {
        // ignore storage errors — toggle still works for the session
      }
      setHasUserPreference(true)
      // Friendly console breadcrumb for devs poking around
      // eslint-disable-next-line no-console
      console.info(`[theme] switched to ${next}`)
      return next
    })
  }, [])

  return { theme, toggleTheme }
}
