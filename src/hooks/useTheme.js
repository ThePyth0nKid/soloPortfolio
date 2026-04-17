import { useCallback, useEffect, useState } from 'react'

// Security Considerations:
// - Theme value is strictly validated against an allow-list before being
//   applied or persisted. We never trust raw localStorage input (it can be
//   tampered with via devtools / extensions / XSS).
// - No PII is stored. 'theme' is a non-identifying UI preference.
// - All DOM access is guarded for SSR / non-browser environments.
// - localStorage access is wrapped in try/catch (Safari private mode, quota
//   errors, disabled storage, sandboxed iframes all throw).

const STORAGE_KEY = 'theme'
const ALLOWED_THEMES = Object.freeze(['light', 'dark'])

function isValidTheme(value) {
  return typeof value === 'string' && ALLOWED_THEMES.includes(value)
}

function safeGetStoredTheme() {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return isValidTheme(raw) ? raw : null
  } catch {
    return null
  }
}

function getSystemTheme() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return 'light'
  }
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

function getInitialTheme() {
  return safeGetStoredTheme() ?? getSystemTheme()
}

function applyThemeToDom(theme) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

export function useTheme() {
  const [theme, setThemeState] = useState(getInitialTheme)

  // Apply theme to <html> whenever it changes
  useEffect(() => {
    if (!isValidTheme(theme)) return
    applyThemeToDom(theme)
  }, [theme])

  // Follow system changes ONLY when the user hasn't made an explicit choice
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return undefined
    }
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e) => {
      if (safeGetStoredTheme() === null) {
        setThemeState(e.matches ? 'dark' : 'light')
      }
    }
    try {
      mql.addEventListener('change', handler)
      return () => mql.removeEventListener('change', handler)
    } catch {
      // Older Safari
      mql.addListener(handler)
      return () => mql.removeListener(handler)
    }
  }, [])

  const setTheme = useCallback((next) => {
    if (!isValidTheme(next)) {
      // Reject unknown values silently — never apply untrusted input
      return
    }
    setThemeState(next)
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, next)
      }
    } catch {
      // Storage unavailable — theme still applies for this session
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }, [theme, setTheme])

  return { theme, setTheme, toggleTheme }
}
