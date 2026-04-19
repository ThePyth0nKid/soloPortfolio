import { useEffect, useRef, useState } from 'react'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Timeline from './components/Timeline'
import ShortcutsHelp from './components/ShortcutsHelp'

const SECTION_IDS = ['top', 'about', 'projects', 'skills', 'timeline']
const SECTION_LABELS = {
  top: 'Top of page',
  about: 'About',
  projects: 'Projects',
  skills: 'Skills',
  timeline: 'Timeline',
}

function scrollToId(id) {
  if (id === 'top') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    // Move focus to the document root so screen readers announce the new location
    document.getElementById('main-content')?.focus({ preventScroll: true })
    return
  }
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  // Briefly make the section focusable so screen readers announce its heading.
  const prevTabIndex = el.getAttribute('tabindex')
  el.setAttribute('tabindex', '-1')
  el.focus({ preventScroll: true })
  if (prevTabIndex === null) {
    // Clean up after focus so we don't pollute the tab order.
    setTimeout(() => el.removeAttribute('tabindex'), 1000)
  }
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
  if (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT') return true
  if (t.isContentEditable) return true
  // Native <dialog> form elements etc.
  const role = t.getAttribute && t.getAttribute('role')
  if (role === 'textbox' || role === 'combobox' || role === 'searchbox') return true
  return false
}

export default function App() {
  const [helpOpen, setHelpOpen] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const gPending = useRef(false)
  const gTimer = useRef(null)

  useEffect(() => {
    function onKey(e) {
      // Always allow Escape to close help, even if focus is inside the dialog.
      if (e.key === 'Escape' && helpOpen) {
        e.preventDefault()
        setHelpOpen(false)
        return
      }

      if (isEditableTarget(e.target)) return
      if (e.metaKey || e.ctrlKey || e.altKey) return

      // '?' — open help. On most US layouts this is Shift+/.
      if (e.key === '?') {
        e.preventDefault()
        setHelpOpen(true)
        setAnnouncement('Keyboard shortcuts help opened')
        return
      }

      // Don't process navigation shortcuts while help dialog is open.
      if (helpOpen) return

      if (e.key === 'j' || e.key === 'J') {
        e.preventDefault()
        const next = Math.min(SECTION_IDS.length - 1, currentSectionIndex() + 1)
        const id = SECTION_IDS[next]
        scrollToId(id)
        setAnnouncement(`Navigated to ${SECTION_LABELS[id]}`)
        return
      }
      if (e.key === 'k' || e.key === 'K') {
        e.preventDefault()
        const prev = Math.max(0, currentSectionIndex() - 1)
        const id = SECTION_IDS[prev]
        scrollToId(id)
        setAnnouncement(`Navigated to ${SECTION_LABELS[id]}`)
        return
      }
      if (e.key === 'g') {
        gPending.current = true
        clearTimeout(gTimer.current)
        gTimer.current = setTimeout(() => {
          gPending.current = false
        }, 1000)
        return
      }
      if (e.key === 't' && gPending.current) {
        e.preventDefault()
        gPending.current = false
        clearTimeout(gTimer.current)
        scrollToId('top')
        setAnnouncement('Navigated to top of page')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      clearTimeout(gTimer.current)
    }
  }, [helpOpen])

  return (
    <div className="min-h-screen">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-purple-600 focus:text-white focus:rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 focus:ring-purple-400"
      >
        Skip to main content
      </a>
      <main id="main-content" tabIndex="-1" className="focus:outline-none">
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Timeline />
      </main>
      <footer className="py-8 text-center text-sm text-slate-500">
        <p>
          Press{' '}
          <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300 font-mono text-xs">
            ?
          </kbd>{' '}
          for keyboard shortcuts
        </p>
      </footer>

      <ShortcutsHelp open={helpOpen} onClose={() => setHelpOpen(false)} />

      {/* Live region for shortcut announcements. aria-live=polite so it doesn't interrupt. */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>
    </div>
  )
}
