import { useEffect, useState } from 'react'

function getGreeting(date = new Date()) {
  const hour = date.getHours()
  if (hour >= 5 && hour < 12) {
    return { text: 'Good morning', icon: '☀️', iconLabel: 'sun' }
  }
  if (hour >= 12 && hour < 18) {
    return { text: 'Good afternoon', icon: '🌤️', iconLabel: 'sun behind cloud' }
  }
  if (hour >= 18 && hour < 22) {
    return { text: 'Good evening', icon: '🌆', iconLabel: 'sunset' }
  }
  return { text: 'Good night', icon: '🌙', iconLabel: 'crescent moon' }
}

export default function Hero() {
  const [greeting, setGreeting] = useState(() => getGreeting())

  useEffect(() => {
    // Re-evaluate on mount (covers SSR/hydration drift) and then every minute
    // so the greeting stays correct if a user leaves the tab open across a
    // boundary (e.g. noon, 6pm).
    setGreeting(getGreeting())
    const interval = setInterval(() => {
      setGreeting(getGreeting())
    }, 60_000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section
      aria-labelledby="hero-heading"
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
    >
      <div className="max-w-3xl space-y-6">
        {/*
          The greeting is announced politely to assistive tech when it changes.
          The emoji is decorative (aria-hidden) and the greeting text itself
          carries the meaning, so screen readers never hear "sun emoji".
        */}
        <p
          className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded-full text-sm text-purple-200"
          role="status"
          aria-live="polite"
        >
          <span aria-hidden="true">{greeting.icon}</span>
          <span>
            {greeting.text}
            <span className="sr-only">,</span> welcome — available for new projects
          </span>
        </p>
        <h1
          id="hero-heading"
          className="text-6xl md:text-7xl font-bold tracking-tight"
        >
          Hi, I'm{' '}
          <span className="bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
            Alex
          </span>
        </h1>
        <p className="text-xl text-slate-300 max-w-xl mx-auto">
          Solo founder building tools that don't suck. Currently obsessed with
          AI agents, developer experience, and minimal design.
        </p>
        <div className="flex gap-3 justify-center pt-4 flex-wrap">
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
