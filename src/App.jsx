import { useEffect, useRef, useState } from 'react'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Timeline from './components/Timeline'
import KeyboardHelp from './components/KeyboardHelp'

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

export default function App() {
  const popoverRef = useRef(null)
  const gPending = useRef(false)
  const gTimer = useRef(null)
  const [hint, setHint] = useState('')

  useEffect(() => {
    function isEditable(t) {
      if (!t) return false
      const tag = t.tagName
      return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || t.isContentEditable
    }

    function togglePopover(force) {
      const el = popoverRef.current
      if (!el) return
      try {
        if (force === true) el.showPopover?.()
        else if (force === false) el.hidePopover?.()
        else el.togglePopover?.()
      } catch {}
    }

    function onKey(e) {
      if (isEditable(e.target)) return
      if (e.metaKey || e.ctrlKey || e.altKey) return

      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault()
        togglePopover()
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
        setHint('g…')
        clearTimeout(gTimer.current)
        gTimer.current = setTimeout(() => {
          gPending.current = false
          setHint('')
        }, 1000)
        return
      }
      if (e.key === 't' && gPending.current) {
        e.preventDefault()
        gPending.current = false
        setHint('')
        scrollToId('top')
        return
      }
      if (e.key === 'G') {
        e.preventDefault()
        scrollToId(SECTION_IDS[SECTION_IDS.length - 1])
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      clearTimeout(gTimer.current)
    }
  }, [])

  return (
    <div className="min-h-screen">
      <Hero />
      <About />
      <Projects />
      <Skills />
      <Timeline />
      <footer className="py-8 text-center text-xs text-slate-500">
        Press <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded">?</kbd> for keyboard shortcuts
      </footer>

      <KeyboardHelp ref={popoverRef} />

      {hint && (
        <div
          aria-live="polite"
          className="fixed bottom-4 right-4 px-3 py-1.5 bg-slate-800/90 border border-slate-700 rounded-md text-sm font-mono text-slate-200 backdrop-blur pointer-events-none"
        >
          {hint}
        </div>
      )}
    </div>
  )
}
