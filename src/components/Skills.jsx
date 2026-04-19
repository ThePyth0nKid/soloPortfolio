import { useEffect, useRef, useState } from 'react'

const SKILLS = [
  { name: 'React', icon: '⚛️', value: 95 },
  { name: 'TypeScript', icon: '🆃', value: 90 },
  { name: 'Node.js', icon: '🟢', value: 85 },
  { name: 'Python', icon: '🐍', value: 80 },
  { name: 'Postgres', icon: '🐘', value: 75 },
  { name: 'Tailwind CSS', icon: '🎨', value: 90 },
  { name: 'AI/ML', icon: '🤖', value: 70 },
  { name: 'Design', icon: '✏️', value: 65 },
]

export default function Skills() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section id="skills" ref={ref} className="py-24 px-6 bg-slate-900/30">
      <div className="max-w-3xl mx-auto space-y-8">
        <h2 className="text-4xl font-bold">Skills</h2>
        <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-5">
          {SKILLS.map((s) => (
            <li key={s.name}>
              <div className="flex justify-between items-center mb-1.5 text-sm">
                <span className="flex items-center gap-2">
                  <span aria-hidden>{s.icon}</span>
                  <span className="text-slate-200">{s.name}</span>
                </span>
                <span className="text-slate-500 tabular-nums">{s.value}%</span>
              </div>
              <div
                role="progressbar"
                aria-valuenow={s.value}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={s.name}
                className="h-2 bg-slate-800 rounded-full overflow-hidden"
              >
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-[width] duration-[1200ms] ease-out"
                  style={{ width: visible ? `${s.value}%` : '0%' }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
