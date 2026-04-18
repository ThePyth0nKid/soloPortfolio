import { useEffect, useRef } from 'react'
import { SHORTCUTS } from '../hooks/useKeyboardShortcuts'

export default function ShortcutsHelp({ open, onClose }) {
  const dialogRef = useRef(null)
  const closeButtonRef = useRef(null)
  const previouslyFocusedRef = useRef(null)

  useEffect(() => {
    if (!open) return

    previouslyFocusedRef.current = document.activeElement

    // Focus the close button on open.
    const raf = requestAnimationFrame(() => {
      if (closeButtonRef.current) closeButtonRef.current.focus()
    })

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
        onClose()
        return
      }
      if (e.key === 'Tab') {
        // Focus trap
        const dialog = dialogRef.current
        if (!dialog) return
        const focusables = dialog.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (focusables.length === 0) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown, true)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('keydown', handleKeyDown, true)
      document.body.style.overflow = prevOverflow
      // Restore focus
      if (previouslyFocusedRef.current && previouslyFocusedRef.current.focus) {
        previouslyFocusedRef.current.focus()
      }
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 motion-safe:animate-[fadeIn_120ms_ease-out]"
      aria-hidden="false"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close keyboard shortcuts dialog"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm focus:outline-none"
        tabIndex={-1}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-title"
        aria-describedby="shortcuts-desc"
        className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-6 space-y-4"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="shortcuts-title" className="text-xl font-bold text-slate-100">
              Keyboard shortcuts
            </h2>
            <p id="shortcuts-desc" className="text-sm text-slate-400 mt-1">
              Navigate the page without touching your mouse.
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="shrink-0 p-1.5 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <ul className="divide-y divide-slate-800 border border-slate-800 rounded-lg overflow-hidden">
          {SHORTCUTS.map((s) => (
            <li key={s.keys.join('+')} className="flex items-center justify-between gap-4 px-4 py-3">
              <span className="text-sm text-slate-200">{s.description}</span>
              <span className="flex items-center gap-1">
                {s.keys.map((k, i) => (
                  <kbd
                    key={i}
                    className="px-2 py-0.5 text-xs font-mono bg-slate-800 border border-slate-600 text-slate-100 rounded shadow-sm"
                  >
                    {k}
                  </kbd>
                ))}
              </span>
            </li>
          ))}
        </ul>

        <p className="text-xs text-slate-500">
          Shortcuts are ignored while typing in a form field.
        </p>
      </div>
    </div>
  )
}
