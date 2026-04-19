import { useEffect, useRef, useState } from 'react'

const SKILLS = [
  { name: 'React', icon: '⚛️', value: 95 },
  { name: 'TypeScript', icon: '▢', value: 90 },
  { name: 'Node.js', icon: '⚙️', value: 85 },
  { name: 'Python', icon: '🐍', value: 80 },
  { name: 'Postgres', icon: '🗄️', value: 75 },
  { name: 'AI/ML', icon: '🧠', value: 70 },
  { name: 'Design Systems', icon: '🎨', value: 82 },
  { name: 'DevOps', icon: '📦', value: 65 },
]

export default function Skills() {
  const sectionRef = useRef(null)
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAnimate(true)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.2 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="skills" ref={sectionRef} className="py-24 px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        <h2 className="text-4xl font-bold">Skills</h2>
        <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
          {SKILLS.map((skill, i) => (
            <li key={skill.name} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-slate-200">
                  <span aria-hidden="true" className="text-base">{skill.icon}</span>
                  <span className="font-medium">{skill.name}</span>
                </div>
                <span className="text-xs text-slate-500 tabular-nums">{skill.value}%</span>
              </div>
              <div
                className="h-2 bg-slate-800 border border-slate-700 rounded-full overflow-hidden"
                role="progressbar"
                aria-valuenow={skill.value}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={skill.name}
              >
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-400 rounded-full transition-[width] duration-1000 ease-out"
                  style={{
                    width: animate ? `${skill.value}%` : '0%',
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
