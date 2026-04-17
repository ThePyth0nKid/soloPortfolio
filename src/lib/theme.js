// Theme utilities — client-side only.
//
// Security Considerations:
// - localStorage is accessible to any script on the same origin; we therefore
//   only ever store a strictly whitelisted, non-sensitive string ('light' |
//   'dark'). No PII, no secrets, no user identifiers.
// - All reads from localStorage are validated against an allow-list before
//   being applied, defending against tampering (a user/extension could set
//   arbitrary values, e.g. an attempt at a stored-XSS-style payload). We
//   never interpolate the stored value into HTML/CSS directly; we only use
//   it to toggle a known class name.
// - window/document/localStorage access is guarded for SSR-safety and for
//   environments where storage is disabled (private mode, quota errors).
// - No network calls, no third-party code, no eval — purely local state.

export const THEME_STORAGE_KEY = 'theme'
export const VALID_THEMES = Object.freeze(['light', 'dark'])

function isValidTheme(value) {
  return typeof value === 'string' && VALID_THEMES.includes(value)
}

export function getStoredTheme() {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(THEME_STORAGE_KEY)
    // Strict allow-list validation — reject anything unexpected.
    return isValidTheme(raw) ? raw : null
  } catch {
    // localStorage may throw (disabled, quota, sandboxed iframe, etc.)
    return null
  }
}

export function getSystemTheme() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return 'light'
  }
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  } catch {
    return 'light'
  }
}

export function getInitialTheme() {
  return getStoredTheme() ?? getSystemTheme()
}

export function applyTheme(theme) {
  if (!isValidTheme(theme)) return
  if (typeof document === 'undefined') return
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

export function persistTheme(theme) {
  if (!isValidTheme(theme)) return
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // Storage unavailable — fail silently; theme still applies for session.
  }
}
