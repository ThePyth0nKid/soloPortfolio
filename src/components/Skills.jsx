const SKILLS = [
  { name: 'React', icon: '⚛️', value: 95, hue: 190 },
  { name: 'TypeScript', icon: 'TS', value: 90, hue: 215 },
  { name: 'Node.js', icon: '⬢', value: 85, hue: 140 },
  { name: 'Python', icon: '🐍', value: 80, hue: 50 },
  { name: 'Postgres', icon: '🐘', value: 75, hue: 200 },
  { name: 'Tailwind', icon: '🌬', value: 92, hue: 175 },
  { name: 'AI / ML', icon: '✨', value: 70, hue: 280 },
  { name: 'Design', icon: '◆', value: 78, hue: 320 },
]

export default function Skills() {
  return (
    <section id="skills" className="py-24 px-6 bg-slate-900/30">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="space-y-2">
          <h2 className="text-4xl font-bold skills-title">Skills</h2>
          <p className="text-slate-400 skills-subtitle">Tools I reach for when the stakes are real.</p>
        </div>

        <ul className="grid md:grid-cols-2 gap-x-10 gap-y-6">
          {SKILLS.map((skill, i) => (
            <li
              key={skill.name}
              className="skill-row group"
              style={{
                '--i': i,
                '--value': skill.value,
                '--hue': skill.hue,
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span
                    className="skill-icon inline-flex items-center justify-center w-8 h-8 rounded-md text-sm font-semibold border"
                    aria-hidden="true"
                  >
                    {skill.icon}
                  </span>
                  <span className="font-medium text-slate-200">{skill.name}</span>
                </div>
                <span
                  className="skill-value tabular-nums text-xs text-slate-400"
                  aria-label={`${skill.value} percent`}
                >
                  <span className="skill-value-num">{skill.value}</span>%
                </span>
              </div>
              <div
                className="skill-track relative h-2 rounded-full bg-slate-800/80 overflow-hidden"
                role="progressbar"
                aria-valuenow={skill.value}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={skill.name}
              >
                <span className="skill-fill absolute inset-y-0 left-0 rounded-full" />
                <span className="skill-shine absolute inset-y-0 left-0 rounded-full" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
