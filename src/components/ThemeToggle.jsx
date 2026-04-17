import { useRef } from 'react'
import { useTheme } from '../hooks/useTheme'

// Simple client-side rate limit: prevent rapid toggle spam (e.g. a stuck key
// or an automated script hammering the button). Not a security boundary —
// the toggle has no server side — but it keeps the UI sane.
const MIN_TOGGLE_INTERVAL_MS = 150

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const lastToggleRef = useRef(0)

  const handleClick = () => {
    const now = Date.now()
    if (now - lastToggleRef.current < MIN_TOGGLE_INTERVAL_MS) return
    lastToggleRef.current = now
    toggleTheme()
  }

  const isDark = theme === 'dark'
  const label = isDark ? 'Switch to light theme' : 'Switch to dark theme'

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={label}
      title={label}
      aria-pressed={isDark}
      className="fixed top-4 right-4 z-50 p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur hover:border-slate-500 dark:hover:border-slate-500 transition-colors text-slate-700 dark:text-slate-200 shadow-sm"
    >
      {isDark ? (
        // Sun icon — shown when dark mode is active (click to go light)
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      ) : (
        // Moon icon — shown when light mode is active (click to go dark)
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  )
}
