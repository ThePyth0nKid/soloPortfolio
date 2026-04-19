import { useEffect, useRef, useState } from 'react'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Timeline from './components/Timeline'
import ShortcutsHelp from './components/ShortcutsHelp'
import ShortcutHint from './components/ShortcutHint'

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

function flashIndicator(text) {
  const el = document.createElement('div')
  el.className = 'keypress-flash'
  el.textContent = text
  document.body.appendChild(el)
  // Remove after animation
  el.addEventListener('animationend', () => el.remove())
}

export default function App() {
  const [helpOpen, setHelpOpen] = useState(false)
  const gPending = useRef(false)
  const gTimer = useRef(null)

  useEffect(() => {
    function onKey(e) {
      const t = e.target
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return
      if (e.metaKey || e.ctrlKey || e.altKey) return

      if (e.key === '?') {
        e.preventDefault()
        setHelpOpen((v) => !v)
        return
      }
      if (e.key === 'Escape' && helpOpen) {
        setHelpOpen(false)
        return
      }
      if (helpOpen) return
      if (e.key === 'j') {
        e.preventDefault()
        flashIndicator('j ↓')
        scrollToId(SECTION_IDS[Math.min(SECTION_IDS.length - 1, currentSectionIndex() + 1)])
        return
      }
      if (e.key === 'k') {
        e.preventDefault()
        flashIndicator('k ↑')
        scrollToId(SECTION_IDS[Math.max(0, currentSectionIndex() - 1)])
        return
      }
      if (e.key === 'g') {
        gPending.current = true
        flashIndicator('g…')
        clearTimeout(gTimer.current)
        gTimer.current = setTimeout(() => { gPending.current = false }, 800)
        return
      }
      if (e.key === 't' && gPending.current) {
        gPending.current = false
        clearTimeout(gTimer.current)
        flashIndicator('gt ↑↑')
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
      <footer className="py-8 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Alex Chen
      </footer>
      <ShortcutHint onOpen={() => setHelpOpen(true)} />
      <ShortcutsHelp open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  )
}
