import { useEffect, useState } from 'react'
import { getGreeting } from '../utils/greeting.js'

/**
 * How often to re-check the current greeting. One minute is frequent enough
 * to catch boundary crossings (e.g. 4:59pm → 5:00pm) without being wasteful.
 */
const GREETING_REFRESH_INTERVAL_MS = 60_000

export default function Hero() {
  const [greeting, setGreeting] = useState(() => getGreeting())

  useEffect(() => {
    // Re-sync immediately on mount in case SSR/initial render drifted,
    // then poll on a fixed interval to cross time-of-day boundaries.
    setGreeting(getGreeting())

    const intervalId = window.setInterval(() => {
      setGreeting(getGreeting())
    }, GREETING_REFRESH_INTERVAL_MS)

    return () => window.clearInterval(intervalId)
  }, [])

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="max-w-3xl space-y-6">
        <div className="inline-block px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded-full text-xs text-purple-400">
          ✨ Available for new projects
        </div>
        <p
          className="text-sm uppercase tracking-[0.2em] text-slate-400"
          aria-live="polite"
        >
          {greeting}
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
