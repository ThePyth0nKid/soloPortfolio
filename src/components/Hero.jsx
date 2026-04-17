import { useEffect, useState } from 'react'

/**
 * Returns a greeting tailored to the viewer's local time of day.
 * Buckets chosen for natural human cadence (not strict 6/12/18 splits):
 *   - 05:00–11:59 → morning
 *   - 12:00–17:59 → afternoon
 *   - 18:00–21:59 → evening
 *   - 22:00–04:59 → night (the night-owl case — a nice touch for devs)
 */
function getGreeting(date = new Date()) {
  const h = date.getHours()
  if (h >= 5 && h < 12) {
    return { text: 'Good morning', emoji: '☀️', label: 'morning' }
  }
  if (h >= 12 && h < 18) {
    return { text: 'Good afternoon', emoji: '🌤️', label: 'afternoon' }
  }
  if (h >= 18 && h < 22) {
    return { text: 'Good evening', emoji: '🌆', label: 'evening' }
  }
  return { text: 'Burning the midnight oil', emoji: '🌙', label: 'night' }
}

export default function Hero() {
  // Start with a sensible default so SSR / first paint isn't empty.
  // Then hydrate on mount with the user's actual local time.
  const [greeting, setGreeting] = useState(() => getGreeting())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setGreeting(getGreeting())
    setMounted(true)

    // Re-check the greeting every minute so viewers who keep the page open
    // across a boundary (e.g. 11:59 → 12:00) see it update naturally.
    const interval = setInterval(() => {
      setGreeting((prev) => {
        const next = getGreeting()
        return next.label === prev.label ? prev : next
      })
    }, 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="max-w-3xl space-y-6">
        {/* Time-aware greeting — fades in once we know the user's local time */}
        <div
          key={greeting.label}
          aria-live="polite"
          className={`inline-flex items-center gap-2 px-4 py-1.5 bg-purple-500/10 border border-purple-500/30 rounded-full text-sm text-purple-300 transition-all duration-500 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'
          }`}
        >
          <span aria-hidden="true" className="text-base">
            {greeting.emoji}
          </span>
          <span>
            {greeting.text}
            <span className="text-purple-400/70"> — thanks for stopping by</span>
          </span>
        </div>

        <div className="inline-block px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded-full text-xs text-purple-400">
          ✨ Available for new projects
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
            className="px-6 py-3 bg-purple-600 hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400 rounded-lg font-medium transition-colors"
          >
            See my work
          </a>
          <a
            href="#about"
            className="px-6 py-3 border border-slate-700 hover:border-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400 rounded-lg font-medium transition-colors"
          >
            About me
          </a>
        </div>
      </div>
    </section>
  )
}
