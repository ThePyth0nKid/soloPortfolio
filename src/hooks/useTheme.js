import { useCallback, useEffect, useState } from 'react'

/**
 * useTheme — client-side theme management hook.
 *
 * Security Considerations:
 * - localStorage is untrusted input; we validate strictly against an allow-list
 *   before applying any value to the DOM. A tampered localStorage entry cannot
 *   inject arbitrary classNames or values.
 * - No PII is stored (only the literal string 'light' or 'dark').
 * - All DOM mutations use classList.add/remove (no innerHTML), so XSS via
 *   theme value is not possible even if validation were bypassed.
 * - Storage writes are wrapped in try/catch — private-mode browsers or quota
 *   errors will not crash the app.
 */

const STORAGE_KEY = 'theme-preference'
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
    // SecurityError (disabled storage), QuotaExceededError, etc.
    return null
  }
}

function writeStoredTheme(theme) {
  if (!isValidTheme(theme)) return
  try {
    if (typeof window === 'undefined' || !window.localStorage) return
    window.localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // Swallow — theme will simply not persist this session.
  }
}

function getSystemTheme() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return 'dark'
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(theme) {
  if (!isValidTheme(theme)) return
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
  const [hasExplicitPreference, setHasExplicitPreference] = useState(
    () => readStoredTheme() !== null,
  )

  // Apply theme to <html> whenever it changes.
  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  // Follow system changes *only* if the user hasn't set an explicit preference.
  useEffect(() => {
    if (hasExplicitPreference) return
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return

    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e) => setThemeState(e.matches ? 'dark' : 'light')
    // Safari <14 uses addListener
    if (mql.addEventListener) mql.addEventListener('change', handler)
    else if (mql.addListener) mql.addListener(handler)

    return () => {
      if (mql.removeEventListener) mql.removeEventListener('change', handler)
      else if (mql.removeListener) mql.removeListener(handler)
    }
  }, [hasExplicitPreference])

  const setTheme = useCallback((next) => {
    if (!isValidTheme(next)) {
      // Reject untrusted input silently; do not mutate state.
      return
    }
    setThemeState(next)
    setHasExplicitPreference(true)
    writeStoredTheme(next)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'
      writeStoredTheme(next)
      return next
    })
    setHasExplicitPreference(true)
  }, [])

  return { theme, setTheme, toggleTheme }
}
