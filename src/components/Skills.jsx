import { useEffect, useRef, useState } from 'react'

const SKILLS = [
  { name: 'React', level: 95, icon: '⚛️', description: 'Hooks, Suspense, RSC, accessibility patterns' },
  { name: 'TypeScript', level: 90, icon: '🔷', description: 'Strict mode, generics, type-level programming' },
  { name: 'Node.js', level: 85, icon: '🟢', description: 'REST, streaming, background workers' },
  { name: 'Python', level: 80, icon: '🐍', description: 'Data pipelines, ML tooling, scripting' },
  { name: 'PostgreSQL', level: 78, icon: '🐘', description: 'Schema design, indexing, query tuning' },
  { name: 'Tailwind CSS', level: 92, icon: '🎨', description: 'Design systems, responsive layouts' },
  { name: 'Accessibility', level: 88, icon: '♿', description: 'WCAG 2.2, ARIA, keyboard + screen readers' },
  { name: 'AI / LLMs', level: 75, icon: '🤖', description: 'Prompting, RAG, agent orchestration' },
]

function useInView(ref, options = { threshold: 0.2 }) {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      options,
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, options])
  return inView
}

function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function SkillBar({ skill, animate, delayMs }) {
  const [width, setWidth] = useState(0)
  const reduced = prefersReducedMotion()
  const descId = `skill-desc-${skill.name.replace(/\s+/g, '-').toLowerCase()}`

  useEffect(() => {
    if (!animate) return
    if (reduced) {
      setWidth(skill.level)
      return
    }
    const t = setTimeout(() => setWidth(skill.level), delayMs)
    return () => clearTimeout(t)
  }, [animate, reduced, skill.level, delayMs])

  return (
    <li className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span aria-hidden="true" className="text-lg">
            {skill.icon}
          </span>
          <span className="font-medium text-slate-100">{skill.name}</span>
        </div>
        <span className="text-sm tabular-nums text-slate-300" aria-hidden="true">
          {width}%
        </span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={skill.level}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${skill.name} proficiency`}
        aria-describedby={descId}
        className="h-3 w-full rounded-full bg-slate-800 border border-slate-700 overflow-hidden"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 motion-safe:transition-[width] motion-safe:duration-[1200ms] motion-safe:ease-out"
          style={{ width: `${width}%` }}
        />
      </div>
      <p id={descId} className="text-xs text-slate-400 leading-relaxed">
        {skill.description}
      </p>
    </li>
  )
}

export default function Skills() {
  const sectionRef = useRef(null)
  const inView = useInView(sectionRef)

  return (
    <section
      id="skills"
      ref={sectionRef}
      aria-labelledby="skills-heading"
      className="py-24 px-6"
    >
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-3">
          <h2 id="skills-heading" className="text-4xl font-bold">
            Skills
          </h2>
          <p className="text-slate-400">
            Self-assessed proficiency across the tools I reach for most. Bars
            animate when the section scrolls into view.
          </p>
        </div>

        <p role="status" aria-live="polite" className="sr-only">
          {inView ? 'Skill proficiency bars have finished rendering.' : ''}
        </p>

        <ul className="grid gap-6 sm:grid-cols-2">
          {SKILLS.map((skill, i) => (
            <SkillBar
              key={skill.name}
              skill={skill}
              animate={inView}
              delayMs={i * 90}
            />
          ))}
        </ul>
      </div>
    </section>
  )
}
