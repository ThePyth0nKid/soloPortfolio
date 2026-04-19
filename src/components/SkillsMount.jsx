import { useEffect, useRef } from 'react'
import Skills from './Skills'

/**
 * Wraps <Skills /> and toggles an `.in-view` class on the grid when it
 * scrolls into view, which kicks off the CSS-native animations.
 * Using IntersectionObserver (not a timer) keeps motion tied to causality.
 */
export default function SkillsMount() {
  const rootRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const grid = root.querySelector('.skills-grid')
    if (!grid) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      grid.classList.add('in-view')
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            grid.classList.add('in-view')
            io.disconnect()
          }
        })
      },
      { threshold: 0.25 }
    )
    io.observe(grid)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={rootRef}>
      <Skills />
    </div>
  )
}
