import { useCallback, useRef, useState } from 'react'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'
import ShortcutsHelp from './ShortcutsHelp'

export default function ShortcutsProvider() {
  const [helpOpen, setHelpOpen] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const announceTimerRef = useRef(null)

  const announce = useCallback((msg) => {
    setAnnouncement('')
    // Double-set so screen readers re-announce identical messages.
    requestAnimationFrame(() => setAnnouncement(msg))
    if (announceTimerRef.current) clearTimeout(announceTimerRef.current)
    announceTimerRef.current = setTimeout(() => setAnnouncement(''), 2000)
  }, [])

  const openHelp = useCallback(() => setHelpOpen(true), [])
  const closeHelp = useCallback(() => setHelpOpen(false), [])

  useKeyboardShortcuts({ onShowHelp: openHelp, announce })

  return (
    <>
      <ShortcutsHelp open={helpOpen} onClose={closeHelp} />

      {/* Live region for movement announcements */}
      <div role="status" aria-live="polite" className="sr-only">
        {announcement}
      </div>

      {/* Persistent hint button — also a visible entry point for mouse users */}
      <button
        type="button"
        onClick={openHelp}
        aria-haspopup="dialog"
        aria-label="Show keyboard shortcuts (press ? )"
        className="fixed bottom-4 right-4 z-40 px-3 py-2 text-xs font-medium bg-slate-900 border border-slate-700 text-slate-200 rounded-lg shadow-lg hover:bg-slate-800 hover:border-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
      >
        <span aria-hidden="true" className="mr-1">⌨</span>
        Press <kbd className="mx-1 px-1.5 py-0.5 bg-slate-800 border border-slate-600 rounded text-[10px] font-mono">?</kbd> for shortcuts
      </button>
    </>
  )
}
