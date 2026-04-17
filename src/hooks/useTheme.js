import { useEffect, useState, useCallback } from 'react'

// Strict allow-list of valid theme values. Anything else in localStorage is
// treated as tampered/corrupt and discarded — we never trust client storage.
const VALID_THEMES = Object.freeze(['light', 'dark'])
const STORAGE_KEY = 'theme-preference'

function isValidTheme(value) {
  return typeof value === 'string' && VALID_THEMES.includes(value)
}

function safeReadStoredTheme() {
  // localStorage access can throw in some environments (private mode, SSR,
  // sandboxed iframes, disabled storage). Fail closed.
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw == null) return null
    // Hard cap on length to defend against someone stuffing junk into storage.
    if (raw.length > 16) return null
    return isValidTheme(raw) ? raw : null
  } catch {
    return null
  }
}

function safeWriteStoredTheme(value) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return
    if (!isValidTheme(value)) return
    window.localStorage.setItem(STORAGE_KEY, value)
  } catch {
    /* ignore — storage is a nice-to-have, not required for correctness */
  }
}

function getSystemTheme() {
  try {
    if (
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      return 'dark'
    }
  } catch {
    /* ignore */
  }
  return 'light'
}

function resolveInitialTheme() {
  const stored = safeReadStoredTheme()
  if (stored) return stored
  return getSystemTheme()
}

export function useTheme() {
  const [theme, setThemeState] = useState(resolveInitialTheme)

  // Apply the theme class to <html> whenever it changes.
  useEffect(() => {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  // Listen for system preference changes, but only apply them if the user
  // hasn't set an explicit preference.
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e) => {
      if (safeReadStoredTheme() == null) {
        setThemeState(e.matches ? 'dark' : 'light')
      }
    }
    // addEventListener isn't supported on older Safari; fall back defensively.
    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', handler)
      return () => mq.removeEventListener('change', handler)
    } else if (typeof mq.addListener === 'function') {
      mq.addListener(handler)
      return () => mq.removeListener(handler)
    }
    return undefined
  }, [])

  const setTheme = useCallback((next) => {
    if (!isValidTheme(next)) {
      // Silently ignore invalid values rather than throwing — don't give
      // attackers a way to crash the UI by poking at globals.
      return
    }
    setThemeState(next)
    safeWriteStoredTheme(next)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'
      safeWriteStoredTheme(next)
      return next
    })
  }, [])

  return { theme, setTheme, toggleTheme }
}
