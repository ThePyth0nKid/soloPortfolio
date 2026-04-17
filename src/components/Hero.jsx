import { useEffect, useState } from 'react'

function getGreeting(date = new Date()) {
  const hour = date.getHours()
  if (hour >= 5 && hour < 12) {
    return { text: 'Good morning', icon: '☀️', iconLabel: 'sun' }
  }
  if (hour >= 12 && hour < 18) {
    return { text: 'Good afternoon', icon: '🌤️', iconLabel: 'sun behind clouds' }
  }
  if (hour >= 18 && hour < 22) {
    return { text: 'Good evening', icon: '🌆', iconLabel: 'sunset' }
  }
  return { text: 'Good evening', icon: '🌙', iconLabel: 'crescent moon' }
}

export default function Hero() {
  // Start with null so server/first-paint markup is stable and the greeting
  // is announced as a single update after mount (avoids hydration mismatch
  // and premature SR announcements).
  const [greeting, setGreeting] = useState(null)

  useEffect(() => {
    setGreeting(getGreeting())

    // Re-check every minute so the greeting updates if the user leaves the
    // tab open across a boundary (e.g. noon, 6pm).
    const interval = setInterval(() => {
      setGreeting((prev) => {
        const next = getGreeting()
        if (!prev || prev.text !== next.text) return next
        return prev
      })
    }, 60_000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section
      aria-labelledby="hero-heading"
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
    >
      <div className="max-w-3xl space-y-6">
        <div className="inline-block px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded-full text-xs text-purple-300">
          <span aria-hidden="true">✨ </span>Available for new projects
        </div>

        {/*
          Live region: when the greeting resolves (or changes across a time
          boundary), screen readers announce it politely. aria-atomic ensures
          the full phrase is read, not just the diff.
        */}
        <p
          className="text-base md:text-lg text-slate-300 min-h-[1.75rem]"
          aria-live="polite"
          aria-atomic="true"
        >
          {greeting ? (
            <>
              <span aria-hidden="true" className="mr-2">
                {greeting.icon}
              </span>
              <span>{greeting.text}, friend — welcome.</span>
            </>
          ) : (
            // Non-empty placeholder keeps layout stable; hidden from AT so
            // nothing is announced before we know the time of day.
            <span aria-hidden="true" className="opacity-0">
              Welcome.
            </span>
          )}
        </p>

        <h1
          id="hero-heading"
          className="text-6xl md:text-7xl font-bold tracking-tight"
        >
          Hi, I'm{' '}
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Alex
          </span>
        </h1>
        <p className="text-xl text-slate-300 max-w-xl mx-auto">
          Solo founder building tools that don't suck. Currently obsessed with
          AI agents, developer experience, and minimal design.
        </p>
        <div className="flex gap-3 justify-center pt-4">
          <a
            href="#projects"
            className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            See my work
          </a>
          <a
            href="#about"
            className="px-6 py-3 border border-slate-600 hover:border-slate-400 rounded-lg font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            About me
          </a>
        </div>
      </div>
    </section>
  )
}
