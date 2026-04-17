import { useEffect, useState } from 'react'

// Allowlist of greetings — prevents any injection risk from locale/Date weirdness.
// Each value is a hardcoded string literal; we only ever render one of these.
const GREETINGS = Object.freeze({
  morning: 'Good morning',
  afternoon: 'Good afternoon',
  evening: 'Good evening',
  night: 'Good evening', // late-night users get "evening" — avoids "night" surprise
})

/**
 * Derive greeting key from an hour value.
 * Input is strictly validated: must be an integer in [0, 23].
 * Any invalid input falls back to a safe default ('morning') rather than throwing,
 * because this runs during render and a crash would take down the hero.
 */
function greetingKeyForHour(hour) {
  if (
    typeof hour !== 'number' ||
    !Number.isFinite(hour) ||
    !Number.isInteger(hour) ||
    hour < 0 ||
    hour > 23
  ) {
    return 'morning'
  }
  if (hour >= 5 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 17) return 'afternoon'
  if (hour >= 17 && hour < 22) return 'evening'
  return 'night'
}

/**
 * Safely read the current local hour.
 * Wrapped in try/catch because `new Date()` is host-provided and, while extremely
 * unlikely, a pathological environment (or a mocked global) could throw.
 */
function getLocalHourSafe() {
  try {
    const h = new Date().getHours()
    return Number.isInteger(h) ? h : null
  } catch {
    return null
  }
}

function useTimeBasedGreeting() {
  // SSR-safe: compute on client only. During first render we use a neutral default
  // so server-rendered markup (if ever added) matches, avoiding hydration mismatch.
  const [greeting, setGreeting] = useState(GREETINGS.morning)

  useEffect(() => {
    let cancelled = false

    const update = () => {
      if (cancelled) return
      const hour = getLocalHourSafe()
      const key = hour === null ? 'morning' : greetingKeyForHour(hour)
      // Only render from the allowlist — never interpolate raw time data.
      setGreeting(GREETINGS[key] ?? GREETINGS.morning)
    }

    update()

    // Re-check every 60s so a user who leaves the tab open across a boundary
    // (e.g. 11:59 → 12:00) sees the greeting update. Cheap, no network.
    const intervalId = setInterval(update, 60_000)

    return () => {
      cancelled = true
      clearInterval(intervalId)
    }
  }, [])

  return greeting
}

export default function Hero() {
  const greeting = useTimeBasedGreeting()

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="max-w-3xl space-y-6">
        <div className="inline-block px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded-full text-xs text-purple-400">
          ✨ Available for new projects
        </div>
        <p
          className="text-lg text-slate-400"
          // aria-live so screen readers announce if it flips across a boundary
          aria-live="polite"
        >
          {/* greeting is always one of a fixed allowlist of string literals */}
          {greeting}, friend 👋
        </p>
        <h1 className="text-6xl md:text-7xl font-bold tracking-tight">
          Hi, I'm{' '}
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Alex
          </span>
        </h1>
        <p className="text-xl text-slate-400 max-w-xl mx-auto">
          Solo founder building tools that don't suck. Currently obsessed with
          AI agents, developer experience, and minimal design.
        </p>
        <div className="flex gap-3 justify-center pt-4">
          <a
            href="#projects"
            className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-medium transition-colors"
          >
            See my work
          </a>
          <a
            href="#about"
            className="px-6 py-3 border border-slate-700 hover:border-slate-500 rounded-lg font-medium transition-colors"
          >
            About me
          </a>
        </div>
      </div>
    </section>
  )
}
