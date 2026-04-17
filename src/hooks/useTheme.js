import { useCallback, useEffect, useState } from 'react'

// Security notes:
// - localStorage is untrusted: validate values on read (allowlist only).
// - We only store a non-PII UI preference ('light' | 'dark'). No GDPR impact.
// - Wrap localStorage access in try/catch: can throw in private-mode / disabled storage.
// - No user-controlled strings are ever injected into the DOM; we only toggle a class.

const STORAGE_KEY = 'theme-preference'
const VALID_THEMES = Object.freeze(['light', 'dark'])

function isValidTheme(value) {
  return typeof value === 'string' && VALID_THEMES.includes(value)
}

function safeGetStoredTheme() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return isValidTheme(raw) ? raw : null
  } catch {
    // Storage may be disabled (Safari private mode, security policies, etc.)
    return null
  }
}

function safeSetStoredTheme(value) {
  if (!isValidTheme(value)) return
  try {
    if (typeof window === 'undefined' || !window.localStorage) return
    window.localStorage.setItem(STORAGE_KEY, value)
  } catch {
    // Fail closed & silent — theme still works in-memory.
  }
}

function getSystemTheme() {
  try {
    if (typeof window === 'undefined' || !window.matchMedia) return 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  } catch {
    return 'dark'
  }
}

function getInitialTheme() {
  const stored = safeGetStoredTheme()
  if (stored) return stored
  return getSystemTheme()
}

export function useTheme() {
  const [theme, setThemeState] = useState(getInitialTheme)
  const [hasUserPreference, setHasUserPreference] = useState(() => safeGetStoredTheme() !== null)

  // Apply theme class to <html>
  useEffect(() => {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  // Track OS preference changes — but only if user hasn't explicitly chosen.
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e) => {
      if (!hasUserPreference) {
        setThemeState(e.matches ? 'dark' : 'light')
      }
    }
    try {
      media.addEventListener('change', handler)
      return () => media.removeEventListener('change', handler)
    } catch {
      // Older Safari fallback
      media.addListener(handler)
      return () => media.removeListener(handler)
    }
  }, [hasUserPreference])

  const setTheme = useCallback((next) => {
    if (!isValidTheme(next)) {
      // Reject invalid input silently; log for audit.
      if (typeof console !== 'undefined') {
        console.warn('[theme] Rejected invalid theme value')
      }
      return
    }
    setThemeState(next)
    setHasUserPreference(true)
    safeSetStoredTheme(next)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }, [theme, setTheme])

  return { theme, setTheme, toggleTheme }
}
