import { useEffect, useRef, useState } from 'react'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Timeline from './components/Timeline'
import ShortcutsHelp from './components/ShortcutsHelp'
import ShortcutHint from './components/ShortcutHint'
import KeyPressIndicator from './components/KeyPressIndicator'

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

function isEditable(t) {
  if (!t) return false
  const tag = t.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || t.isContentEditable
}

export default function App() {
  const [helpOpen, setHelpOpen] = useState(false)
  const [pendingKeys, setPendingKeys] = useState([])
  const gPending = useRef(false)
  const gTimer = useRef(null)
  const pendingTimer = useRef(null)

  const clearPending = () => {
    gPending.current = false
    setPendingKeys([])
    clearTimeout(pendingTimer.current)
  }

  useEffect(() => {
    function onKey(e) {
      if (isEditable(e.target)) return
      if (e.metaKey || e.ctrlKey || e.altKey) return

      if (e.key === '?') {
        e.preventDefault()
        setHelpOpen((v) => !v)
        return
      }
      if (e.key === 'Escape') {
        if (helpOpen) setHelpOpen(false)
        clearPending()
        return
      }

      // Block other shortcuts while help dialog is open (let dialog handle focus)
      if (helpOpen) return

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
        e.preventDefault()
        gPending.current = true
        setPendingKeys(['g'])
        clearTimeout(gTimer.current)
        clearTimeout(pendingTimer.current)
        gTimer.current = setTimeout(() => { gPending.current = false }, 1000)
        pendingTimer.current = setTimeout(() => setPendingKeys([]), 1000)
        return
      }
      if (e.key === 't' && gPending.current) {
        e.preventDefault()
        clearPending()
        scrollToId('top')
        return
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
        Press <kbd className="px-1.5 py-0.5 mx-1 rounded border border-slate-700 bg-slate-900 font-mono text-[11px] text-slate-300">?</kbd> for keyboard shortcuts
      </footer>

      <ShortcutHint onOpen={() => setHelpOpen(true)} />
      <KeyPressIndicator keys={pendingKeys} />
      <ShortcutsHelp open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  )
}
