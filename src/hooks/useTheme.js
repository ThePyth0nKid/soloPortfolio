import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'theme'

/**
 * Read the initial theme synchronously so the first paint is correct.
 * Order of precedence:
 *   1. localStorage (explicit user choice)
 *   2. prefers-color-scheme (system preference)
 *   3. 'dark' (sensible default for this portfolio)
 */
function getInitialTheme() {
  if (typeof window === 'undefined') return 'dark'
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    /* localStorage may be unavailable (private mode, etc.) — fall through */
  }
  if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) return 'dark'
  return 'light'
}

function applyTheme(theme) {
  const root = document.documentElement
  root.classList.toggle('dark', theme === 'dark')
  root.style.colorScheme = theme
}

export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme)
  // Has the user explicitly chosen a theme? If not, we keep following the OS.
  const [userOverride, setUserOverride] = useState(() => {
    if (typeof window === 'undefined') return false
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

  // Follow system preference changes until the user makes an explicit choice
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
        /* no-op: storage unavailable */
      }
      return next
    })
    setUserOverride(true)
  }, [])

  return { theme, toggleTheme }
}
