import { useCallback, useEffect, useRef, useState } from 'react'
import {
  applyThemeToDocument,
  readStoredTheme,
  resolveInitialTheme,
  writeStoredTheme,
} from '../lib/theme'

// Simple client-side rate-limiter: prevent pathological rapid toggling
// (e.g. a stuck key or malicious script) from thrashing localStorage.
const MIN_TOGGLE_INTERVAL_MS = 100

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => resolveInitialTheme())
  const lastToggleRef = useRef(0)

  // Apply on mount and whenever theme changes.
  useEffect(() => {
    applyThemeToDocument(theme)
  }, [theme])

  // Respect live system changes only if the user hasn't made an explicit choice.
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return undefined
    }
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e) => {
      if (readStoredTheme() === null) {
        setTheme(e.matches ? 'dark' : 'light')
      }
    }
    // Safari < 14 uses addListener
    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', handler)
      return () => mql.removeEventListener('change', handler)
    }
    mql.addListener(handler)
    return () => mql.removeListener(handler)
  }, [])

  const toggle = useCallback(() => {
    const now = Date.now()
    if (now - lastToggleRef.current < MIN_TOGGLE_INTERVAL_MS) return
    lastToggleRef.current = now

    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'
      writeStoredTheme(next)
      return next
    })
  }, [])

  const isDark = theme === 'dark'
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      aria-pressed={isDark}
      className="fixed top-4 right-4 z-50 inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white/80 text-slate-700 shadow-sm backdrop-blur transition-colors hover:border-slate-400 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-900"
    >
      {isDark ? (
        // Sun icon — shown in dark mode (click to go light)
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
          focusable="false"
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
        // Moon icon — shown in light mode (click to go dark)
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
          focusable="false"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  )
}
