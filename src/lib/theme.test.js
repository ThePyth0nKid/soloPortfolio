/**
 * Unit tests for theme utilities.
 *
 * These are written in a framework-agnostic style (node:test + node:assert)
 * so they can run with `node --test src/lib/theme.test.js` without adding
 * new devDependencies. If the project later adopts Vitest/Jest, they can
 * be ported with minimal changes.
 */

import { describe, it, beforeEach } from 'node:test'
import assert from 'node:assert/strict'

import {
  DARK_CLASS,
  THEME_DARK,
  THEME_LIGHT,
  THEME_STORAGE_KEY,
  applyTheme,
  getStoredTheme,
  getSystemTheme,
  resolveInitialTheme,
  storeTheme,
} from './theme.js'

/** Minimal in-memory Storage implementation matching the Web Storage API. */
function createMockStorage(initial = {}) {
  const data = new Map(Object.entries(initial))
  return {
    getItem: (k) => (data.has(k) ? data.get(k) : null),
    setItem: (k, v) => {
      data.set(k, String(v))
    },
    removeItem: (k) => {
      data.delete(k)
    },
    clear: () => data.clear(),
    key: (i) => Array.from(data.keys())[i] ?? null,
    get length() {
      return data.size
    },
  }
}

function createMockWindow(prefersDark) {
  return {
    matchMedia: (query) => ({
      matches: query.includes('dark') && prefersDark,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }),
  }
}

function createMockRoot() {
  const classes = new Set()
  return {
    classList: {
      add: (c) => classes.add(c),
      remove: (c) => classes.delete(c),
      contains: (c) => classes.has(c),
    },
    _classes: classes,
  }
}

describe('getStoredTheme', () => {
  it('returns null when nothing is stored', () => {
    assert.equal(getStoredTheme(createMockStorage()), null)
  })

  it('returns the stored theme when valid', () => {
    const storage = createMockStorage({ [THEME_STORAGE_KEY]: THEME_DARK })
    assert.equal(getStoredTheme(storage), THEME_DARK)
  })

  it('returns null for invalid stored values', () => {
    const storage = createMockStorage({ [THEME_STORAGE_KEY]: 'neon' })
    assert.equal(getStoredTheme(storage), null)
  })
})

describe('storeTheme', () => {
  it('writes the theme to storage', () => {
    const storage = createMockStorage()
    storeTheme(THEME_DARK, storage)
    assert.equal(storage.getItem(THEME_STORAGE_KEY), THEME_DARK)
  })

  it('throws on invalid theme values', () => {
    const storage = createMockStorage()
    assert.throws(() => storeTheme('chartreuse', storage), /Invalid theme/)
  })
})

describe('getSystemTheme', () => {
  it('returns dark when the OS prefers dark', () => {
    assert.equal(getSystemTheme(createMockWindow(true)), THEME_DARK)
  })

  it('returns light when the OS prefers light', () => {
    assert.equal(getSystemTheme(createMockWindow(false)), THEME_LIGHT)
  })

  it('defaults to light when matchMedia is unavailable', () => {
    assert.equal(getSystemTheme({}), THEME_LIGHT)
  })
})

describe('resolveInitialTheme', () => {
  it('prefers the stored theme over system preference', () => {
    const storage = createMockStorage({ [THEME_STORAGE_KEY]: THEME_LIGHT })
    const win = createMockWindow(true) // system = dark
    assert.equal(resolveInitialTheme({ storage, win }), THEME_LIGHT)
  })

  it('falls back to system preference when nothing is stored', () => {
    const storage = createMockStorage()
    const win = createMockWindow(true)
    assert.equal(resolveInitialTheme({ storage, win }), THEME_DARK)
  })
})

describe('applyTheme', () => {
  let root
  beforeEach(() => {
    root = createMockRoot()
  })

  it('adds the dark class for dark theme', () => {
    applyTheme(THEME_DARK, root)
    assert.equal(root.classList.contains(DARK_CLASS), true)
  })

  it('removes the dark class for light theme', () => {
    root.classList.add(DARK_CLASS)
    applyTheme(THEME_LIGHT, root)
    assert.equal(root.classList.contains(DARK_CLASS), false)
  })

  it('throws on invalid theme values', () => {
    assert.throws(() => applyTheme('sepia', root), /Invalid theme/)
  })
})
