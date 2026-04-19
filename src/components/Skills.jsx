const SKILLS = [
  { name: 'React',      level: 95, icon: '⚛️' },
  { name: 'TypeScript', level: 90, icon: '🔷' },
  { name: 'Node.js',    level: 85, icon: '🟢' },
  { name: 'CSS',        level: 98, icon: '🎨' },
  { name: 'Python',     level: 80, icon: '🐍' },
  { name: 'Postgres',   level: 75, icon: '🐘' },
  { name: 'AI / ML',    level: 70, icon: '🧠' },
  { name: 'Design',     level: 82, icon: '✨' },
]

export default function Skills() {
  return (
    <section id="skills" className="skills" aria-labelledby="skills-heading">
      <div className="skills__inner">
        <h2 id="skills-heading">Skills</h2>
        <p className="skills__lede">
          Animated entirely with scroll-driven animations &mdash; no IntersectionObserver, no JS state.
        </p>
        <ul className="skills__list" role="list">
          {SKILLS.map((s) => (
            <li key={s.name} className="skill" style={{ '--level': s.level }}>
              <div className="skill__head">
                <span className="skill__icon" aria-hidden="true">{s.icon}</span>
                <span className="skill__name">{s.name}</span>
                <span className="skill__value" aria-hidden="true">{s.level}%</span>
              </div>
              <div
                className="skill__track"
                role="progressbar"
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow={s.level}
                aria-label={s.name}
              >
                <div className="skill__fill" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
