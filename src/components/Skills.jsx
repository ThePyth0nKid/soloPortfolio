import { useEffect, useRef, useState } from 'react'

const SKILLS = [
  { name: 'React', icon: '⚛️', level: 95, color: 'from-cyan-400 to-blue-500' },
  { name: 'TypeScript', icon: '🔷', level: 90, color: 'from-blue-400 to-indigo-500' },
  { name: 'Node.js', icon: '🟢', level: 88, color: 'from-green-400 to-emerald-500' },
  { name: 'Python', icon: '🐍', level: 85, color: 'from-yellow-400 to-amber-500' },
  { name: 'Postgres', icon: '🐘', level: 80, color: 'from-sky-400 to-blue-600' },
  { name: 'AI / ML', icon: '🤖', level: 75, color: 'from-purple-400 to-pink-500' },
  { name: 'Tailwind CSS', icon: '🎨', level: 92, color: 'from-teal-400 to-cyan-500' },
  { name: 'Design', icon: '✏️', level: 70, color: 'from-pink-400 to-rose-500' },
]

export default function Skills() {
  const sectionRef = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="skills" ref={sectionRef} className="py-24 px-6">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="space-y-3">
          <h2 className="text-4xl font-bold">Skills</h2>
          <p className="text-slate-400">
            The tools I reach for when building things that need to ship.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-x-10 gap-y-6">
          {SKILLS.map((skill, i) => (
            <div key={skill.name} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-lg" aria-hidden="true">{skill.icon}</span>
                  <span className="font-medium text-slate-200">{skill.name}</span>
                </div>
                <span className="text-slate-400 tabular-nums">{skill.level}%</span>
              </div>
              <div
                className="h-2 w-full bg-slate-800 rounded-full overflow-hidden"
                role="progressbar"
                aria-valuenow={skill.level}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${skill.name} proficiency`}
              >
                <div
                  className={`h-full bg-gradient-to-r ${skill.color} rounded-full`}
                  style={{
                    width: visible ? `${skill.level}%` : '0%',
                    transition: `width 1200ms cubic-bezier(0.22, 1, 0.36, 1) ${i * 100}ms`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
