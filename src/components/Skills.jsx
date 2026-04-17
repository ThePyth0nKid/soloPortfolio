import { useEffect, useRef, useState } from 'react'

// Skills with emoji icons (no extra deps) and proficiency level (0-100).
// Levels are self-assessed "comfort" — ordered roughly by daily-use frequency.
const SKILLS = [
  { name: 'React',      icon: '⚛️', level: 95, color: 'from-cyan-400 to-blue-500',     blurb: 'Hooks, Suspense, RSC' },
  { name: 'TypeScript', icon: '🔷', level: 90, color: 'from-blue-400 to-indigo-500',   blurb: 'Strict mode, generics' },
  { name: 'Node.js',    icon: '🟢', level: 88, color: 'from-green-400 to-emerald-500', blurb: 'APIs, streams, tooling' },
  { name: 'Python',     icon: '🐍', level: 82, color: 'from-yellow-400 to-amber-500',  blurb: 'ML, scripting, FastAPI' },
  { name: 'Postgres',   icon: '🐘', level: 78, color: 'from-sky-400 to-blue-600',      blurb: 'Indexes, CTEs, JSONB' },
  { name: 'Tailwind',   icon: '🎨', level: 92, color: 'from-teal-400 to-cyan-500',     blurb: 'Design systems, a11y' },
  { name: 'AI / LLMs',  icon: '🧠', level: 85, color: 'from-purple-400 to-pink-500',   blurb: 'Agents, RAG, evals' },
  { name: 'Design',     icon: '✨', level: 75, color: 'from-pink-400 to-rose-500',     blurb: 'Figma, motion, UX' },
]

function SkillBar({ skill, animate, index, prefersReducedMotion }) {
  // When reduced motion: jump straight to final value (no animation).
  // Otherwise: stagger each bar slightly for a pleasant cascade.
  const target = animate ? skill.level : 0
  const delay = prefersReducedMotion ? 0 : index * 90

  return (
    <div
      className="group p-5 bg-slate-900/60 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <span
            className="text-2xl shrink-0 transition-transform duration-300 group-hover:scale-110"
            aria-hidden="true"
          >
            {skill.icon}
          </span>
          <div className="min-w-0">
            <div className="font-semibold text-slate-100 truncate">{skill.name}</div>
            <div className="text-xs text-slate-500 truncate">{skill.blurb}</div>
          </div>
        </div>
        <div
          className="text-sm font-mono tabular-nums text-slate-400"
          aria-hidden="true"
        >
          {target}%
        </div>
      </div>

      <div
        className="relative h-2 bg-slate-800 rounded-full overflow-hidden"
        role="progressbar"
        aria-label={`${skill.name} proficiency`}
        aria-valuenow={skill.level}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuetext={`${skill.level} percent`}
      >
        <div
          className={`absolute inset-y-0 left-0 bg-gradient-to-r ${skill.color} rounded-full`}
          style={{
            width: `${target}%`,
            transition: prefersReducedMotion
              ? 'none'
              : `width 1200ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
          }}
        />
        {/* subtle shine — only while animating in */}
        {animate && !prefersReducedMotion && (
          <div
            className="absolute inset-y-0 w-12 -skew-x-12 bg-white/10 blur-sm"
            style={{
              animation: `skill-shine 1400ms ease-out ${delay}ms 1`,
            }}
          />
        )}
      </div>
    </div>
  )
}

export default function Skills() {
  const sectionRef = useRef(null)
  const [animate, setAnimate] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  // Respect the user's OS-level motion preference.
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setPrefersReducedMotion(mq.matches)
    update()
    mq.addEventListener?.('change', update)
    return () => mq.removeEventListener?.('change', update)
  }, [])

  // Trigger animation when the section scrolls into view (once).
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    // Fallback: if IntersectionObserver is unavailable, animate immediately.
    if (typeof IntersectionObserver === 'undefined') {
      setAnimate(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setAnimate(true)
            observer.disconnect()
            break
          }
        }
      },
      { threshold: 0.25, rootMargin: '0px 0px -10% 0px' },
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
      {/* Local keyframes for the shine sweep */}
      <style>{`
        @keyframes skill-shine {
          0%   { transform: translateX(-100%) skewX(-12deg); opacity: 0; }
          40%  { opacity: 0.8; }
          100% { transform: translateX(800%) skewX(-12deg); opacity: 0; }
        }
      `}</style>

      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-2">
          <h2 id="skills-heading" className="text-4xl font-bold">
            Skills
          </h2>
          <p className="text-slate-400">
            Tools I reach for most often. Bars reflect how comfortable I am
            shipping production work — not years on a résumé.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {SKILLS.map((skill, i) => (
            <SkillBar
              key={skill.name}
              skill={skill}
              index={i}
              animate={animate}
              prefersReducedMotion={prefersReducedMotion}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
