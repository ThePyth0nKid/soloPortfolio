import { useEffect, useRef, useState } from 'react'

const SKILLS = [
  { name: 'React', icon: '⚛️', value: 95 },
  { name: 'TypeScript', icon: '🔷', value: 90 },
  { name: 'Node.js', icon: '🟢', value: 88 },
  { name: 'Python', icon: '🐍', value: 82 },
  { name: 'Postgres', icon: '🐘', value: 78 },
  { name: 'Tailwind', icon: '🎨', value: 92 },
  { name: 'AI/ML', icon: '🤖', value: 75 },
  { name: 'Docker', icon: '🐳', value: 70 },
]

export default function Skills() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
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
    <section id="skills" ref={ref} className="py-24 px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        <h2 className="text-4xl font-bold">Skills</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {SKILLS.map((s) => (
            <div key={s.name} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span className="text-lg">{s.icon}</span>
                  <span className="font-medium text-slate-200">{s.name}</span>
                </span>
                <span className="text-slate-400">{s.value}%</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-[1500ms] ease-out"
                  style={{ width: visible ? `${s.value}%` : '0%' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
