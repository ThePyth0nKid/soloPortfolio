import { useEffect, useRef, useState } from 'react'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Timeline from './components/Timeline'

const SECTION_IDS = ['top', 'about', 'projects', 'skills', 'timeline']

const SHORTCUTS = [
  ['j', 'Next section'],
  ['k', 'Previous section'],
  ['g t', 'Go to top'],
  ['?', 'Show this help'],
  ['Esc', 'Close help'],
]

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
        setHelpOpen((v) => !v)
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
      <Skills />
      <Timeline />
      <footer className="py-8 text-center text-xs text-slate-500">
        Press <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded">?</kbd> for keyboard shortcuts
      </footer>
      <dialog
        ref={dialogRef}
        onClose={() => setHelpOpen(false)}
        className="bg-slate-900 text-slate-100 border border-slate-800 rounded-xl p-6 max-w-sm w-full backdrop:bg-black/60"
      >
        <h2 className="text-lg font-semibold mb-4">Keyboard shortcuts</h2>
        <dl className="space-y-2 text-sm">
          {SHORTCUTS.map(([keys, desc]) => (
            <div key={keys} className="flex justify-between gap-6">
              <dt className="text-slate-400">{desc}</dt>
              <dd className="font-mono text-xs">
                {keys.split(' ').map((k, i) => (
                  <span key={i}>
                    {i > 0 && <span className="text-slate-600 mx-1">then</span>}
                    <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded">{k}</kbd>
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
        <form method="dialog" className="mt-6 text-right">
          <button className="px-3 py-1 text-xs border border-slate-700 hover:border-slate-500 rounded">Close</button>
        </form>
      </dialog>
    </div>
  )
}
