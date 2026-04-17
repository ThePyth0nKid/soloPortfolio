import { useTheme } from '../hooks/useTheme'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  const nextLabel = isDark ? 'light' : 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      role="switch"
      aria-checked={isDark}
      aria-label={`Switch to ${nextLabel} mode`}
      title={`Switch to ${nextLabel} mode`}
      className="fixed top-4 right-4 z-50 inline-flex items-center justify-center h-10 w-10 rounded-full
                 border border-slate-300 bg-white/80 text-slate-700 shadow-sm backdrop-blur
                 hover:border-slate-400 hover:bg-white hover:scale-105
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2
                 focus-visible:ring-offset-white
                 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200
                 dark:hover:border-slate-500 dark:hover:bg-slate-900
                 dark:focus-visible:ring-offset-slate-950
                 transition-all duration-300 ease-out"
    >
      {/* Sun icon — visible in dark mode (click to go light) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className={`absolute h-5 w-5 transition-all duration-300 ease-out ${
          isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'
        }`}
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>

      {/* Moon icon — visible in light mode (click to go dark) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className={`absolute h-5 w-5 transition-all duration-300 ease-out ${
          isDark ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'
        }`}
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>

      <span className="sr-only">
        {isDark ? 'Dark mode is on. ' : 'Light mode is on. '}
        Activate to switch to {nextLabel} mode.
      </span>
    </button>
  )
}
