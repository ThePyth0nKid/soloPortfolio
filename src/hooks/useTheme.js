import { useCallback, useEffect, useState } from 'react'

// Security considerations:
// - localStorage values are untrusted. We whitelist to 'light' | 'dark' only.
// - Any other value (tampered, XSS-injected, legacy) is discarded and we fall
//   back to the system preference. This prevents accidental reflection of
//   attacker-controlled strings into the DOM (e.g. as a className).
// - No PII is stored; theme preference is a non-personal UI setting, so GDPR
//   retention/consent requirements do not apply. Still, we namespace the key
//   to avoid collisions.
// - All DOM writes are via classList (not innerHTML) — no injection surface.

const STORAGE_KEY = 'portfolio:theme'
const VALID_THEMES = Object.freeze(['light', 'dark'])

function isValidTheme(value) {
  return typeof value === 'string' && VALID_THEMES.includes(value)
}

function readStoredTheme() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return isValidTheme(raw) ? raw : null
  } catch {
    // localStorage can throw (disabled, quota, privacy mode). Fail closed.
    return null
  }
}

function getSystemTheme() {
  try {
    if (typeof window === 'undefined' || !window.matchMedia) return 'light'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  } catch {
    return 'light'
  }
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
  const [theme, setThemeState] = useState(() => {
    const stored = readStoredTheme()
    return stored ?? getSystemTheme()
  })

  // Apply theme to <html> whenever it changes.
  useEffect(() => {
    applyThemeToDocument(theme)
  }, [theme])

  // Follow OS changes only when the user hasn't explicitly chosen a theme.
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (e) => {
      if (readStoredTheme() === null) {
        setThemeState(e.matches ? 'dark' : 'light')
      }
    }
    try {
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    } catch {
      // Safari <14 fallback
      mql.addListener(onChange)
      return () => mql.removeListener(onChange)
    }
  }, [])

  const setTheme = useCallback((next) => {
    if (!isValidTheme(next)) {
      // Reject unknown values — do not let callers inject arbitrary strings.
      if (typeof console !== 'undefined') {
        console.warn('[useTheme] Rejected invalid theme value')
      }
      return
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Persistence failure is non-fatal; continue with in-memory state.
    }
    setThemeState(next)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }, [theme, setTheme])

  return { theme, setTheme, toggleTheme }
}
