import { useTheme } from '../hooks/useTheme'

/**
 * ThemeToggle — fixed top-right sun/moon switch.
 *
 * UX notes:
 * - Fixed positioning so it's always reachable while scrolling.
 * - aria-pressed + descriptive aria-label for screen readers.
 * - title attribute for a native tooltip hint.
 * - Icons crossfade + rotate for a tiny "aha" moment (skipped if reduced-motion).
 * - Large 44x44 tap target (WCAG 2.5.5 minimum).
 */
export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  const nextLabel = isDark ? 'light' : 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${nextLabel} mode`}
      aria-pressed={isDark}
      title={`Switch to ${nextLabel} mode`}
      className={[
        'fixed top-4 right-4 z-50',
        'inline-flex items-center justify-center',
        'h-11 w-11 rounded-full',
        'border backdrop-blur-md',
        'border-slate-300 bg-white/70 text-slate-700 hover:bg-white hover:border-slate-400',
        'dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:bg-slate-900 dark:hover:border-slate-500',
        'shadow-sm hover:shadow-md',
        'transition-all duration-300 ease-out',
        'active:scale-95',
      ].join(' ')}
    >
      {/* Sun (shown in dark mode — click to go light) */}
      <SunIcon
        className={[
          'absolute h-5 w-5 transition-all duration-300 ease-out',
          isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50',
        ].join(' ')}
      />
      {/* Moon (shown in light mode — click to go dark) */}
      <MoonIcon
        className={[
          'absolute h-5 w-5 transition-all duration-300 ease-out',
          isDark ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100',
        ].join(' ')}
      />
      <span className="sr-only">
        {isDark ? 'Dark mode is on.' : 'Light mode is on.'} Click to switch to {nextLabel} mode.
      </span>
    </button>
  )
}

function SunIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
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
  )
}

function MoonIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}
