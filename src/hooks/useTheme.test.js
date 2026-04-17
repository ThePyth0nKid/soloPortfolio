/**
 * Unit tests for the theme hook utilities.
 *
 * These tests target the pure helpers (`getInitialTheme`, `applyThemeToDocument`)
 * which don't require a React renderer, so they run under any plain JS test
 * runner (Vitest / Jest) with a jsdom environment.
 *
 * No test runner is currently wired into package.json for this demo repo; the
 * file is provided so the behaviour is documented and ready to execute as soon
 * as a runner is added (e.g. `npm i -D vitest jsdom`).
 *
 * @vitest-environment jsdom
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  THEMES,
  THEME_STORAGE_KEY,
  applyThemeToDocument,
  getInitialTheme,
} from './useTheme'

function mockMatchMedia(prefersDark) {
  window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: query === '(prefers-color-scheme: dark)' ? prefersDark : false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
}

describe('getInitialTheme', () => {
  beforeEach(() => {
    window.localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  it('returns the persisted theme when one is stored', () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, THEMES.DARK)
    mockMatchMedia(false)
    expect(getInitialTheme()).toBe(THEMES.DARK)
  })

  it('ignores invalid persisted values and falls back to system preference', () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, 'neon')
    mockMatchMedia(true)
    expect(getInitialTheme()).toBe(THEMES.DARK)
  })

  it('uses prefers-color-scheme: dark on first visit', () => {
    mockMatchMedia(true)
    expect(getInitialTheme()).toBe(THEMES.DARK)
  })

  it('defaults to light when no preference and no storage', () => {
    mockMatchMedia(false)
    expect(getInitialTheme()).toBe(THEMES.LIGHT)
  })
})

describe('applyThemeToDocument', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('dark')
  })

  it('adds the `dark` class for dark theme', () => {
    applyThemeToDocument(THEMES.DARK)
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('removes the `dark` class for light theme', () => {
    document.documentElement.classList.add('dark')
    applyThemeToDocument(THEMES.LIGHT)
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })
})
