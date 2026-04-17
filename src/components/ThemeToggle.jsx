import { useCallback, useEffect, useRef, useState } from 'react'
import {
  THEMES,
  applyTheme,
  resolveInitialTheme,
  readStoredTheme,
  writeStoredTheme,
  getSystemTheme,
} from '../lib/theme'

// Simple client-side rate-limit: prevent rapid toggle spam (e.g. held key,
// automated click floods) from thrashing localStorage writes.
const MIN_TOGGLE_INTERVAL_MS = 150

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => resolveInitialTheme())
  const [mounted, setMounted] = useState(false)
  const lastToggleRef = useRef(0)

  // Apply on mount and whenever theme changes.
  useEffect(() => {
    applyTheme(theme)
    setMounted(true)
  }, [theme])

  // Follow system changes *only* when the user has not set an explicit pref.
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
    const handler = () => {
      if (readStoredTheme() == null) {
        setTheme(getSystemTheme())
      }
    }
    // addEventListener is the modern API; addListener is the legacy fallback.
    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', handler)
      return () => mql.removeEventListener('change', handler)
    } else if (typeof mql.addListener === 'function') {
      mql.addListener(handler)
      return () => mql.removeListener(handler)
    }
  }, [])

  const toggle = useCallback(() => {
    const now = Date.now()
    if (now - lastToggleRef.current < MIN_TOGGLE_INTERVAL_MS) return
    lastToggleRef.current = now

    setTheme((prev) => {
      const next = prev === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK
      writeStoredTheme(next)
      // Audit-log security-relevant user preference change (client-side only).
      if (typeof console !== 'undefined' && console.debug) {
        console.debug('[theme] user toggled theme', { next })
      }
      return next
    })
  }, [])

  const isDark = theme === THEMES.DARK
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      aria-pressed={isDark}
      // Avoid hydration/flash mismatch: render neutral until mounted.
      suppressHydrationWarning
      className="fixed top-4 right-4 z-50 inline-flex items-center justify-center w-10 h-10 rounded-full border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
    >
      {mounted && isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}

function SunIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="18"
      height="18"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m4.93 19.07 1.41-1.41" />
      <path d="m17.66 6.34 1.41-1.41" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="18"
      height="18"
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}
