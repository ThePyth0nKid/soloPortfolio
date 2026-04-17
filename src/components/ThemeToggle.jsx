import { useRef } from 'react'
import { useTheme } from '../hooks/useTheme'

// Simple client-side rate-limit: ignore rapid repeat clicks (< 150ms apart).
// Prevents accidental / malicious event-flooding from thrashing localStorage
// or the DOM class toggle.
const MIN_TOGGLE_INTERVAL_MS = 150

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const lastClickRef = useRef(0)

  const handleClick = () => {
    const now = Date.now()
    if (now - lastClickRef.current < MIN_TOGGLE_INTERVAL_MS) return
    lastClickRef.current = now
    toggleTheme()
  }

  const isDark = theme === 'dark'
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode'

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={label}
      title={label}
      aria-pressed={isDark}
      className="fixed top-4 right-4 z-50 p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur hover:border-slate-400 dark:hover:border-slate-500 text-slate-700 dark:text-slate-200 transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
    >
      {isDark ? (
        // Sun icon
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
        // Moon icon
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  )
}
