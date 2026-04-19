const SKILLS = [
  { name: 'React',      level: 95, icon: '⚛️' },
  { name: 'TypeScript', level: 90, icon: '🔷' },
  { name: 'Node.js',    level: 85, icon: '🟩' },
  { name: 'Python',     level: 80, icon: '🐍' },
  { name: 'Postgres',   level: 75, icon: '🐘' },
  { name: 'CSS',        level: 92, icon: '🎨' },
  { name: 'AI / ML',    level: 70, icon: '🧠' },
  { name: 'Figma',      level: 78, icon: '▱️' },
]

export default function Skills() {
  return (
    <section id="skills" className="skills">
      <div className="skills__inner">
        <h2 className="skills__title">Skills</h2>
        <p className="skills__lede">
          Bars fill as they enter the viewport — no JS, just scroll-driven CSS.
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
                className="skill__bar"
                role="progressbar"
                aria-label={s.name}
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow={s.level}
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
