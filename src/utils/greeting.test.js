/**
 * Lightweight tests for getGreeting. Runnable with: `node src/utils/greeting.test.js`.
 *
 * Kept dependency-free to avoid adding a test runner to the demo repo's
 * package.json. Exits with a non-zero code on failure.
 */
import assert from 'node:assert/strict'
import {
  AFTERNOON_START_HOUR,
  EVENING_START_HOUR,
  GREETINGS,
  MORNING_START_HOUR,
  NIGHT_START_HOUR,
  getGreeting,
} from './greeting.js'

/** Build a Date at a specific local hour (minute/second/ms zeroed). */
function dateAtHour(hour) {
  const d = new Date()
  d.setHours(hour, 0, 0, 0)
  return d
}

const cases = [
  { hour: MORNING_START_HOUR, expected: GREETINGS.MORNING, label: 'morning boundary (start)' },
  { hour: 9, expected: GREETINGS.MORNING, label: 'mid-morning' },
  { hour: AFTERNOON_START_HOUR - 1, expected: GREETINGS.MORNING, label: 'just before noon' },
  { hour: AFTERNOON_START_HOUR, expected: GREETINGS.AFTERNOON, label: 'afternoon boundary (start)' },
  { hour: 15, expected: GREETINGS.AFTERNOON, label: 'mid-afternoon' },
  { hour: EVENING_START_HOUR - 1, expected: GREETINGS.AFTERNOON, label: 'just before evening' },
  { hour: EVENING_START_HOUR, expected: GREETINGS.EVENING, label: 'evening boundary (start)' },
  { hour: 19, expected: GREETINGS.EVENING, label: 'mid-evening' },
  { hour: NIGHT_START_HOUR - 1, expected: GREETINGS.EVENING, label: 'just before night' },
  { hour: NIGHT_START_HOUR, expected: GREETINGS.NIGHT, label: 'night boundary (start)' },
  { hour: 23, expected: GREETINGS.NIGHT, label: 'late night' },
  { hour: 0, expected: GREETINGS.NIGHT, label: 'midnight' },
  { hour: MORNING_START_HOUR - 1, expected: GREETINGS.NIGHT, label: 'just before morning' },
]

let failed = 0
for (const { hour, expected, label } of cases) {
  try {
    assert.equal(getGreeting(dateAtHour(hour)), expected, `hour=${hour} (${label})`)
    console.log(`  ✓ ${label} (hour=${hour}) → "${expected}"`)
  } catch (err) {
    failed += 1
    console.error(`  ✗ ${label} (hour=${hour}): ${err.message}`)
  }
}

// Error cases
try {
  assert.throws(() => getGreeting('not a date'), TypeError)
  console.log('  ✓ throws TypeError on non-Date input')
} catch (err) {
  failed += 1
  console.error(`  ✗ non-Date input: ${err.message}`)
}

try {
  assert.throws(() => getGreeting(new Date('invalid')), TypeError)
  console.log('  ✓ throws TypeError on invalid Date')
} catch (err) {
  failed += 1
  console.error(`  ✗ invalid Date: ${err.message}`)
}

// Default argument
try {
  const result = getGreeting()
  assert.ok(Object.values(GREETINGS).includes(result), `default returned "${result}"`)
  console.log('  ✓ default argument returns a valid greeting')
} catch (err) {
  failed += 1
  console.error(`  ✗ default argument: ${err.message}`)
}

if (failed > 0) {
  console.error(`\n${failed} test(s) failed.`)
  process.exit(1)
}
console.log('\nAll greeting tests passed.')
