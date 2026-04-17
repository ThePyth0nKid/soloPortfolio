// Theme utilities — client-side only, no PII, no network.
// Security notes:
// - localStorage is origin-scoped; we still validate the stored value
//   strictly against an allow-list before applying it to avoid any
//   unexpected class injection or logic errors if the value is tampered.
// - We never interpolate the stored value into HTML/CSS; it only maps
//   to a boolean decision for adding/removing the `dark` class.
// - Writes are wrapped in try/catch because storage can throw
//   (Safari private mode, quota exceeded, disabled storage).

export const THEME_STORAGE_KEY = 'theme'
export const VALID_THEMES = Object.freeze(['light', 'dark'])

function isValidTheme(value) {
  return typeof value === 'string' && VALID_THEMES.includes(value)
}

export function readStoredTheme() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null
    const raw = window.localStorage.getItem(THEME_STORAGE_KEY)
    return isValidTheme(raw) ? raw : null
  } catch {
    return null
  }
}

export function writeStoredTheme(theme) {
  if (!isValidTheme(theme)) return false
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
    return true
  } catch {
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
      return 'dark'
    }
  } catch {
    // ignore
  }
  return 'light'
}

export function resolveInitialTheme() {
  return readStoredTheme() ?? getSystemTheme()
}

export function applyThemeToDocument(theme) {
  if (!isValidTheme(theme)) return
  if (typeof document === 'undefined') return
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}
