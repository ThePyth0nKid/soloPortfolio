import { useEffect, useState } from 'react'

/**
 * Returns a greeting + matching emoji based on the user's local hour.
 * Boundaries chosen to feel natural to humans:
 *   05:00–11:59 → morning
 *   12:00–17:59 → afternoon
 *   18:00–21:59 → evening
 *   22:00–04:59 → night (late-night visitors deserve acknowledgement too)
 */
function getGreeting(date = new Date()) {
  const hour = date.getHours()
  if (hour >= 5 && hour < 12) {
    return { text: 'Good morning', emoji: '☀️', label: 'morning' }
  }
  if (hour >= 12 && hour < 18) {
    return { text: 'Good afternoon', emoji: '🌤️', label: 'afternoon' }
  }
  if (hour >= 18 && hour < 22) {
    return { text: 'Good evening', emoji: '🌆', label: 'evening' }
  }
  return { text: 'Burning the midnight oil', emoji: '🌙', label: 'night' }
}

export default function Hero() {
  // Lazy initial state so the very first render already has the right greeting
  // (no flash of "wrong" copy, no layout shift).
  const [greeting, setGreeting] = useState(() => getGreeting())

  useEffect(() => {
    // Re-check the greeting when the user returns to the tab (e.g. left it
    // open overnight) and once per minute otherwise. Cheap, and keeps the
    // copy honest without being wasteful.
    const tick = () => setGreeting(getGreeting())
    const interval = setInterval(tick, 60 * 1000)
    const onVisible = () => {
      if (document.visibilityState === 'visible') tick()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [])

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="max-w-3xl space-y-6">
        {/* Time-aware greeting. key={} forces a gentle fade+rise when the
            greeting actually changes (e.g. 11:59 → 12:00). */}
        <div
          key={greeting.label}
          className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded-full text-xs text-purple-300 animate-[fadeInUp_400ms_ease-out]"
          aria-live="polite"
        >
          <span aria-hidden="true">{greeting.emoji}</span>
          <span>
            {greeting.text}
            <span className="text-purple-400/70">— welcome</span>
          </span>
        </div>
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
            className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            See my work
          </a>
          <a
            href="#about"
            className="px-6 py-3 border border-slate-700 hover:border-slate-500 rounded-lg font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            About me
          </a>
        </div>
      </div>
    </section>
  )
}
