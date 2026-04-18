import { useEffect, useRef, useState } from 'react'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Timeline from './components/Timeline'

const SECTION_IDS = ['top', 'about', 'projects', 'timeline']

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
  const [helpOpen, setHelpOpen] = useState(false)
  const dialogRef = useRef(null)
  const gPending = useRef(false)
  const gTimer = useRef(null)

  useEffect(() => {
    function onKey(e) {
      const t = e.target
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return
      if (e.metaKey || e.ctrlKey || e.altKey) return

      if (e.key === '?') {
        e.preventDefault()
        setHelpOpen(true)
        return
      }
      if (e.key === 'Escape' && helpOpen) {
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
        scrollToId('top')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [helpOpen])

  useEffect(() => {
    const d = dialogRef.current
    if (!d) return
    if (helpOpen && !d.open) d.showModal()
    if (!helpOpen && d.open) d.close()
  }, [helpOpen])

  return (
    <div className="min-h-screen">
      <Hero />
      <About />
      <Projects />
      <Timeline />
      <footer className="py-8 text-center text-sm text-slate-500 border-t border-slate-800">
        © 2026 Alex Chen — built with too much coffee ☕ · press <kbd className="px-1 border border-slate-700 rounded">?</kbd> for shortcuts
      </footer>
      <dialog
        ref={dialogRef}
        onClose={() => setHelpOpen(false)}
        className="bg-slate-900 text-slate-100 border border-slate-700 rounded-xl p-6 backdrop:bg-black/60 max-w-sm"
      >
        <h2 className="text-lg font-semibold mb-4">Keyboard shortcuts</h2>
        <ul className="space-y-2 text-sm">
          {[
            ['j', 'Next section'],
            ['k', 'Previous section'],
            ['g t', 'Go to top'],
            ['?', 'Toggle this help'],
            ['Esc', 'Close this help'],
          ].map(([k, d]) => (
            <li key={k} className="flex justify-between gap-6">
              <kbd className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-xs font-mono">{k}</kbd>
              <span className="text-slate-400">{d}</span>
            </li>
          ))}
        </ul>
        <form method="dialog" className="mt-6 text-right">
          <button className="px-3 py-1 text-sm border border-slate-700 hover:border-slate-500 rounded-md">Close</button>
        </form>
      </dialog>
    </div>
  )
}
