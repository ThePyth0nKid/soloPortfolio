import { useCallback, useEffect, useState } from 'react'

/**
 * Storage key used to persist the user's theme preference.
 * @type {string}
 */
export const THEME_STORAGE_KEY = 'portfolio:theme'

/** @type {'light'} */
export const THEME_LIGHT = 'light'
/** @type {'dark'} */
export const THEME_DARK = 'dark'

/**
 * @typedef {'light' | 'dark'} Theme
 */

/**
 * Reads the user's stored theme preference, falling back to system preference.
 *
 * Safe to call during SSR — returns `light` if `window` is unavailable.
 *
 * @param {Storage | undefined} storage - Storage implementation (defaults to localStorage).
 * @param {((query: string) => MediaQueryList) | undefined} matchMedia - matchMedia implementation.
 * @returns {Theme}
 */
export function getInitialTheme(storage, matchMedia) {
  const safeStorage = storage ?? (typeof window !== 'undefined' ? window.localStorage : undefined)
  const safeMatchMedia =
    matchMedia ?? (typeof window !== 'undefined' ? window.matchMedia.bind(window) : undefined)

  try {
    const stored = safeStorage?.getItem(THEME_STORAGE_KEY)
    if (stored === THEME_LIGHT || stored === THEME_DARK) {
      return stored
    }
  } catch {
    // Accessing storage can throw (e.g. Safari private mode). Fall through to system preference.
  }

  if (safeMatchMedia && safeMatchMedia('(prefers-color-scheme: dark)').matches) {
    return THEME_DARK
  }
  return THEME_LIGHT
}

/**
 * Applies the given theme to the document root by toggling the `dark` class.
 *
 * @param {Theme} theme
 * @param {Document | undefined} doc
 * @returns {void}
 */
export function applyThemeToDocument(theme, doc) {
  const target = doc ?? (typeof document !== 'undefined' ? document : undefined)
  if (!target) return
  const root = target.documentElement
  if (theme === THEME_DARK) {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
  root.setAttribute('data-theme', theme)
}

/**
 * React hook that manages the active theme, persists the user's choice,
 * and keeps the `<html>` element's class in sync.
 *
 * @returns {{ theme: Theme, toggleTheme: () => void, setTheme: (t: Theme) => void }}
 */
export function useTheme() {
  const [theme, setThemeState] = useState(() => getInitialTheme())

  useEffect(() => {
    applyThemeToDocument(theme)
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch {
      // Ignore storage write failures — toggle still works in-memory.
    }
  }, [theme])

  const setTheme = useCallback((next) => {
    if (next !== THEME_LIGHT && next !== THEME_DARK) {
      throw new Error(`Invalid theme: ${String(next)}. Expected '${THEME_LIGHT}' or '${THEME_DARK}'.`)
    }
    setThemeState(next)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((current) => (current === THEME_DARK ? THEME_LIGHT : THEME_DARK))
  }, [])

  return { theme, toggleTheme, setTheme }
}
