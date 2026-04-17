import { useEffect, useState } from 'react'

function getGreeting(date = new Date()) {
  const h = date.getHours()
  if (h < 5) return { text: 'Still up', icon: '🌙', hue: 'from-indigo-400 to-purple-400' }
  if (h < 12) return { text: 'Good morning', icon: '☀️', hue: 'from-amber-300 to-orange-400' }
  if (h < 17) return { text: 'Good afternoon', icon: '🌤️', hue: 'from-sky-300 to-cyan-400' }
  if (h < 21) return { text: 'Good evening', icon: '🌆', hue: 'from-orange-400 to-pink-500' }
  return { text: 'Good night', icon: '🌙', hue: 'from-indigo-400 to-purple-400' }
}

export default function Hero() {
  const [greeting, setGreeting] = useState(() => getGreeting())

  useEffect(() => {
    // Re-evaluate greeting every minute so it flips at hour boundaries
    // without a full-page reload.
    const id = setInterval(() => {
      const next = getGreeting()
      setGreeting((prev) => (prev.text === next.text ? prev : next))
    }, 60_000)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="max-w-3xl space-y-6">
        <div
          key={greeting.text}
          className={`greeting-pill inline-flex items-center gap-2 px-3 py-1 bg-slate-900/60 border border-slate-700/60 rounded-full text-xs text-slate-300 backdrop-blur`}
          aria-live="polite"
        >
          <span className="greeting-icon" aria-hidden="true">{greeting.icon}</span>
          <span className={`bg-gradient-to-r ${greeting.hue} bg-clip-text text-transparent font-medium`}>
            {greeting.text}
          </span>
          <span className="text-slate-500">— welcome</span>
        </div>

        <div className="inline-block px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded-full text-xs text-purple-400 ml-0 md:ml-2">
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
            className="cta cta-primary px-6 py-3 bg-purple-600 rounded-lg font-medium"
          >
            See my work
          </a>
          <a
            href="#about"
            className="cta cta-ghost px-6 py-3 border border-slate-700 rounded-lg font-medium"
          >
            About me
          </a>
        </div>
      </div>
    </section>
  )
}
