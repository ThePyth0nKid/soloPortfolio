/**
 * Time-of-day boundaries (in hours, 24h format, local time).
 *
 * The ranges are:
 *   - Morning:   [MORNING_START_HOUR, AFTERNOON_START_HOUR)   e.g. 05:00 - 11:59
 *   - Afternoon: [AFTERNOON_START_HOUR, EVENING_START_HOUR)   e.g. 12:00 - 16:59
 *   - Evening:   [EVENING_START_HOUR,  NIGHT_START_HOUR)     e.g. 17:00 - 20:59
 *   - Night:     [NIGHT_START_HOUR,    MORNING_START_HOUR)   e.g. 21:00 - 04:59
 */
export const MORNING_START_HOUR = 5
export const AFTERNOON_START_HOUR = 12
export const EVENING_START_HOUR = 17
export const NIGHT_START_HOUR = 21

export const GREETINGS = Object.freeze({
  MORNING: 'Good morning',
  AFTERNOON: 'Good afternoon',
  EVENING: 'Good evening',
  NIGHT: 'Good evening', // Late night users still get "evening" — feels friendlier than "night".
})

/**
 * Returns a time-of-day-appropriate greeting based on the given Date's local hour.
 *
 * @param {Date} [date=new Date()] - The reference date. Defaults to now.
 * @returns {string} One of the greetings defined in {@link GREETINGS}.
 * @throws {TypeError} If `date` is not a valid Date instance.
 */
export function getGreeting(date = new Date()) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    throw new TypeError('getGreeting: `date` must be a valid Date instance')
  }

  const hour = date.getHours()

  if (hour >= MORNING_START_HOUR && hour < AFTERNOON_START_HOUR) {
    return GREETINGS.MORNING
  }
  if (hour >= AFTERNOON_START_HOUR && hour < EVENING_START_HOUR) {
    return GREETINGS.AFTERNOON
  }
  if (hour >= EVENING_START_HOUR && hour < NIGHT_START_HOUR) {
    return GREETINGS.EVENING
  }
  return GREETINGS.NIGHT
}
