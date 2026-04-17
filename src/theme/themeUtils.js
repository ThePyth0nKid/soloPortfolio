import {
  DARK_CLASS,
  PREFERS_DARK_MEDIA_QUERY,
  THEME,
  THEME_STORAGE_KEY,
} from './constants'

/**
 * Safely reads from localStorage. Returns `null` if storage is unavailable
 * (SSR, private-mode Safari quota errors, etc.).
 *
 * @returns {'light' | 'dark' | null}
 */
export function readStoredTheme() {
  if (typeof window === 'undefined' || !window.localStorage) return null
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
    if (stored === THEME.LIGHT || stored === THEME.DARK) return stored
    return null
  } catch {
    return null
  }
}

/**
 * Persists the theme choice. Silently no-ops on storage failures — a failed
 * write must never break the UI.
 *
 * @param {'light' | 'dark'} theme
 */
export function writeStoredTheme(theme) {
  if (typeof window === 'undefined' || !window.localStorage) return
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    /* storage full or disabled — ignore */
  }
}

/**
 * Returns the OS-level colour-scheme preference, defaulting to `'light'`
 * when `matchMedia` is unavailable.
 *
 * @returns {'light' | 'dark'}
 */
export function getSystemTheme() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return THEME.LIGHT
  }
  return window.matchMedia(PREFERS_DARK_MEDIA_QUERY).matches
    ? THEME.DARK
    : THEME.LIGHT
}

/**
 * Resolves the theme to apply on first load: stored value wins, otherwise
 * fall back to the system preference.
 *
 * @returns {'light' | 'dark'}
 */
export function resolveInitialTheme() {
  return readStoredTheme() ?? getSystemTheme()
}

/**
 * Applies the theme by toggling the `dark` class on `<html>`.
 *
 * @param {'light' | 'dark'} theme
 */
export function applyThemeToDocument(theme) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  if (theme === THEME.DARK) {
    root.classList.add(DARK_CLASS)
  } else {
    root.classList.remove(DARK_CLASS)
  }
}
