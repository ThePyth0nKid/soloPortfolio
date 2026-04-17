import { useEffect, useState, useCallback } from 'react'

// Security / privacy notes:
// - Theme preference is stored client-side only in localStorage.
// - Key is namespaced to avoid collisions with other apps on the same origin.
// - Value is strictly validated against an allow-list ('light' | 'dark')
//   before being read or written, so a tampered localStorage entry cannot
//   inject arbitrary strings into className or DOM attributes.
// - No PII is stored; this is a purely cosmetic preference. Under GDPR this
//   is a "strictly necessary / user-preference" cookie-equivalent and does
//   not require consent, but we still keep the footprint minimal.

const STORAGE_KEY = 'solo-portfolio:theme'
const VALID_THEMES = Object.freeze(['light', 'dark'])

function isValidTheme(value) {
  return typeof value === 'string' && VALID_THEMES.includes(value)
}

function safeReadStoredTheme() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!isValidTheme(raw)) {
      // Clean up any tampered / legacy value so we don't keep re-reading it.
      if (raw !== null) {
        try { window.localStorage.removeItem(STORAGE_KEY) } catch (_) { /* noop */ }
      }
      return null
    }
    return raw
  } catch (_) {
    // localStorage can throw in private mode / sandboxed iframes.
    return null
  }
}

function safeWriteStoredTheme(theme) {
  if (!isValidTheme(theme)) return
  try {
    if (typeof window === 'undefined' || !window.localStorage) return
    window.localStorage.setItem(STORAGE_KEY, theme)
  } catch (_) {
    // Quota / disabled storage — fail silently, theme still works in-memory.
  }
}

function getSystemTheme() {
  try {
    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
  } catch (_) { /* noop */ }
  return 'light'
}

function resolveInitialTheme() {
  const stored = safeReadStoredTheme()
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
  const [theme, setThemeState] = useState(resolveInitialTheme)
  const [userHasChosen, setUserHasChosen] = useState(() => safeReadStoredTheme() !== null)

  // Apply theme to <html> whenever it changes.
  useEffect(() => {
    applyThemeToDocument(theme)
  }, [theme])

  // Follow system changes only if user hasn't explicitly chosen.
  useEffect(() => {
    if (userHasChosen) return
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e) => {
      setThemeState(e.matches ? 'dark' : 'light')
    }
    // addEventListener is the modern API; fall back defensively.
    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', handler)
      return () => mq.removeEventListener('change', handler)
    } else if (typeof mq.addListener === 'function') {
      mq.addListener(handler)
      return () => mq.removeListener(handler)
    }
    return undefined
  }, [userHasChosen])

  const setTheme = useCallback((next) => {
    if (!isValidTheme(next)) return
    setThemeState(next)
    setUserHasChosen(true)
    safeWriteStoredTheme(next)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'
      safeWriteStoredTheme(next)
      return next
    })
    setUserHasChosen(true)
  }, [])

  return { theme, setTheme, toggleTheme }
}
