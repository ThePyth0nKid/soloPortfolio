import { useCallback, useEffect, useRef, useState } from 'react'
import {
  VALID_THEMES,
  applyTheme,
  getInitialTheme,
  getStoredTheme,
  persistTheme,
} from '../lib/theme'

// Simple in-memory rate limit to prevent toggle spamming (which could cause
// layout thrash / act as a mild client-side DoS on slow devices). Max N
// toggles per window; beyond that we silently ignore.
const RATE_LIMIT_MAX = 20
const RATE_LIMIT_WINDOW_MS = 5000

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    const initial = getInitialTheme()
    // Validate defensively even though getInitialTheme already does.
    return VALID_THEMES.includes(initial) ? initial : 'light'
  })

  const clicksRef = useRef([])

  // Apply on mount and whenever theme changes.
  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  // Listen to system preference changes — only honor them if the user has
  // NOT set an explicit preference (i.e. nothing valid in localStorage).
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return
    }
    let mql
    try {
      mql = window.matchMedia('(prefers-color-scheme: dark)')
    } catch {
      return
    }
    const handler = (e) => {
      if (getStoredTheme() === null) {
        setTheme(e.matches ? 'dark' : 'light')
      }
    }
    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', handler)
      return () => mql.removeEventListener('change', handler)
    }
    // Safari < 14 fallback
    if (typeof mql.addListener === 'function') {
      mql.addListener(handler)
      return () => mql.removeListener(handler)
    }
    return undefined
  }, [])

  // Cross-tab sync — if another tab updates the theme, reflect it here.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const onStorage = (e) => {
      if (e.key !== 'theme') return
      if (e.newValue && VALID_THEMES.includes(e.newValue)) {
        setTheme(e.newValue)
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const toggle = useCallback(() => {
    const now = Date.now()
    clicksRef.current = clicksRef.current.filter(
      (t) => now - t < RATE_LIMIT_WINDOW_MS,
    )
    if (clicksRef.current.length >= RATE_LIMIT_MAX) {
      // Audit log (dev-only). In a real app this would go to a telemetry sink.
      if (import.meta.env?.DEV) {
        console.warn('[theme] toggle rate limit exceeded; ignoring click')
      }
      return
    }
    clicksRef.current.push(now)

    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'
      persistTheme(next)
      return next
    })
  }, [])

  const isDark = theme === 'dark'
  const label = isDark ? 'Switch to light theme' : 'Switch to dark theme'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      aria-pressed={isDark}
      className="fixed top-4 right-4 z-50 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 bg-white/80 text-slate-700 shadow-sm backdrop-blur hover:border-slate-400 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 transition-colors dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-900"
    >
      {isDark ? (
        // Sun icon — click to go light
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      ) : (
        // Moon icon — click to go dark
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  )
}
