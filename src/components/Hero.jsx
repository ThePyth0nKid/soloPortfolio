export default function Hero() {
  const hour = new Date().getHours()
  const greeting =
    hour < 5 ? 'Still up?' :
    hour < 12 ? 'Good morning' :
    hour < 18 ? 'Good afternoon' :
    hour < 22 ? 'Good evening' :
    'Burning the midnight oil'

  const icon =
    hour < 5 ? '\u{1F319}' :
    hour < 12 ? '\u2600\uFE0F' :
    hour < 18 ? '\u{1F324}\uFE0F' :
    hour < 22 ? '\u{1F307}' :
    '\u{1F319}'

  // Time-of-day bucket drives a custom property; all theming is derived in CSS
  // via color-mix() — no per-bucket class soup.
  const bucket =
    hour < 5 ? 'night' :
    hour < 12 ? 'morning' :
    hour < 18 ? 'afternoon' :
    hour < 22 ? 'evening' : 'night'

  return (
    <section
      className="hero"
      data-tod={bucket}
      style={{ minBlockSize: '100vh' }}
    >
      <div className="hero__inner">
        <p className="hero__greeting" aria-label={`${greeting}, visitor`}>
          <span aria-hidden="true" className="hero__greeting-icon">{icon}</span>
          <span>{greeting}</span>
          <span className="hero__greeting-dot" aria-hidden="true" />
        </p>

        <div className="hero__badge">
          ✨ Available for new projects
        </div>

        <h1 className="hero__title">
          Hi, I'm{' '}
          <span className="hero__name">Alex</span>
        </h1>

        <p className="hero__lede">
          Solo founder building tools that don't suck. Currently obsessed with
          AI agents, developer experience, and minimal design.
        </p>

        <div className="hero__cta">
          <a href="#projects" className="btn btn--primary">See my work</a>
          <a href="#about" className="btn btn--ghost">About me</a>
        </div>
      </div>
    </section>
  )
}
