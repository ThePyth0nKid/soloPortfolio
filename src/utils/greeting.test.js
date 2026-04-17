/**
 * Unit tests for src/utils/greeting.js
 *
 * Framework-agnostic: uses Node's built-in `node:assert` and `node:test`
 * so the suite runs with `node --test` without adding a dev-dependency.
 */
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

import {
  getGreetingPeriod,
  getGreetingPhrase,
  getGreetingEmoji,
  getCurrentGreeting,
} from './greeting.js'

describe('getGreetingPeriod', () => {
  it('returns "morning" at boundary 05:00 and within range', () => {
    assert.equal(getGreetingPeriod(5), 'morning')
    assert.equal(getGreetingPeriod(8), 'morning')
    assert.equal(getGreetingPeriod(11), 'morning')
  })

  it('returns "afternoon" at boundary 12:00 and within range', () => {
    assert.equal(getGreetingPeriod(12), 'afternoon')
    assert.equal(getGreetingPeriod(15), 'afternoon')
    assert.equal(getGreetingPeriod(16), 'afternoon')
  })

  it('returns "evening" at boundary 17:00 and within range', () => {
    assert.equal(getGreetingPeriod(17), 'evening')
    assert.equal(getGreetingPeriod(20), 'evening')
    assert.equal(getGreetingPeriod(21), 'evening')
  })

  it('returns "night" for late-night and pre-dawn hours', () => {
    assert.equal(getGreetingPeriod(22), 'night')
    assert.equal(getGreetingPeriod(23), 'night')
    assert.equal(getGreetingPeriod(0), 'night')
    assert.equal(getGreetingPeriod(4), 'night')
  })

  it('throws RangeError on out-of-range or non-integer input', () => {
    assert.throws(() => getGreetingPeriod(-1), RangeError)
    assert.throws(() => getGreetingPeriod(24), RangeError)
    assert.throws(() => getGreetingPeriod(12.5), RangeError)
    assert.throws(() => getGreetingPeriod(Number.NaN), RangeError)
    assert.throws(() => getGreetingPeriod('8'), RangeError)
  })
})

describe('getGreetingPhrase', () => {
  it('maps every period to its phrase', () => {
    assert.equal(getGreetingPhrase('morning'), 'Good morning')
    assert.equal(getGreetingPhrase('afternoon'), 'Good afternoon')
    assert.equal(getGreetingPhrase('evening'), 'Good evening')
    assert.equal(getGreetingPhrase('night'), 'Hello, night owl')
  })

  it('throws on unknown period', () => {
    assert.throws(() => getGreetingPhrase('lunchtime'), /unknown period/)
  })
})

describe('getGreetingEmoji', () => {
  it('returns a non-empty emoji for every period', () => {
    for (const period of ['morning', 'afternoon', 'evening', 'night']) {
      const emoji = getGreetingEmoji(period)
      assert.equal(typeof emoji, 'string')
      assert.ok(emoji.length > 0)
    }
  })

  it('throws on unknown period', () => {
    assert.throws(() => getGreetingEmoji('brunch'), /unknown period/)
  })
})

describe('getCurrentGreeting', () => {
  it('derives greeting from an injected Date', () => {
    const morning = new Date(2026, 0, 1, 9, 0, 0)
    const result = getCurrentGreeting(morning)
    assert.equal(result.period, 'morning')
    assert.equal(result.phrase, 'Good morning')
    assert.equal(typeof result.emoji, 'string')
  })

  it('works with no arguments (defaults to now)', () => {
    const result = getCurrentGreeting()
    assert.ok(['morning', 'afternoon', 'evening', 'night'].includes(result.period))
  })

  it('throws TypeError on invalid Date', () => {
    assert.throws(() => getCurrentGreeting(new Date('not-a-date')), TypeError)
    assert.throws(() => getCurrentGreeting('2026-01-01'), TypeError)
    assert.throws(() => getCurrentGreeting(null), TypeError)
  })
})
