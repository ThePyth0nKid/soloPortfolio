import { useCallback, useEffect, useState } from 'react'

/**
 * useTheme — client-side theme management hook.
 *
 * Security / robustness considerations:
 * - localStorage values are UNTRUSTED input. We strictly whitelist allowed
 *   values ('light' | 'dark') and fall back to system preference on any
 *   unexpected value (prevents DOM/class injection via tampered storage).
 * - Wrap all storage access in try/catch: Safari private mode, disabled
 *   storage, quota exceeded, or SecurityError must not crash the app.
 * - No PII is stored. The theme preference is a non-identifying UI setting,
 *   so GDPR consent is not required (functional preference, ePrivacy
 *   'strictly necessary' analog). Still: keep the key namespaced and avoid
 *   logging.
 * - No network calls; purely client-side per issue spec.
 */

const STORAGE_KEY = 'portfolio:theme'
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
    // Storage unavailable (private mode, disabled, SecurityError) — ignore.
    return null
  }
}

function safeSetStoredTheme(theme) {
  if (!isValidTheme(theme)) return
  try {
    if (typeof window === 'undefined' || !window.localStorage) return
    window.localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // Quota exceeded or storage disabled — non-fatal.
  }
}

function getSystemTheme() {
  try {
    if (typeof window === 'undefined' || !window.matchMedia) return 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  } catch {
    return 'dark'
  }
}

function applyThemeToDocument(theme) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  // Defensive: only toggle the single class we own.
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

export function useTheme() {
  const [theme, setThemeState] = useState(() => {
    const stored = safeGetStoredTheme()
    return stored ?? getSystemTheme()
  })
  // Track whether the user has made an explicit choice; if not, follow system.
  const [hasExplicitChoice, setHasExplicitChoice] = useState(
    () => safeGetStoredTheme() !== null,
  )

  // Apply theme to <html> whenever it changes.
  useEffect(() => {
    applyThemeToDocument(theme)
  }, [theme])

  // Follow system preference changes only if user hasn't explicitly chosen.
  useEffect(() => {
    if (hasExplicitChoice) return
    if (typeof window === 'undefined' || !window.matchMedia) return

    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e) => {
      setThemeState(e.matches ? 'dark' : 'light')
    }

    // addEventListener is the modern API; fall back for older Safari.
    if (mql.addEventListener) {
      mql.addEventListener('change', handler)
      return () => mql.removeEventListener('change', handler)
    } else if (mql.addListener) {
      mql.addListener(handler)
      return () => mql.removeListener(handler)
    }
  }, [hasExplicitChoice])

  const setTheme = useCallback((next) => {
    if (!isValidTheme(next)) return
    setThemeState(next)
    setHasExplicitChoice(true)
    safeSetStoredTheme(next)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'
      safeSetStoredTheme(next)
      return next
    })
    setHasExplicitChoice(true)
  }, [])

  return { theme, setTheme, toggleTheme }
}
