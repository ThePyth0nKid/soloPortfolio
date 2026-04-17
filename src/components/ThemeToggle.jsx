import { useEffect, useState } from 'react'
import { useTheme } from '../hooks/useTheme'

function SunIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  )
}

function MoonIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  // Re-trigger the icon animation class whenever the theme flips
  const [animKey, setAnimKey] = useState(0)
  useEffect(() => {
    setAnimKey((k) => k + 1)
  }, [theme])

  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode'

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={label}
        title={label}
        aria-pressed={isDark}
        className={[
          'group relative inline-flex h-10 w-10 items-center justify-center rounded-full',
          'border backdrop-blur-md shadow-sm',
          'border-slate-300/70 bg-white/70 text-slate-700 hover:bg-white hover:text-slate-900',
          'dark:border-slate-700/70 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white',
          'transition-colors duration-200',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2',
          'focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950',
        ].join(' ')}
      >
        <span key={animKey} className="icon-swap-enter inline-flex">
          {isDark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
        </span>
        <span className="sr-only">{label}</span>
      </button>
    </div>
  )
}
