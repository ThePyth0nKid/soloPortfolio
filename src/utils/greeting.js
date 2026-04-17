/**
 * Time-of-day greeting utility.
 *
 * Pure functions — no side effects, no Date.now() hidden inside.
 * The caller passes in the hour, which makes this trivial to unit-test
 * and safe to use in SSR / deterministic environments.
 */

/** Inclusive lower bound (24h) for the "morning" greeting. */
export const MORNING_START_HOUR = 5
/** Exclusive upper bound (24h) for the "morning" greeting. */
export const MORNING_END_HOUR = 12

/** Inclusive lower bound (24h) for the "afternoon" greeting. */
export const AFTERNOON_START_HOUR = 12
/** Exclusive upper bound (24h) for the "afternoon" greeting. */
export const AFTERNOON_END_HOUR = 17

/** Inclusive lower bound (24h) for the "evening" greeting. */
export const EVENING_START_HOUR = 17
/** Exclusive upper bound (24h) for the "evening" greeting. */
export const EVENING_END_HOUR = 22

/** Minimum valid hour value (inclusive). */
const MIN_HOUR = 0
/** Maximum valid hour value (inclusive). */
const MAX_HOUR = 23

/**
 * Greeting variants returned by {@link getGreetingForHour}.
 * @typedef {'morning' | 'afternoon' | 'evening' | 'night'} GreetingPeriod
 */

/**
 * Classify an hour-of-day into a greeting period.
 *
 * Ranges (24h clock):
 *  - morning:   [05:00, 12:00)
 *  - afternoon: [12:00, 17:00)
 *  - evening:   [17:00, 22:00)
 *  - night:     [22:00, 05:00)  (wraps midnight)
 *
 * @param {number} hour - Integer hour in [0, 23].
 * @returns {GreetingPeriod}
 * @throws {RangeError} If `hour` is not an integer in [0, 23].
 */
export function getGreetingPeriod(hour) {
  if (!Number.isInteger(hour) || hour < MIN_HOUR || hour > MAX_HOUR) {
    throw new RangeError(
      `getGreetingPeriod: hour must be an integer in [${MIN_HOUR}, ${MAX_HOUR}], got ${hour}`,
    )
  }

  if (hour >= MORNING_START_HOUR && hour < MORNING_END_HOUR) return 'morning'
  if (hour >= AFTERNOON_START_HOUR && hour < AFTERNOON_END_HOUR) return 'afternoon'
  if (hour >= EVENING_START_HOUR && hour < EVENING_END_HOUR) return 'evening'
  return 'night'
}

/**
 * Map a greeting period to its display phrase.
 *
 * @param {GreetingPeriod} period
 * @returns {string}
 */
export function getGreetingPhrase(period) {
  switch (period) {
    case 'morning':
      return 'Good morning'
    case 'afternoon':
      return 'Good afternoon'
    case 'evening':
      return 'Good evening'
    case 'night':
      return 'Hello, night owl'
    default: {
      // Exhaustiveness guard — throws if a new period is added without handling.
      throw new Error(`getGreetingPhrase: unknown period "${period}"`)
    }
  }
}

/**
 * Emoji paired with each greeting period. Purely decorative.
 * @param {GreetingPeriod} period
 * @returns {string}
 */
export function getGreetingEmoji(period) {
  switch (period) {
    case 'morning':
      return '☀️'
    case 'afternoon':
      return '👋'
    case 'evening':
      return '🌆'
    case 'night':
      return '🌙'
    default:
      throw new Error(`getGreetingEmoji: unknown period "${period}"`)
  }
}

/**
 * Convenience: derive the current greeting from a `Date`.
 *
 * Defaults to `new Date()` so the caller can just invoke `getCurrentGreeting()`,
 * but injecting a date makes this testable and deterministic.
 *
 * @param {Date} [now=new Date()]
 * @returns {{ period: GreetingPeriod, phrase: string, emoji: string }}
 * @throws {TypeError} If `now` is not a valid Date.
 */
export function getCurrentGreeting(now = new Date()) {
  if (!(now instanceof Date) || Number.isNaN(now.getTime())) {
    throw new TypeError('getCurrentGreeting: `now` must be a valid Date')
  }
  const period = getGreetingPeriod(now.getHours())
  return {
    period,
    phrase: getGreetingPhrase(period),
    emoji: getGreetingEmoji(period),
  }
}
