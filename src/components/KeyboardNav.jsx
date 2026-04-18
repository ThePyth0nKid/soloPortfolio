import { useCallback, useMemo, useState } from 'react'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'
import ShortcutsHelp from './ShortcutsHelp'

const SECTION_SELECTOR = 'section[id], footer'

function getSections() {
  return Array.from(document.querySelectorAll(SECTION_SELECTOR))
}

function getCurrentSectionIndex(sections) {
  const scrollY = window.scrollY
  const offset = 80 // header-ish threshold
  let currentIdx = 0
  sections.forEach((el, i) => {
    if (el.offsetTop - offset <= scrollY) currentIdx = i
  })
  return currentIdx
}

function scrollToSection(el) {
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function KeyboardNav() {
  const [helpOpen, setHelpOpen] = useState(false)

  const next = useCallback(() => {
    const sections = getSections()
    if (!sections.length) return
    const idx = getCurrentSectionIndex(sections)
    scrollToSection(sections[Math.min(idx + 1, sections.length - 1)])
  }, [])

  const prev = useCallback(() => {
    const sections = getSections()
    if (!sections.length) return
    const idx = getCurrentSectionIndex(sections)
    scrollToSection(sections[Math.max(idx - 1, 0)])
  }, [])

  const goTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const goBottom = useCallback(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
  }, [])

  const shortcuts = useMemo(
    () => [
      { keys: 'j', handler: next },
      { keys: 'k', handler: prev },
      { keys: ['g', 't'], handler: goTop },
      { keys: ['g', 'b'], handler: goBottom },
      { keys: '?', handler: () => setHelpOpen((v) => !v) },
    ],
    [next, prev, goTop, goBottom],
  )

  useKeyboardShortcuts(shortcuts, { enabled: !helpOpen })

  return (
    <>
      <button
        type="button"
        onClick={() => setHelpOpen(true)}
        aria-label="Show keyboard shortcuts"
        title="Keyboard shortcuts (press ?)"
        className="fixed bottom-4 right-4 z-40 flex items-center gap-2 px-3 py-2 bg-slate-900/80 backdrop-blur border border-slate-800 hover:border-slate-600 rounded-lg text-xs text-slate-400 hover:text-slate-200 transition-colors"
      >
        <span className="inline-flex items-center justify-center w-5 h-5 bg-slate-800 border border-slate-700 rounded font-mono">
          ?
        </span>
        <span className="hidden sm:inline">Shortcuts</span>
      </button>
      <ShortcutsHelp open={helpOpen} onClose={() => setHelpOpen(false)} />
    </>
  )
}
