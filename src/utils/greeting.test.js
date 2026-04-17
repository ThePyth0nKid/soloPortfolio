/**
 * Lightweight assertion-based tests for greeting utilities.
 *
 * Run with: `node src/utils/greeting.test.js`
 *
 * We deliberately avoid adding a test runner dependency to keep the
 * demo repo's install footprint small; Node's built-in `assert` is enough.
 */
import assert from 'node:assert/strict'
import {
  getGreeting,
  getTimeOfDay,
  GREETINGS,
  MORNING_START_HOUR,
  AFTERNOON_START_HOUR,
  EVENING_START_HOUR,
  NIGHT_START_HOUR,
} from './greeting.js'

const ARBITRARY_YEAR = 2026
const ARBITRARY_MONTH_INDEX = 0 // January
const ARBITRARY_DAY = 15

/** Build a Date at a specific local hour, keeping other fields fixed. */
function dateAtHour(hour) {
  return new Date(ARBITRARY_YEAR, ARBITRARY_MONTH_INDEX, ARBITRARY_DAY, hour, 0, 0, 0)
}

// --- getTimeOfDay: boundary cases ---
assert.equal(getTimeOfDay(MORNING_START_HOUR), 'morning', '5am is morning')
assert.equal(getTimeOfDay(AFTERNOON_START_HOUR - 1), 'morning', '11am is morning')
assert.equal(getTimeOfDay(AFTERNOON_START_HOUR), 'afternoon', '12pm is afternoon')
assert.equal(getTimeOfDay(EVENING_START_HOUR - 1), 'afternoon', '4pm is afternoon')
assert.equal(getTimeOfDay(EVENING_START_HOUR), 'evening', '5pm is evening')
assert.equal(getTimeOfDay(NIGHT_START_HOUR - 1), 'evening', '9pm is evening')
assert.equal(getTimeOfDay(NIGHT_START_HOUR), 'night', '10pm is night')
assert.equal(getTimeOfDay(0), 'night', 'midnight is night')
assert.equal(getTimeOfDay(MORNING_START_HOUR - 1), 'night', '4am is night')

// --- getTimeOfDay: invalid inputs ---
assert.throws(() => getTimeOfDay(-1), RangeError)
assert.throws(() => getTimeOfDay(24), RangeError)
assert.throws(() => getTimeOfDay(3.5), RangeError)
assert.throws(() => getTimeOfDay('9'), RangeError)

// --- getGreeting ---
assert.equal(getGreeting(dateAtHour(9)), GREETINGS.morning)
assert.equal(getGreeting(dateAtHour(13)), GREETINGS.afternoon)
assert.equal(getGreeting(dateAtHour(19)), GREETINGS.evening)
assert.equal(getGreeting(dateAtHour(23)), GREETINGS.night)

assert.throws(() => getGreeting('not a date'), TypeError)
assert.throws(() => getGreeting(new Date('invalid')), TypeError)

// Default arg path: just make sure it returns one of the known strings.
const known = new Set(Object.values(GREETINGS))
assert.ok(known.has(getGreeting()), 'default getGreeting() returns a known greeting')

console.log('✓ greeting utility tests passed')
