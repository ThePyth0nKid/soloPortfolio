import { useRef } from 'react'
import { useTheme } from '../hooks/useTheme'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const liveRef = useRef(null)
  const isDark = theme === 'dark'

  const handleClick = () => {
    toggleTheme()
    // Announce the change to assistive tech.
    if (liveRef.current) {
      liveRef.current.textContent = isDark
        ? 'Light theme enabled'
        : 'Dark theme enabled'
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        type="button"
        onClick={handleClick}
        aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
        aria-pressed={isDark}
        title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
        className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-slate-300 bg-white text-slate-700 shadow-sm hover:bg-slate-100 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:border-slate-500 transition-colors"
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
            className="w-5 h-5"
            aria-hidden="true"
            focusable="false"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
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
            className="w-5 h-5"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
          </svg>
        )}
      </button>
      <div ref={liveRef} role="status" aria-live="polite" className="sr-only" />
    </div>
  )
}
