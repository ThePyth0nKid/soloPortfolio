import { useEffect, useState } from 'react'

/**
 * Returns a greeting object based on the user's local time.
 * We split the day into four buckets so it feels natural at any hour.
 *
 * 5:00–11:59  → morning
 * 12:00–16:59 → afternoon
 * 17:00–20:59 → evening
 * 21:00–4:59  → night (late-night visitors deserve a nod too)
 */
function getGreeting(date = new Date()) {
  const hour = date.getHours()

  if (hour >= 5 && hour < 12) {
    return {
      text: 'Good morning',
      icon: '☀️',
      label: 'morning',
      // Warm sunrise gradient
      gradient: 'from-amber-300 to-orange-400',
      glow: 'bg-amber-400/10 border-amber-400/30 text-amber-300',
    }
  }
  if (hour >= 12 && hour < 17) {
    return {
      text: 'Good afternoon',
      icon: '🌤️',
      label: 'afternoon',
      gradient: 'from-sky-300 to-cyan-400',
      glow: 'bg-sky-400/10 border-sky-400/30 text-sky-300',
    }
  }
  if (hour >= 17 && hour < 21) {
    return {
      text: 'Good evening',
      icon: '🌆',
      label: 'evening',
      gradient: 'from-orange-400 to-pink-500',
      glow: 'bg-pink-400/10 border-pink-400/30 text-pink-300',
    }
  }
  return {
    text: 'Good night',
    icon: '🌙',
    label: 'night',
    gradient: 'from-indigo-300 to-purple-400',
    glow: 'bg-indigo-400/10 border-indigo-400/30 text-indigo-300',
  }
}

export default function Hero() {
  const [greeting, setGreeting] = useState(() => getGreeting())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Trigger fade-in on mount
    setMounted(true)

    // Keep the greeting fresh if the user leaves the tab open across a boundary.
    // Re-check every minute — cheap, and avoids stale "Good morning" at 1pm.
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
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 border rounded-full text-xs transition-all duration-700 ease-out ${greeting.glow} ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
          }`}
          role="status"
          aria-live="polite"
        >
          <span aria-hidden="true">{greeting.icon}</span>
          <span>
            {greeting.text} — welcome
          </span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
          <span
            key={greeting.label}
            className={`block bg-gradient-to-r ${greeting.gradient} bg-clip-text text-transparent transition-colors duration-700 animate-[fadeIn_0.6s_ease-out]`}
          >
            {greeting.text},
          </span>
          <span className="block mt-2">
            I'm{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Alex
            </span>
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
            className="px-6 py-3 border border-slate-700 hover:border-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 rounded-lg font-medium transition-colors"
          >
            About me
          </a>
        </div>
      </div>
    </section>
  )
}
