import { useEffect, useState } from 'react'

/**
 * Theme toggle: minimal JS — just flips a class on <html> and persists to
 * localStorage. All styling, icon swaps, and transitions live in CSS.
 * Default (no localStorage entry, no class) follows prefers-color-scheme.
 */
export default function ThemeToggle() {
  const getCurrent = () => {
    if (typeof document === 'undefined') return 'system'
    const el = document.documentElement
    if (el.classList.contains('dark')) return 'dark'
    if (el.classList.contains('light')) return 'light'
    return 'system'
  }

  const [theme, setTheme] = useState(getCurrent)

  useEffect(() => {
    const el = document.documentElement
    el.classList.remove('light', 'dark')
    if (theme === 'light' || theme === 'dark') {
      el.classList.add(theme)
      try { localStorage.setItem('theme', theme) } catch {}
    } else {
      try { localStorage.removeItem('theme') } catch {}
    }
  }, [theme])

  const isEffectivelyDark = () => {
    if (theme === 'dark') return true
    if (theme === 'light') return false
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches
  }

  const onClick = () => {
    setTheme(isEffectivelyDark() ? 'light' : 'dark')
  }

  const pressed = isEffectivelyDark()

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label={pressed ? 'Switch to light theme' : 'Switch to dark theme'}
      aria-pressed={pressed}
      title={pressed ? 'Switch to light theme' : 'Switch to dark theme'}
      onClick={onClick}
    >
      <svg className="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
      <svg className="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
      </svg>
    </button>
  )
}
