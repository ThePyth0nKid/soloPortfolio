import { useTheme } from '../hooks/useTheme'

/**
 * ThemeToggle — fixed, top-right sun/moon button.
 *
 * UX considerations:
 *  - Keyboard accessible (it's a native <button>, focus-visible ring via CSS).
 *  - aria-label + aria-pressed so screen readers announce state + action.
 *  - title tooltip for mouse users.
 *  - Icon cross-fades + rotates gently — subtle, not flashy.
 *  - Respects prefers-reduced-motion (handled globally in index.css).
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
        'w-11 h-11 rounded-full',
        'backdrop-blur-md',
        'bg-white/70 dark:bg-slate-900/70',
        'border border-slate-200 dark:border-slate-700',
        'shadow-sm hover:shadow-md',
        'hover:scale-105 active:scale-95',
        'transition-all duration-200',
      ].join(' ')}
    >
      <span className="sr-only">
        {isDark ? 'Dark mode active. ' : 'Light mode active. '}
        Activate to switch to {nextLabel} mode.
      </span>

      <span className="relative block w-5 h-5" aria-hidden="true">
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
            'absolute inset-0 w-5 h-5 text-amber-500',
            'transition-all duration-300',
            isDark ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100',
          ].join(' ')}
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
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
            'absolute inset-0 w-5 h-5 text-slate-200',
            'transition-all duration-300',
            isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50',
          ].join(' ')}
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </span>
    </button>
  )
}
