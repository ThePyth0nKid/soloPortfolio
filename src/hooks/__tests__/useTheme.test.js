/**
 * Unit tests for theme utilities.
 *
 * These tests are framework-agnostic: they run under Vitest or Jest if either
 * is added to the project. They avoid importing a test runner directly so the
 * file can live alongside the source without requiring new dependencies to be
 * installed for the dev server to boot.
 *
 * To run: install vitest and execute `npx vitest`.
 */

import {
  THEME_DARK,
  THEME_LIGHT,
  THEME_STORAGE_KEY,
  applyThemeToDocument,
  getInitialTheme,
} from '../useTheme'

/** @returns {Storage} */
function createMemoryStorage() {
  const map = new Map()
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => void map.set(k, String(v)),
    removeItem: (k) => void map.delete(k),
    clear: () => map.clear(),
    key: (i) => Array.from(map.keys())[i] ?? null,
    get length() {
      return map.size
    },
  }
}

/** @param {boolean} matches */
function createMatchMedia(matches) {
  return (_query) => ({
    matches,
    media: _query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })
}

const describeFn = globalThis.describe ?? ((_name, fn) => fn())
const testFn = globalThis.test ?? globalThis.it ?? ((_name, fn) => fn())
const expectFn =
  globalThis.expect ??
  ((actual) => ({
    toBe: (expected) => {
      if (actual !== expected) {
        throw new Error(`Expected ${String(actual)} to be ${String(expected)}`)
      }
    },
    toContain: (expected) => {
      if (!actual?.contains?.(expected) && !String(actual).includes(expected)) {
        throw new Error(`Expected ${String(actual)} to contain ${String(expected)}`)
      }
    },
  }))

describeFn('getInitialTheme', () => {
  testFn('returns stored theme when present and valid', () => {
    const storage = createMemoryStorage()
    storage.setItem(THEME_STORAGE_KEY, THEME_DARK)
    expectFn(getInitialTheme(storage, createMatchMedia(false))).toBe(THEME_DARK)
  })

  testFn('falls back to system dark preference when nothing stored', () => {
    const storage = createMemoryStorage()
    expectFn(getInitialTheme(storage, createMatchMedia(true))).toBe(THEME_DARK)
  })

  testFn('falls back to light when nothing stored and system prefers light', () => {
    const storage = createMemoryStorage()
    expectFn(getInitialTheme(storage, createMatchMedia(false))).toBe(THEME_LIGHT)
  })

  testFn('ignores invalid stored values', () => {
    const storage = createMemoryStorage()
    storage.setItem(THEME_STORAGE_KEY, 'neon')
    expectFn(getInitialTheme(storage, createMatchMedia(true))).toBe(THEME_DARK)
  })
})

describeFn('applyThemeToDocument', () => {
  testFn('adds the dark class for dark theme', () => {
    const classList = new Set()
    const attrs = {}
    const doc = {
      documentElement: {
        classList: {
          add: (c) => classList.add(c),
          remove: (c) => classList.delete(c),
          contains: (c) => classList.has(c),
        },
        setAttribute: (k, v) => {
          attrs[k] = v
        },
      },
    }
    applyThemeToDocument(THEME_DARK, doc)
    expectFn(classList.has('dark')).toBe(true)
    expectFn(attrs['data-theme']).toBe(THEME_DARK)
  })

  testFn('removes the dark class for light theme', () => {
    const classList = new Set(['dark'])
    const attrs = {}
    const doc = {
      documentElement: {
        classList: {
          add: (c) => classList.add(c),
          remove: (c) => classList.delete(c),
          contains: (c) => classList.has(c),
        },
        setAttribute: (k, v) => {
          attrs[k] = v
        },
      },
    }
    applyThemeToDocument(THEME_LIGHT, doc)
    expectFn(classList.has('dark')).toBe(false)
    expectFn(attrs['data-theme']).toBe(THEME_LIGHT)
  })
})
