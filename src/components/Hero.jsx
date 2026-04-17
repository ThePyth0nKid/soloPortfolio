export default function Hero() {
  // The platform knows what time it is. No state, no effect, no re-render loop needed —
  // this mounts once and the greeting is correct for the user's local clock.
  const hour = new Date().getHours()
  const greeting =
    hour < 5 ? 'Burning the midnight oil' :
    hour < 12 ? 'Good morning' :
    hour < 18 ? 'Good afternoon' :
    'Good evening'

  // Map time-of-day to a hue in oklch so the accent shifts with the sun.
  // Morning = warm amber, afternoon = purple (brand), evening = deep magenta, night = cool indigo.
  const hue =
    hour < 5 ? 270 :
    hour < 12 ? 70 :
    hour < 18 ? 310 :
    330

  return (
    <section
      className="hero"
      style={{ '--tod-hue': hue }}
    >
      <div className="max-w-3xl space-y-6">
        <div className="greeting-pill">
          <span className="greeting-dot" aria-hidden="true" />
          {greeting}, friend
        </div>
        <h1 className="text-6xl md:text-7xl font-bold tracking-tight">
          Hi, I'm{' '}
          <span className="name-gradient">Alex</span>
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
