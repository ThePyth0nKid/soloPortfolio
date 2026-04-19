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
  const dialogRef = useRef(null)
  const gPending = useRef(false)
  const gTimer = useRef(null)

  useEffect(() => {
    function isEditable(t) {
      if (!t) return false
      const tag = t.tagName
      return (
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        tag === 'SELECT' ||
        t.isContentEditable
      )
    }

    function openHelp() {
      const d = dialogRef.current
      if (d && !d.open) d.showModal()
    }
    function closeHelp() {
      const d = dialogRef.current
      if (d && d.open) d.close()
    }

    function onKey(e) {
      if (isEditable(e.target)) return
      if (e.metaKey || e.ctrlKey || e.altKey) return

      const d = dialogRef.current
      const helpOpen = d?.open

      if (e.key === '?') {
        e.preventDefault()
        helpOpen ? closeHelp() : openHelp()
        return
      }
      // Let native <dialog> handle Escape itself.
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
      if (e.key === 'G') {
        e.preventDefault()
        scrollToId('timeline')
        return
      }
      if (e.key === 'g') {
        if (gPending.current) {
          // gg -> top
          gPending.current = false
          clearTimeout(gTimer.current)
          scrollToId('top')
          return
        }
        gPending.current = true
        clearTimeout(gTimer.current)
        gTimer.current = setTimeout(() => { gPending.current = false }, 800)
        return
      }
      if (gPending.current && e.key === 't') {
        e.preventDefault()
        gPending.current = false
        clearTimeout(gTimer.current)
        scrollToId('top')
        return
      }
      if (gPending.current && e.key === 'b') {
        e.preventDefault()
        gPending.current = false
        clearTimeout(gTimer.current)
        scrollToId('timeline')
        return
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
      <footer className="py-8 text-center text-slate-500 text-sm">
        Press <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-xs">?</kbd> for keyboard shortcuts
      </footer>
      <KeyboardHelp ref={dialogRef} />
    </div>
  )
}
