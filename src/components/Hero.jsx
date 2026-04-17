import { useEffect, useState } from 'react'

function getGreeting(date = new Date()) {
  const h = date.getHours()
  if (h < 5) return { text: 'Still up', icon: '\u{1F319}', hue: 'from-indigo-400 to-violet-400', key: 'night' }
  if (h < 12) return { text: 'Good morning', icon: '\u{2600}\u{FE0F}', hue: 'from-amber-300 to-orange-400', key: 'morning' }
  if (h < 17) return { text: 'Good afternoon', icon: '\u{1F324}\u{FE0F}', hue: 'from-sky-300 to-cyan-400', key: 'afternoon' }
  if (h < 21) return { text: 'Good evening', icon: '\u{1F305}', hue: 'from-fuchsia-400 to-rose-400', key: 'evening' }
  return { text: 'Good night', icon: '\u{1F319}', hue: 'from-indigo-400 to-violet-400', key: 'night' }
}

export default function Hero() {
  const [greeting, setGreeting] = useState(() => getGreeting())

  useEffect(() => {
    // Re-check on mount (avoids SSR/hydration skew) and every minute after.
    setGreeting(getGreeting())
    const id = setInterval(() => setGreeting(getGreeting()), 60_000)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="max-w-3xl space-y-6">
        <div
          key={greeting.key}
          className="greeting-chip inline-flex items-center gap-2 px-4 py-1.5 bg-slate-900/60 border border-slate-800 rounded-full text-sm text-slate-300 backdrop-blur"
        >
          <span className="greeting-icon text-base" aria-hidden="true">
            {greeting.icon}
          </span>
          <span>
            <span className={`bg-gradient-to-r ${greeting.hue} bg-clip-text text-transparent font-medium`}>
              {greeting.text}
            </span>
            <span className="text-slate-400">, friend</span>
          </span>
        </div>

        <div className="inline-block px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded-full text-xs text-purple-400 hero-item" style={{ animationDelay: '80ms' }}>
          ✨ Available for new projects
        </div>
        <h1 className="text-6xl md:text-7xl font-bold tracking-tight hero-item" style={{ animationDelay: '160ms' }}>
          Hi, I'm{' '}
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Alex
          </span>
        </h1>
        <p className="text-xl text-slate-400 max-w-xl mx-auto hero-item" style={{ animationDelay: '240ms' }}>
          Solo founder building tools that don't suck. Currently obsessed with
          AI agents, developer experience, and minimal design.
        </p>
        <div className="flex gap-3 justify-center pt-4 hero-item" style={{ animationDelay: '320ms' }}>
          <a
            href="#projects"
            className="btn-primary px-6 py-3 bg-purple-600 rounded-lg font-medium"
          >
            See my work
          </a>
          <a
            href="#about"
            className="btn-ghost px-6 py-3 border border-slate-700 rounded-lg font-medium"
          >
            About me
          </a>
        </div>
      </div>
    </section>
  )
}
