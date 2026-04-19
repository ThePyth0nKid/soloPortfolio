import { useEffect, useRef, useState, useCallback } from 'react'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Timeline from './components/Timeline'
import ShortcutsHelp from './components/ShortcutsHelp'

const SECTIONS = [
  { id: 'top', label: 'Top of page' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'timeline', label: 'Timeline' },
]

const SECTION_IDS = SECTIONS.map((s) => s.id)

function scrollToId(id) {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const behavior = prefersReduced ? 'auto' : 'smooth'
  if (id === 'top') {
    window.scrollTo({ top: 0, behavior })
    return
  }
  document.getElementById(id)?.scrollIntoView({ behavior, block: 'start' })
}

function focusSection(id) {
  const target =
    id === 'top'
      ? document.querySelector('main') || document.body
      : document.getElementById(id)
  if (!target) return
  const prev = target.getAttribute('tabindex')
  if (prev === null) target.setAttribute('tabindex', '-1')
  target.focus({ preventScroll: true })
}

function currentSectionIndex() {
  const y = window.scrollY + 80
  let idx = 0
  SECTION_IDS.forEach((id, i) => {
    if (id === 'top') return
    const el = document.getElementById(id)
    if (el && el.offsetTop <= y) idx = i
  })
  return idx
}

function isEditableTarget(t) {
  if (!t) return false
  const tag = t.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true
  if (t.isContentEditable) return true
  // Also skip role="textbox" etc.
  const role = t.getAttribute && t.getAttribute('role')
  if (role === 'textbox' || role === 'searchbox' || role === 'combobox') return true
  return false
}

export default function App() {
  const [helpOpen, setHelpOpen] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const gPending = useRef(false)
  const gTimer = useRef(null)
  const lastFocus = useRef(null)

  const announce = useCallback((msg) => {
    // Clear first so repeated identical messages still announce.
    setAnnouncement('')
    window.requestAnimationFrame(() => setAnnouncement(msg))
  }, [])

  const openHelp = useCallback(() => {
    lastFocus.current = document.activeElement
    setHelpOpen(true)
  }, [])

  const closeHelp = useCallback(() => {
    setHelpOpen(false)
    const el = lastFocus.current
    if (el && typeof el.focus === 'function') {
      // Restore focus after close.
      window.requestAnimationFrame(() => el.focus())
    }
  }, [])

  const goToSection = useCallback(
    (id) => {
      scrollToId(id)
      // Move focus so screen readers announce the new section landmark.
      window.setTimeout(() => focusSection(id), 50)
      const section = SECTIONS.find((s) => s.id === id)
      if (section) announce(`Jumped to ${section.label}`)
    },
    [announce],
  )

  useEffect(() => {
    function onKey(e) {
      // Always allow Escape to close the help modal, even if it somehow
      // escaped the dialog's own handler.
      if (e.key === 'Escape' && helpOpen) {
        e.preventDefault()
        closeHelp()
        return
      }

      // Never intercept keys while the user is typing in a form field.
      if (isEditableTarget(e.target)) return

      // Leave browser/OS shortcuts alone.
      if (e.metaKey || e.ctrlKey || e.altKey) return

      // Don't fire shortcuts while help modal is open (let the dialog own input).
      if (helpOpen) return

      // "?" — open help. Shift+/ on US keyboards produces '?'.
      if (e.key === '?') {
        e.preventDefault()
        openHelp()
        return
      }

      if (e.key === 'j' || e.key === 'J') {
        e.preventDefault()
        const next = Math.min(SECTION_IDS.length - 1, currentSectionIndex() + 1)
        goToSection(SECTION_IDS[next])
        return
      }

      if (e.key === 'k' || e.key === 'K') {
        e.preventDefault()
        const prev = Math.max(0, currentSectionIndex() - 1)
        goToSection(SECTION_IDS[prev])
        return
      }

      if (e.key === 'g') {
        gPending.current = true
        window.clearTimeout(gTimer.current)
        gTimer.current = window.setTimeout(() => {
          gPending.current = false
        }, 1000)
        return
      }

      if (e.key === 't' && gPending.current) {
        e.preventDefault()
        gPending.current = false
        window.clearTimeout(gTimer.current)
        goToSection('top')
        return
      }

      // Any other key cancels a pending "g".
      if (gPending.current && e.key !== 'Shift') {
        gPending.current = false
        window.clearTimeout(gTimer.current)
      }
    }

    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.clearTimeout(gTimer.current)
    }
  }, [helpOpen, openHelp, closeHelp, goToSection])

  return (
    <div className="min-h-screen">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-purple-600 focus:text-white focus:rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
      >
        Skip to main content
      </a>

      <main id="main" tabIndex={-1} className="focus:outline-none">
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Timeline />
      </main>

      <footer className="py-8 text-center text-sm text-slate-500">
        <p>
          Press{' '}
          <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-xs text-slate-300">
            ?
          </kbd>{' '}
          for keyboard shortcuts
        </p>
      </footer>

      <ShortcutsHelp open={helpOpen} onClose={closeHelp} />

      {/* Polite live region for shortcut feedback. */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>
    </div>
  )
}
