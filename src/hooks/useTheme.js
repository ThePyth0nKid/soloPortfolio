import { useEffect, useState, useCallback } from 'react'

// Security note: localStorage is not encrypted and is readable by any script
// running on the same origin. We store ONLY a non-sensitive theme preference
// ('light' | 'dark'). No PII. No user identifiers. No GDPR implications —
// this is a functional/preference cookie-equivalent (Recital 30), generally
// considered exempt from consent under ePrivacy "strictly necessary" or
// "user-requested functionality" carve-outs. Still, we validate strictly.

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
    // Validate: reject anything that isn't exactly 'light' or 'dark'.
    // Prevents prototype-pollution-style surprises or tampered values
    // from ever flowing into className or DOM attributes.
    if (!isValidTheme(raw)) {
      // Clean up corrupt/tampered value.
      try { window.localStorage.removeItem(STORAGE_KEY) } catch (_) {}
      return null
    }
    return raw
  } catch (_) {
    // localStorage can throw (Safari private mode, disabled storage, quota).
    // Fail closed to system preference.
    return null
  }
}

function getSystemTheme() {
  try {
    if (typeof window === 'undefined' || !window.matchMedia) return 'light'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  } catch (_) {
    return 'light'
  }
}

function getInitialTheme() {
  return readStoredTheme() ?? getSystemTheme()
}

export function useTheme() {
  const [theme, setThemeState] = useState(getInitialTheme)
  const [userHasChosen, setUserHasChosen] = useState(() => readStoredTheme() !== null)

  // Apply theme to <html> element.
  useEffect(() => {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  // Track system preference only while the user hasn't made an explicit choice.
  useEffect(() => {
    if (userHasChosen) return
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e) => setThemeState(e.matches ? 'dark' : 'light')
    try {
      mq.addEventListener('change', handler)
      return () => mq.removeEventListener('change', handler)
    } catch (_) {
      // Older Safari
      mq.addListener(handler)
      return () => mq.removeListener(handler)
    }
  }, [userHasChosen])

  const setTheme = useCallback((next) => {
    if (!isValidTheme(next)) {
      // Reject invalid input silently; log for audit.
      // eslint-disable-next-line no-console
      console.warn('[theme] rejected invalid theme value')
      return
    }
    setThemeState(next)
    setUserHasChosen(true)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch (_) {
      // Persisting is best-effort; UI still updates in-memory.
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }, [theme, setTheme])

  return { theme, setTheme, toggleTheme }
}
