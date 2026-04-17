import { useEffect, useRef, useState } from 'react'

/**
 * Animation duration for the progress bar fill, in milliseconds.
 * Chosen to feel snappy but still visibly animated.
 */
const ANIMATION_DURATION_MS = 1200

/**
 * IntersectionObserver threshold — fraction of the section that must be
 * visible before the animation kicks off.
 */
const VISIBILITY_THRESHOLD = 0.25

/**
 * Maximum progress bar value (percent). All skill `level`s are expressed
 * on a 0–100 scale so the bar width maps directly to a CSS percentage.
 */
const MAX_LEVEL = 100

/**
 * @typedef {Object} Skill
 * @property {string} name  Human-readable skill name.
 * @property {string} icon  Emoji or short glyph used as a visual anchor.
 * @property {number} level Proficiency on a 0–100 scale.
 */

/** @type {ReadonlyArray<Skill>} */
const SKILLS = Object.freeze([
  { name: 'React', icon: '⚛️', level: 95 },
  { name: 'TypeScript', icon: '🟦', level: 90 },
  { name: 'Node.js', icon: '🟢', level: 88 },
  { name: 'Python', icon: '🐍', level: 82 },
  { name: 'Postgres', icon: '🐘', level: 78 },
  { name: 'Tailwind CSS', icon: '🎨', level: 92 },
  { name: 'AI / ML', icon: '🤖', level: 70 },
  { name: 'Docker', icon: '🐳', level: 75 },
])

/**
 * Clamp a number into the inclusive range [min, max].
 *
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function clamp(value, min, max) {
  if (Number.isNaN(value)) {
    throw new Error('clamp() received NaN')
  }
  return Math.min(Math.max(value, min), max)
}

/**
 * A single skill row: icon, name, numeric level, and an animated bar.
 *
 * The bar width is driven by `isVisible`: it stays at 0% until the parent
 * section scrolls into view, then transitions to `level`%.
 *
 * @param {{ skill: Skill, isVisible: boolean }} props
 */
function SkillBar({ skill, isVisible }) {
  const safeLevel = clamp(skill.level, 0, MAX_LEVEL)
  const width = isVisible ? `${safeLevel}%` : '0%'

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span aria-hidden="true" className="text-lg">
            {skill.icon}
          </span>
          <span className="text-sm font-medium text-slate-200">{skill.name}</span>
        </div>
        <span className="text-xs tabular-nums text-slate-500">{safeLevel}%</span>
      </div>
      <div
        role="progressbar"
        aria-label={`${skill.name} proficiency`}
        aria-valuenow={safeLevel}
        aria-valuemin={0}
        aria-valuemax={MAX_LEVEL}
        className="h-2 w-full overflow-hidden rounded-full bg-slate-800"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 ease-out"
          style={{
            width,
            transitionProperty: 'width',
            transitionDuration: `${ANIMATION_DURATION_MS}ms`,
          }}
        />
      </div>
    </div>
  )
}

/**
 * Skills section. Renders a two-column grid of technical skills with
 * horizontal progress bars that animate from 0 → their value the first
 * time the section scrolls into view.
 *
 * Uses `IntersectionObserver` for efficiency; falls back to immediately
 * showing the bars if the API is unavailable (e.g. very old browsers /
 * SSR snapshots).
 */
export default function Skills() {
  const sectionRef = useRef(/** @type {HTMLElement | null} */ (null))
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const node = sectionRef.current
    if (!node) return undefined

    // Graceful fallback for environments without IntersectionObserver.
    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true)
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.disconnect() // animate only once
            break
          }
        }
      },
      { threshold: VISIBILITY_THRESHOLD },
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
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-2">
          <h2 id="skills-heading" className="text-4xl font-bold">
            Skills
          </h2>
          <p className="text-slate-400">
            The tools I reach for most often. Levels are self-assessed — take them
            with a grain of salt.
          </p>
        </div>
        <div className="grid gap-x-10 gap-y-6 md:grid-cols-2">
          {SKILLS.map((skill) => (
            <SkillBar key={skill.name} skill={skill} isVisible={isVisible} />
          ))}
        </div>
      </div>
    </section>
  )
}

// Exported for testing only.
export const __testing__ = {
  SKILLS,
  clamp,
  ANIMATION_DURATION_MS,
  VISIBILITY_THRESHOLD,
  MAX_LEVEL,
}
