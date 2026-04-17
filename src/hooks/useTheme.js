import { useEffect, useState, useCallback } from 'react'

// Security Considerations:
// - Only accept a strict allow-list of theme values ('light' | 'dark').
//   localStorage is user-controllable and could contain arbitrary strings,
//   XSS payloads, or oversized data. We validate on read and ignore anything
//   that isn't an exact match.
// - We wrap localStorage access in try/catch because access can throw in
//   privacy/incognito modes or when storage is disabled/full. We must never
//   let a storage error crash the app (availability).
// - No PII is stored — only a UI preference — so GDPR retention is not
//   triggered. Key is namespaced to reduce collision risk.
// - We do not use `eval`, `Function`, or innerHTML anywhere in this module.

const STORAGE_KEY = 'app:theme'
const VALID_THEMES = Object.freeze(['light', 'dark'])

function isValidTheme(value) {
  return typeof value === 'string' && VALID_THEMES.includes(value)
}

function readStoredTheme() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null
    const raw = window.localStorage.getItem(STORAGE_KEY)
    // Cap length defensively — a valid value is at most 5 chars ('light').
    if (raw == null || raw.length > 16) return null
    return isValidTheme(raw) ? raw : null
  } catch {
    return null
  }
}

function getSystemTheme() {
  try {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
    }
  } catch {
    /* ignore */
  }
  return 'dark'
}

function getInitialTheme() {
  const stored = readStoredTheme()
  if (stored) return stored
  return getSystemTheme()
}

function applyThemeToDocument(theme) {
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

  useEffect(() => {
    applyThemeToDocument(theme)
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY, theme)
      }
    } catch {
      /* ignore quota/denied errors */
    }
  }, [theme])

  // Follow system changes ONLY if the user hasn't made an explicit choice.
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const listener = (e) => {
      if (readStoredTheme() == null) {
        setThemeState(e.matches ? 'dark' : 'light')
      }
    }
    try {
      mql.addEventListener('change', listener)
      return () => mql.removeEventListener('change', listener)
    } catch {
      // Safari < 14 fallback
      mql.addListener(listener)
      return () => mql.removeListener(listener)
    }
  }, [])

  const setTheme = useCallback((next) => {
    if (!isValidTheme(next)) return // reject malformed input
    setThemeState(next)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }, [])

  return { theme, setTheme, toggleTheme }
}
