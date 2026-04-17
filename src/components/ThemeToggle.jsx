import { useRef } from 'react'
import { useTheme } from '../hooks/useTheme'

// Lightweight client-side rate limit to prevent UI-thread abuse
// (e.g. a key held down or a script hammering the button).
const MIN_INTERVAL_MS = 150

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const lastClickRef = useRef(0)

  const onClick = () => {
    const now = Date.now()
    if (now - lastClickRef.current < MIN_INTERVAL_MS) return
    lastClickRef.current = now
    toggleTheme()
  }

  const isDark = theme === 'dark'
  const label = isDark ? 'Switch to light theme' : 'Switch to dark theme'

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      aria-pressed={isDark}
      className="fixed top-4 right-4 z-50 inline-flex items-center justify-center w-10 h-10 rounded-lg border border-slate-300 bg-white/80 text-slate-700 backdrop-blur hover:border-slate-400 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:text-white transition-colors shadow-sm"
    >
      {isDark ? (
        // Sun icon — click to go light
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true" focusable="false">
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
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true" focusable="false">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  )
}
