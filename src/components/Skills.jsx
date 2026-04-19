const SKILLS = [
  { name: 'React',      value: 95, icon: '⚛️', hue: 200 },
  { name: 'TypeScript', value: 90, icon: '🔷', hue: 220 },
  { name: 'Node.js',    value: 85, icon: '🟢', hue: 140 },
  { name: 'Python',     value: 80, icon: '🐍', hue: 50  },
  { name: 'Postgres',   value: 75, icon: '🐘', hue: 210 },
  { name: 'CSS',        value: 92, icon: '🎨', hue: 300 },
  { name: 'AI / ML',    value: 70, icon: '🧠', hue: 280 },
  { name: 'Design',     value: 78, icon: '✏️', hue: 330 },
]

export default function Skills() {
  return (
    <section id="skills" className="skills-section">
      <div className="skills-inner">
        <h2>Skills</h2>
        <p className="skills-lede">
          Years in the trenches. The bars fill as they enter the viewport —
          driven entirely by <code>animation-timeline: view()</code>, no JS.
        </p>

        <ul className="skills-grid" role="list">
          {SKILLS.map((s) => (
            <li
              key={s.name}
              className="skill"
              style={{
                '--value': s.value,
                '--hue': s.hue,
              }}
            >
              <span className="skill-icon" aria-hidden="true">{s.icon}</span>
              <span className="skill-name">{s.name}</span>
              <span className="skill-value" aria-hidden="true">{s.value}%</span>
              <div
                className="skill-bar"
                role="progressbar"
                aria-valuenow={s.value}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${s.name} proficiency`}
              >
                <div className="skill-bar-fill" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
