import { useEffect, useRef, useState } from 'react'

const SKILLS = [
  { name: 'React', level: 95, icon: '⚛️', description: 'Hooks, Suspense, Server Components' },
  { name: 'TypeScript', level: 90, icon: 'TS', description: 'Strict mode, generics, type-level programming' },
  { name: 'Node.js', level: 85, icon: '⬢', description: 'APIs, streaming, tooling' },
  { name: 'Python', level: 80, icon: '🐍', description: 'Data pipelines, ML, scripting' },
  { name: 'Postgres', level: 78, icon: '🐘', description: 'Query tuning, schema design' },
  { name: 'CSS / Tailwind', level: 88, icon: '🎨', description: 'Design systems, responsive layouts' },
  { name: 'Accessibility', level: 92, icon: '♿', description: 'WCAG 2.2, ARIA, screen readers' },
  { name: 'AI / LLMs', level: 75, icon: '🧠', description: 'Agents, RAG, evals' },
]

function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function Skills() {
  const sectionRef = useRef(null)
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const node = sectionRef.current
    if (!node) return

    // If reduced motion is requested, show final values immediately.
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
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="skills"
      ref={sectionRef}
      aria-labelledby="skills-heading"
      className="py-24 px-6"
    >
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-2">
          <h2 id="skills-heading" className="text-4xl font-bold">
            Skills
          </h2>
          <p className="text-slate-400">
            Self-rated proficiency across the stack. Values are approximate and
            provided for visual context.
          </p>
        </div>

        {/* Screen reader announcement when bars finish animating in. */}
        <p role="status" aria-live="polite" className="sr-only">
          {animated ? 'Skill proficiency bars are now displayed.' : ''}
        </p>

        <ul role="list" className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
          {SKILLS.map((skill) => {
            const displayValue = animated ? skill.level : 0
            const barId = `skill-${skill.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`
            const descId = `${barId}-desc`
            return (
              <li key={skill.name} className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      aria-hidden="true"
                      className="flex items-center justify-center w-8 h-8 rounded-md bg-slate-800 border border-slate-700 text-sm font-semibold text-purple-300 shrink-0"
                    >
                      {skill.icon}
                    </span>
                    <span id={barId} className="font-medium text-slate-100 truncate">
                      {skill.name}
                    </span>
                  </div>
                  <span
                    aria-hidden="true"
                    className="text-xs tabular-nums text-slate-400"
                  >
                    {displayValue}%
                  </span>
                </div>

                <div
                  role="progressbar"
                  aria-labelledby={barId}
                  aria-describedby={descId}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={skill.level}
                  aria-valuetext={`${skill.name}: ${skill.level} out of 100`}
                  className="relative h-2.5 w-full rounded-full bg-slate-800 border border-slate-700 overflow-hidden"
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 motion-safe:transition-[width] motion-safe:duration-1000 motion-safe:ease-out"
                    style={{ width: `${displayValue}%` }}
                  />
                </div>
                <p id={descId} className="text-xs text-slate-500">
                  {skill.description}
                </p>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
