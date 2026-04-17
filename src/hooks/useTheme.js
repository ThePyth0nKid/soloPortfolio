import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'theme'

/**
 * Determine the initial theme:
 *  1. User's stored choice (if any)
 *  2. Otherwise, system preference (prefers-color-scheme)
 *  3. Otherwise, dark (matches original design)
 */
function getInitialTheme() {
  if (typeof window === 'undefined') return 'dark'
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    // localStorage may be unavailable (private mode, etc.) — fall through
  }
  if (window.matchMedia?.('(prefers-color-scheme: light)').matches) {
    return 'light'
  }
  return 'dark'
}

function applyTheme(theme) {
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
  root.style.colorScheme = theme
}

export default function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme)

  // Apply + persist on change
  useEffect(() => {
    applyTheme(theme)
    try {
      window.localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      /* ignore */
    }
  }, [theme])

  // Live-update if the OS preference changes AND the user hasn't chosen explicitly.
  // We treat "no stored value" as "follow system".
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)')
    if (!mq) return
    const handler = (e) => {
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY)
        if (stored !== 'light' && stored !== 'dark') {
          setTheme(e.matches ? 'dark' : 'light')
        }
      } catch {
        /* ignore */
      }
    }
    mq.addEventListener?.('change', handler)
    return () => mq.removeEventListener?.('change', handler)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  }, [])

  return { theme, toggleTheme, setTheme }
}
