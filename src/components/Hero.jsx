import { useEffect, useState } from 'react'

function getGreeting(date = new Date()) {
  const hour = date.getHours()
  if (hour < 5) return { text: 'Good night', icon: '🌙' }
  if (hour < 12) return { text: 'Good morning', icon: '☀️' }
  if (hour < 18) return { text: 'Good afternoon', icon: '🌤' }
  if (hour < 22) return { text: 'Good evening', icon: '🌆' }
  return { text: 'Good night', icon: '🌙' }
}

export default function Hero() {
  const [greeting, setGreeting] = useState(() => getGreeting())

  useEffect(() => {
    // Re-evaluate on the next hour boundary so the greeting stays accurate
    // if the tab is left open across a time-of-day transition.
    const now = new Date()
    const msUntilNextHour =
      (60 - now.getMinutes()) * 60 * 1000 - now.getSeconds() * 1000

    let intervalId
    const timeoutId = setTimeout(() => {
      setGreeting(getGreeting())
      intervalId = setInterval(() => setGreeting(getGreeting()), 60 * 60 * 1000)
    }, msUntilNextHour)

    return () => {
      clearTimeout(timeoutId)
      if (intervalId) clearInterval(intervalId)
    }
  }, [])

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="max-w-3xl space-y-6">
        <div className="inline-block px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded-full text-xs text-purple-400">
          ✨ Available for new projects
        </div>
        <p
          className="text-base md:text-lg text-slate-300"
          aria-live="polite"
        >
          <span aria-hidden="true" className="mr-2">
            {greeting.icon}
          </span>
          {greeting.text} — thanks for stopping by.
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
