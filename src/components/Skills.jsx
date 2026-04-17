import { useEffect, useRef, useState } from 'react'

const SKILLS = [
  { name: 'React', icon: '⚛️', level: 95 },
  { name: 'TypeScript', icon: '🔷', level: 90 },
  { name: 'Node.js', icon: '🟢', level: 85 },
  { name: 'Python', icon: '🐍', level: 80 },
  { name: 'Postgres', icon: '🐘', level: 75 },
  { name: 'Tailwind CSS', icon: '🎨', level: 92 },
  { name: 'AI / ML', icon: '🤖', level: 70 },
  { name: 'Design', icon: '✏️', level: 65 },
]

export default function Skills() {
  const sectionRef = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = sectionRef.current
    if (!node) return

    // Respect users who prefer no motion — just show the final state.
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      setVisible(true)
      return
    }

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.2 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="py-24 px-6"
      aria-labelledby="skills-heading"
    >
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-2">
          <h2 id="skills-heading" className="text-4xl font-bold">
            Skills
          </h2>
          <p className="text-slate-400">
            A rough sense of where I spend most of my time. Numbers are vibes, not benchmarks.
          </p>
        </div>

        <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
          {SKILLS.map((skill, i) => (
            <li key={skill.name} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-slate-200">
                  <span aria-hidden="true" className="text-lg leading-none">
                    {skill.icon}
                  </span>
                  <span className="font-medium">{skill.name}</span>
                </span>
                <span className="text-slate-500 tabular-nums">{skill.level}%</span>
              </div>
              <div
                className="h-2 bg-slate-800 border border-slate-800 rounded-full overflow-hidden"
                role="progressbar"
                aria-valuenow={skill.level}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${skill.name} proficiency`}
              >
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-400 rounded-full transform-gpu origin-left transition-transform duration-[1200ms] ease-out"
                  style={{
                    width: `${skill.level}%`,
                    transform: visible ? 'scaleX(1)' : 'scaleX(0)',
                    transitionDelay: `${i * 80}ms`,
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
