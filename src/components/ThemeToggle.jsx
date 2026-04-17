import useTheme from '../hooks/useTheme'

/**
 * Accessible, keyboard-navigable theme toggle.
 * - Fixed to the top-right of the viewport so it's always reachable.
 * - aria-pressed communicates toggle state to screen readers.
 * - Icon cross-fades + rotates subtly (respects prefers-reduced-motion via CSS).
 */
export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  const nextLabel = isDark ? 'Switch to light mode' : 'Switch to dark mode'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={nextLabel}
      aria-pressed={isDark}
      title={nextLabel}
      className={[
        'fixed top-4 right-4 z-50',
        'inline-flex items-center justify-center',
        'h-10 w-10 rounded-full',
        'bg-white/80 dark:bg-slate-900/70',
        'border border-slate-300 dark:border-slate-700',
        'backdrop-blur-md shadow-sm',
        'text-slate-700 dark:text-slate-200',
        'hover:bg-white dark:hover:bg-slate-800',
        'hover:border-slate-400 dark:hover:border-slate-500',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2',
        'focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950',
        'theme-transition',
      ].join(' ')}
    >
      <span className="relative block h-5 w-5" aria-hidden="true">
        {/* Sun */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={[
            'absolute inset-0 h-5 w-5',
            'transition-all duration-300 ease-out',
            isDark ? 'opacity-0 scale-50 -rotate-90' : 'opacity-100 scale-100 rotate-0',
          ].join(' ')}
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
        {/* Moon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={[
            'absolute inset-0 h-5 w-5',
            'transition-all duration-300 ease-out',
            isDark ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 rotate-90',
          ].join(' ')}
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
        </svg>
      </span>
      <span className="sr-only">{nextLabel}</span>
    </button>
  )
}
