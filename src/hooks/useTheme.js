import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'theme-preference'

function getInitialTheme() {
  if (typeof window === 'undefined') return 'dark'
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch (err) {
    // localStorage may be unavailable (private mode, etc.) — fall through
    console.warn('[theme] Could not read from localStorage:', err)
  }
  if (window.matchMedia?.('(prefers-color-scheme: light)').matches) {
    return 'light'
  }
  return 'dark'
}

function applyTheme(theme) {
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme)

  // Apply theme immediately on mount & whenever it changes
  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  // Follow system changes ONLY if the user hasn't made an explicit choice
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)')
    if (!mq) return
    const handler = (e) => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored === 'light' || stored === 'dark') return // user has a preference, respect it
      } catch {
        /* ignore */
      }
      setTheme(e.matches ? 'dark' : 'light')
    }
    mq.addEventListener?.('change', handler)
    return () => mq.removeEventListener?.('change', handler)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'
      try {
        localStorage.setItem(STORAGE_KEY, next)
      } catch (err) {
        console.warn('[theme] Could not persist preference:', err)
      }
      return next
    })
  }, [])

  return { theme, toggleTheme }
}
