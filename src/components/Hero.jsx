import { useEffect, useState } from 'react'
import { getCurrentGreeting } from '../utils/greeting'

/**
 * Milliseconds between greeting re-evaluations. One minute is plenty —
 * the greeting only changes at hour boundaries, and a 60s resolution
 * avoids any risk of the user sitting on the page across noon/5pm/etc.
 * without the UI updating.
 */
const GREETING_REFRESH_MS = 60_000

/**
 * Hero section. Shows a time-of-day greeting derived from the visitor's
 * local clock (no backend, no timezone guessing — `new Date()` already
 * reflects the user's locale).
 */
export default function Hero() {
  const [greeting, setGreeting] = useState(() => getCurrentGreeting())

  useEffect(() => {
    // Re-check on mount in case the cached initial value is stale
    // (e.g. tab restored from bfcache after an hour boundary).
    setGreeting(getCurrentGreeting())

    const intervalId = window.setInterval(() => {
      setGreeting(getCurrentGreeting())
    }, GREETING_REFRESH_MS)

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
          data-testid="hero-greeting"
        >
          <span aria-hidden="true" className="mr-2">
            {greeting.emoji}
          </span>
          {greeting.phrase}
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
