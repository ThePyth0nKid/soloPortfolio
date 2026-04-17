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
      className="
        group fixed top-4 right-4 z-50
        inline-flex items-center justify-center
        w-11 h-11 rounded-full
        bg-white/80 dark:bg-slate-900/80
        backdrop-blur
        border border-slate-200 dark:border-slate-700
        shadow-sm hover:shadow-md
        text-slate-700 dark:text-slate-200
        hover:border-slate-300 dark:hover:border-slate-600
        hover:scale-105 active:scale-95
        transition-all duration-200 ease-out
        focus-ring
      "
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
        className={`absolute w-5 h-5 transition-all duration-300 ease-out ${
          isDark
            ? 'opacity-100 rotate-0 scale-100'
            : 'opacity-0 -rotate-90 scale-50'
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
        className={`absolute w-5 h-5 transition-all duration-300 ease-out ${
          isDark
            ? 'opacity-0 rotate-90 scale-50'
            : 'opacity-100 rotate-0 scale-100'
        }`}
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>

      <span className="sr-only">
        Current theme: {theme}. Click to switch to {nextLabel} mode.
      </span>
    </button>
  )
}
