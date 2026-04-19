import { useEffect, useRef } from 'react'

const SHORTCUTS = [
  { keys: ['j'], description: 'Jump to next section' },
  { keys: ['k'], description: 'Jump to previous section' },
  { keys: ['g', 't'], description: 'Go to top of page' },
  { keys: ['?'], description: 'Show this shortcuts help' },
  { keys: ['Esc'], description: 'Close this dialog' },
]

export default function ShortcutsHelp({ open, onClose }) {
  const dialogRef = useRef(null)
  const closeBtnRef = useRef(null)
  const previouslyFocused = useRef(null)

  // Manage the native <dialog>'s open state and focus.
  useEffect(() => {
    const d = dialogRef.current
    if (!d) return

    if (open && !d.open) {
      previouslyFocused.current = document.activeElement
      d.showModal()
      // Focus the close button for a predictable starting point.
      requestAnimationFrame(() => closeBtnRef.current?.focus())
    } else if (!open && d.open) {
      d.close()
      // Restore focus to the element that opened the dialog.
      const prev = previouslyFocused.current
      if (prev && typeof prev.focus === 'function') {
        prev.focus()
      }
    }
  }, [open])

  // Handle the dialog's native close event (e.g. Esc via browser) so state stays in sync.
  useEffect(() => {
    const d = dialogRef.current
    if (!d) return
    const handleClose = () => onClose()
    d.addEventListener('close', handleClose)
    return () => d.removeEventListener('close', handleClose)
  }, [onClose])

  // Click on the backdrop closes. The <dialog>::backdrop is the area outside the panel.
  const handleDialogClick = (e) => {
    if (e.target === dialogRef.current) {
      onClose()
    }
  }

  return (
    <dialog
      ref={dialogRef}
      onClick={handleDialogClick}
      aria-labelledby="shortcuts-title"
      aria-describedby="shortcuts-desc"
      className="backdrop:bg-slate-950/80 bg-transparent p-0 m-auto max-w-lg w-full"
    >
      <div
        className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl text-slate-100"
        // Stop clicks inside the panel from bubbling to the dialog (which would close it).
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-slate-800">
          <div>
            <h2 id="shortcuts-title" className="text-lg font-semibold">
              Keyboard shortcuts
            </h2>
            <p id="shortcuts-desc" className="text-sm text-slate-400 mt-1">
              Navigate the page without a mouse.
            </p>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Close keyboard shortcuts"
            className="shrink-0 w-8 h-8 inline-flex items-center justify-center rounded-md text-slate-400 hover:text-slate-100 hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <ul className="px-6 py-4 divide-y divide-slate-800">
          {SHORTCUTS.map((s) => (
            <li key={s.description} className="flex items-center justify-between gap-4 py-3">
              <span className="text-sm text-slate-200">{s.description}</span>
              <span className="flex items-center gap-1">
                {s.keys.map((k, i) => (
                  <span key={i} className="flex items-center gap-1">
                    {i > 0 && (
                      <span className="text-xs text-slate-500" aria-hidden="true">
                        then
                      </span>
                    )}
                    <kbd className="px-2 py-0.5 bg-slate-800 border border-slate-600 rounded text-xs font-mono text-slate-100 min-w-[1.75rem] text-center">
                      {k}
                    </kbd>
                  </span>
                ))}
              </span>
            </li>
          ))}
        </ul>

        <div className="px-6 py-3 border-t border-slate-800 text-xs text-slate-500">
          Shortcuts are disabled while typing in form fields.
        </div>
      </div>
    </dialog>
  )
}
