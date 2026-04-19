import { useEffect, useRef, useState } from 'react'

const SKILLS = [
  { name: 'React',       icon: '⚛️', value: 95, hue: 'from-cyan-400 to-sky-500' },
  { name: 'TypeScript',  icon: 'TS',  value: 90, hue: 'from-blue-400 to-indigo-500' },
  { name: 'Node.js',     icon: '⬢',  value: 85, hue: 'from-green-400 to-emerald-500' },
  { name: 'Python',      icon: '🐍', value: 80, hue: 'from-yellow-400 to-amber-500' },
  { name: 'Postgres',    icon: '🐘', value: 78, hue: 'from-sky-400 to-blue-500' },
  { name: 'CSS / Animation', icon: '✨', value: 92, hue: 'from-pink-400 to-fuchsia-500' },
  { name: 'AI / LLMs',   icon: '🧠', value: 70, hue: 'from-purple-400 to-violet-500' },
  { name: 'Design',      icon: '🎨', value: 75, hue: 'from-rose-400 to-pink-500' },
]

export default function Skills() {
  const sectionRef = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true)
            io.disconnect()
          }
        })
      },
      { threshold: 0.25 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section id="skills" ref={sectionRef} className="py-24 px-6 bg-slate-900/30">
      <div className="max-w-3xl mx-auto space-y-8">
        <h2 className="text-4xl font-bold skills-heading">Skills</h2>
        <p className="text-slate-400">A snapshot of the tools I reach for most often.</p>

        <ul className={`grid md:grid-cols-2 gap-x-10 gap-y-6 skills-list ${visible ? 'is-visible' : ''}`}>
          {SKILLS.map((s, i) => (
            <li
              key={s.name}
              className="skill-row"
              style={{ '--i': i, '--target': `${s.value}%` }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="skill-icon inline-flex items-center justify-center w-8 h-8 rounded-md bg-slate-800 border border-slate-700 text-sm font-semibold"
                  >
                    {s.icon}
                  </span>
                  <span className="text-sm font-medium text-slate-200">{s.name}</span>
                </div>
                <span
                  className="skill-value text-xs tabular-nums text-slate-400"
                  aria-label={`${s.value} percent proficiency`}
                >
                  {visible ? <CountUp to={s.value} delay={i * 90} /> : 0}%
                </span>
              </div>
              <div
                className="skill-track relative h-2 rounded-full bg-slate-800 overflow-hidden"
                role="progressbar"
                aria-valuenow={s.value}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={s.name}
              >
                <div className={`skill-fill absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${s.hue}`} />
                <div className="skill-shine absolute inset-y-0 left-0 rounded-full" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function CountUp({ to, delay = 0, duration = 1100 }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    let raf
    let start
    const startTimer = setTimeout(() => {
      const tick = (t) => {
        if (start === undefined) start = t
        const p = Math.min(1, (t - start) / duration)
        // ease-out cubic
        const eased = 1 - Math.pow(1 - p, 3)
        setN(Math.round(to * eased))
        if (p < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }, delay)
    return () => {
      clearTimeout(startTimer)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [to, delay, duration])
  return n
}
