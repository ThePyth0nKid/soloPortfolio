/**
 * Theme management utilities.
 *
 * Handles reading/writing user theme preference to localStorage,
 * detecting system preference, and applying the `dark` class to <html>.
 *
 * Keeping this isolated from React makes it trivially unit-testable.
 */

export const THEME_STORAGE_KEY = 'theme'
export const THEME_LIGHT = 'light'
export const THEME_DARK = 'dark'
export const DARK_CLASS = 'dark'
export const SYSTEM_DARK_MEDIA_QUERY = '(prefers-color-scheme: dark)'

/** @typedef {'light' | 'dark'} Theme */

/**
 * Returns the theme stored in localStorage, or null if none is set or the
 * value is invalid. Safe to call in non-browser environments.
 *
 * @param {Storage} [storage]
 * @returns {Theme | null}
 */
export function getStoredTheme(storage) {
  const store = storage ?? (typeof localStorage !== 'undefined' ? localStorage : null)
  if (!store) return null
  try {
    const value = store.getItem(THEME_STORAGE_KEY)
    if (value === THEME_LIGHT || value === THEME_DARK) return value
    return null
  } catch {
    // localStorage can throw in private browsing modes.
    return null
  }
}

/**
 * Persists the given theme to localStorage. Fails silently if unavailable.
 *
 * @param {Theme} theme
 * @param {Storage} [storage]
 */
export function storeTheme(theme, storage) {
  if (theme !== THEME_LIGHT && theme !== THEME_DARK) {
    throw new Error(`Invalid theme: ${String(theme)}`)
  }
  const store = storage ?? (typeof localStorage !== 'undefined' ? localStorage : null)
  if (!store) return
  try {
    store.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // Ignore storage errors — UI still works without persistence.
  }
}

/**
 * Returns the OS-level preferred theme. Defaults to light if matchMedia is
 * unavailable (e.g. SSR, older browsers).
 *
 * @param {Window} [win]
 * @returns {Theme}
 */
export function getSystemTheme(win) {
  const w = win ?? (typeof window !== 'undefined' ? window : null)
  if (!w || typeof w.matchMedia !== 'function') return THEME_LIGHT
  return w.matchMedia(SYSTEM_DARK_MEDIA_QUERY).matches ? THEME_DARK : THEME_LIGHT
}

/**
 * Resolves the initial theme: stored preference wins, otherwise system.
 *
 * @param {{ storage?: Storage, win?: Window }} [deps]
 * @returns {Theme}
 */
export function resolveInitialTheme(deps = {}) {
  return getStoredTheme(deps.storage) ?? getSystemTheme(deps.win)
}

/**
 * Applies the theme to a root element by toggling the `dark` class.
 *
 * @param {Theme} theme
 * @param {HTMLElement} [root]
 */
export function applyTheme(theme, root) {
  if (theme !== THEME_LIGHT && theme !== THEME_DARK) {
    throw new Error(`Invalid theme: ${String(theme)}`)
  }
  const el = root ?? (typeof document !== 'undefined' ? document.documentElement : null)
  if (!el) return
  if (theme === THEME_DARK) {
    el.classList.add(DARK_CLASS)
  } else {
    el.classList.remove(DARK_CLASS)
  }
}
