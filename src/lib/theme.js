// Theme utilities — client-side only, defense-in-depth validation.
//
// Security Considerations:
// - localStorage is untrusted input (user can edit via DevTools, extensions,
//   or cross-origin XSS elsewhere on the same origin). We validate that the
//   stored value is one of our allowlisted literals before using it.
// - We never inject the value into the DOM as HTML; it is only used as a
//   classList token drawn from our own constants, eliminating XSS surface.
// - No PII is stored. Only a single enum-like preference string. No GDPR
//   retention concerns apply (not personal data under Art. 4 GDPR).
// - Storage access is wrapped in try/catch: Safari private mode, disabled
//   storage, and sandboxed iframes can throw on access.

export const THEMES = Object.freeze({ LIGHT: 'light', DARK: 'dark' })
const VALID_THEMES = new Set([THEMES.LIGHT, THEMES.DARK])
const STORAGE_KEY = 'theme-preference'

function isValidTheme(value) {
  return typeof value === 'string' && VALID_THEMES.has(value)
}

export function readStoredTheme() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw == null) return null
    // Hard length cap — defend against pathological values.
    if (raw.length > 16) return null
    return isValidTheme(raw) ? raw : null
  } catch {
    return null
  }
}

export function writeStoredTheme(theme) {
  if (!isValidTheme(theme)) return false
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false
    window.localStorage.setItem(STORAGE_KEY, theme)
    return true
  } catch {
    // Quota exceeded, disabled storage, etc. — fail closed but don't crash.
    return false
  }
}

export function getSystemTheme() {
  try {
    if (
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      return THEMES.DARK
    }
  } catch {
    // matchMedia can throw in exotic environments; fall through to default.
  }
  return THEMES.LIGHT
}

export function resolveInitialTheme() {
  return readStoredTheme() ?? getSystemTheme()
}

export function applyTheme(theme) {
  if (!isValidTheme(theme)) return
  if (typeof document === 'undefined') return
  const root = document.documentElement
  if (theme === THEMES.DARK) {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}
