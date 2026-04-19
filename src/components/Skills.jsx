import { useEffect, useRef, useState } from 'react'

const SKILLS = [
  { name: 'React', level: 95, icon: '⚛️' },
  { name: 'TypeScript', level: 90, icon: 'TS' },
  { name: 'Node.js', level: 85, icon: '⬢' },
  { name: 'Python', level: 80, icon: 'Py' },
  { name: 'PostgreSQL', level: 75, icon: '🐘' },
  { name: 'Tailwind CSS', level: 92, icon: '💨' },
  { name: 'AI / LLMs', level: 78, icon: '🧠' },
  { name: 'System Design', level: 82, icon: '🏗️' },
]

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function Skills() {
  const sectionRef = useRef(null)
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    // If user prefers reduced motion, skip the animation entirely —
    // show final values immediately.
    if (prefersReducedMotion()) {
      setAnimated(true)
      return
    }

    if (typeof IntersectionObserver === 'undefined') {
      setAnimated(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAnimated(true)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.25 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="skills"
      ref={sectionRef}
      aria-labelledby="skills-heading"
      className="py-24 px-6"
    >
      <div className="max-w-3xl mx-auto space-y-8">
        <h2 id="skills-heading" className="text-4xl font-bold">
          Skills
        </h2>
        <p className="text-slate-400">
          A snapshot of the tools I reach for most often. Proficiency is
          self-assessed on a 0–100 scale.
        </p>

        <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-6 list-none p-0">
          {SKILLS.map((skill) => {
            const target = animated ? skill.level : 0
            const labelId = `skill-${skill.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-label`
            const valueId = `skill-${skill.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-value`
            return (
              <li key={skill.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200"
                    >
                      {skill.icon}
                    </span>
                    <span id={labelId} className="text-sm font-medium text-slate-100">
                      {skill.name}
                    </span>
                  </div>
                  <span
                    id={valueId}
                    className="text-xs tabular-nums text-slate-300"
                    aria-hidden="true"
                  >
                    {skill.level}%
                  </span>
                </div>

                {/*
                  Native <progress> would be ideal semantically, but it's
                  notoriously hard to style consistently across browsers.
                  Using role="progressbar" with proper ARIA values gives
                  screen readers the same information.
                */}
                <div
                  role="progressbar"
                  aria-labelledby={labelId}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={skill.level}
                  aria-valuetext={`${skill.level} out of 100`}
                  className="relative h-2 w-full rounded-full bg-slate-800 border border-slate-700 overflow-hidden"
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 motion-safe:transition-[width] motion-safe:duration-[1200ms] motion-safe:ease-out"
                    style={{ width: `${target}%` }}
                  />
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
