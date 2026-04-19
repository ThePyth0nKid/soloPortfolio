import { useEffect, useRef, useState } from 'react'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Timeline from './components/Timeline'
import ShortcutsHelp, { SHORTCUTS } from './components/ShortcutsHelp'

const SECTION_IDS = ['top', 'about', 'projects', 'skills', 'timeline']

function scrollToId(id) {
  if (id === 'top') return window.scrollTo({ top: 0, behavior: 'smooth' })
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
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
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || t.isContentEditable
}

export default function App() {
  const [helpOpen, setHelpOpen] = useState(false)
  const gPending = useRef(false)
  const gTimer = useRef(null)

  useEffect(() => {
    function onKey(e) {
      if (isEditableTarget(e.target)) return
      if (e.metaKey || e.ctrlKey || e.altKey) return

      if (e.key === '?') {
        e.preventDefault()
        setHelpOpen((v) => !v)
        return
      }
      if (e.key === 'Escape' && helpOpen) {
        e.preventDefault()
        setHelpOpen(false)
        return
      }
      if (e.key === 'j') {
        e.preventDefault()
        scrollToId(SECTION_IDS[Math.min(SECTION_IDS.length - 1, currentSectionIndex() + 1)])
        return
      }
      if (e.key === 'k') {
        e.preventDefault()
        scrollToId(SECTION_IDS[Math.max(0, currentSectionIndex() - 1)])
        return
      }
      if (e.key === 'g') {
        gPending.current = true
        clearTimeout(gTimer.current)
        gTimer.current = setTimeout(() => { gPending.current = false }, 800)
        return
      }
      if (e.key === 't' && gPending.current) {
        gPending.current = false
        e.preventDefault()
        scrollToId('top')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [helpOpen])

  return (
    <div className="min-h-screen">
      <Hero />
      <About />
      <Projects />
      <Skills />
      <Timeline />
      <footer className="py-8 text-center text-sm text-slate-500">
        Press <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-xs text-slate-300">?</kbd> for keyboard shortcuts
      </footer>
      <ShortcutsHelp
        open={helpOpen}
        onClose={() => setHelpOpen(false)}
        shortcuts={SHORTCUTS}
      />
    </div>
  )
}
