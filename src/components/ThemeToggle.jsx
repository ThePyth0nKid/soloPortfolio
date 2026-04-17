import { useRef } from 'react'
import { useTheme } from '../hooks/useTheme'

// Security Considerations:
// - Client-side rate-limit on toggle clicks to prevent a stuck key or
//   malicious script from spamming DOM class mutations + localStorage writes
//   (which could thrash storage quota or trigger layout storms).
// - aria-pressed + aria-label for a11y; the button never renders user-
//   controlled strings, so no XSS surface.

const MIN_INTERVAL_MS = 120

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

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="fixed top-4 right-4 z-50 inline-flex items-center justify-center w-10 h-10 rounded-full border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur text-slate-700 dark:text-slate-200 shadow-sm hover:border-slate-400 dark:hover:border-slate-500 transition-colors"
    >
      {isDark ? (
        // Sun icon (shown in dark mode — click to go light)
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
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
        // Moon icon (shown in light mode — click to go dark)
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
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
