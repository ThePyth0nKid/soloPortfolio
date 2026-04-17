import { useEffect, useState, useCallback } from 'react'

// Security considerations:
// - localStorage value is strictly validated against an allow-list ('light' | 'dark').
//   Any tampered/invalid value is discarded and we fall back to system preference.
// - We never inject the value into the DOM as HTML; we only toggle a class.
// - No PII is stored. The theme preference is a non-identifying UI setting,
//   so GDPR consent is not required (functional/essential preference).
// - Wrapped in try/catch: localStorage can throw in private mode / sandboxed iframes.

const STORAGE_KEY = 'theme-preference'
const VALID_THEMES = Object.freeze(['light', 'dark'])

function isValidTheme(value) {
  return typeof value === 'string' && VALID_THEMES.includes(value)
}

function readStoredTheme() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw === null) return null
    // Strict allow-list validation — reject anything unexpected.
    if (!isValidTheme(raw)) {
      // Clean up corrupted/tampered value defensively.
      try { window.localStorage.removeItem(STORAGE_KEY) } catch (_) { /* noop */ }
      return null
    }
    return raw
  } catch (_) {
    return null
  }
}

function getSystemTheme() {
  try {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
  } catch (_) { /* noop */ }
  return 'light'
}

function getInitialTheme() {
  const stored = readStoredTheme()
  if (stored) return stored
  return getSystemTheme()
}

function applyTheme(theme) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

export function useTheme() {
  const [theme, setThemeState] = useState(() => getInitialTheme())

  // Apply to <html> whenever it changes.
  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  // Follow system preference changes ONLY when the user hasn't explicitly chosen.
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e) => {
      if (!readStoredTheme()) {
        setThemeState(e.matches ? 'dark' : 'light')
      }
    }
    try {
      mql.addEventListener('change', handler)
      return () => mql.removeEventListener('change', handler)
    } catch (_) {
      // Safari fallback
      mql.addListener?.(handler)
      return () => mql.removeListener?.(handler)
    }
  }, [])

  const setTheme = useCallback((next) => {
    if (!isValidTheme(next)) {
      // Reject invalid input silently — never trust caller.
      return
    }
    setThemeState(next)
    try {
      window.localStorage?.setItem(STORAGE_KEY, next)
    } catch (_) { /* storage may be unavailable */ }
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }, [theme, setTheme])

  return { theme, setTheme, toggleTheme }
}
