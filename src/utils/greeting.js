/**
 * Hour boundaries (24-hour clock) used to pick a greeting.
 * Morning:   [MORNING_START_HOUR, AFTERNOON_START_HOUR)
 * Afternoon: [AFTERNOON_START_HOUR, EVENING_START_HOUR)
 * Evening:   [EVENING_START_HOUR, NIGHT_START_HOUR)
 * Night:     [NIGHT_START_HOUR, 24) ∪ [0, MORNING_START_HOUR)
 */
export const MORNING_START_HOUR = 5
export const AFTERNOON_START_HOUR = 12
export const EVENING_START_HOUR = 17
export const NIGHT_START_HOUR = 22

export const GREETINGS = Object.freeze({
  morning: 'Good morning',
  afternoon: 'Good afternoon',
  evening: 'Good evening',
  night: 'Good evening', // Keep the hero copy friendly late at night.
})

/**
 * Returns the time-of-day bucket for a given hour (0–23).
 *
 * @param {number} hour - Hour of the day in 24-hour format (0–23).
 * @returns {'morning' | 'afternoon' | 'evening' | 'night'}
 * @throws {RangeError} If `hour` is not an integer in [0, 23].
 */
export function getTimeOfDay(hour) {
  if (!Number.isInteger(hour) || hour < 0 || hour > 23) {
    throw new RangeError(
      `getTimeOfDay: hour must be an integer in [0, 23], received: ${hour}`,
    )
  }

  if (hour >= MORNING_START_HOUR && hour < AFTERNOON_START_HOUR) return 'morning'
  if (hour >= AFTERNOON_START_HOUR && hour < EVENING_START_HOUR) return 'afternoon'
  if (hour >= EVENING_START_HOUR && hour < NIGHT_START_HOUR) return 'evening'
  return 'night'
}

/**
 * Returns a localized greeting string based on a `Date` instance.
 * Defaults to the current local time.
 *
 * @param {Date} [now=new Date()] - The reference moment; uses local hours.
 * @returns {string} e.g. "Good morning".
 * @throws {TypeError} If `now` is not a valid Date.
 */
export function getGreeting(now = new Date()) {
  if (!(now instanceof Date) || Number.isNaN(now.getTime())) {
    throw new TypeError('getGreeting: `now` must be a valid Date instance')
  }
  return GREETINGS[getTimeOfDay(now.getHours())]
}
