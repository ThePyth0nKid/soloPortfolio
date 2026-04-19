import { useEffect, useRef } from 'react'

const SHORTCUTS = [
  { keys: ['j'], description: 'Move to next section' },
  { keys: ['k'], description: 'Move to previous section' },
  { keys: ['g', 't'], description: 'Go to top of page' },
  { keys: ['?'], description: 'Show this help dialog' },
  { keys: ['Esc'], description: 'Close this dialog' },
]

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])'

export default function ShortcutsHelp({ open, onClose }) {
  const dialogRef = useRef(null)
  const closeBtnRef = useRef(null)

  // Open/close the native dialog imperatively so we get the platform
  // modal semantics (role="dialog", aria-modal, inert background).
  useEffect(() => {
    const d = dialogRef.current
    if (!d) return
    if (open && !d.open) {
      d.showModal()
      // Move focus to the close button for a predictable starting point.
      window.requestAnimationFrame(() => closeBtnRef.current?.focus())
    } else if (!open && d.open) {
      d.close()
    }
  }, [open])

  // Handle the dialog's native close event (Esc, form method=dialog).
  useEffect(() => {
    const d = dialogRef.current
    if (!d) return
    const handleClose = () => onClose?.()
    const handleCancel = (e) => {
      // Let the default close happen, but notify parent.
      e.preventDefault()
      onClose?.()
    }
    d.addEventListener('close', handleClose)
    d.addEventListener('cancel', handleCancel)
    return () => {
      d.removeEventListener('close', handleClose)
      d.removeEventListener('cancel', handleCancel)
    }
  }, [onClose])

  // Focus trap — <dialog> with showModal() handles most of this, but we
  // wrap Tab to be safe across browsers.
  const onKeyDown = (e) => {
    if (e.key !== 'Tab') return
    const d = dialogRef.current
    if (!d) return
    const focusables = Array.from(d.querySelectorAll(FOCUSABLE)).filter(
      (el) => !el.hasAttribute('disabled') && el.offsetParent !== null,
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

  // Click on the backdrop (outside the inner panel) closes the dialog.
  const onBackdropClick = (e) => {
    if (e.target === dialogRef.current) onClose?.()
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="shortcuts-title"
      aria-describedby="shortcuts-desc"
      onKeyDown={onKeyDown}
      onClick={onBackdropClick}
      className="backdrop:bg-slate-950/70 bg-transparent p-0 m-auto rounded-xl open:animate-none motion-reduce:transition-none"
    >
      <div
        className="w-[min(92vw,32rem)] bg-slate-900 border border-slate-700 rounded-xl shadow-2xl text-slate-100"
      >
        <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-3 border-b border-slate-800">
          <div>
            <h2 id="shortcuts-title" className="text-lg font-semibold">
              Keyboard shortcuts
            </h2>
            <p id="shortcuts-desc" className="text-sm text-slate-400 mt-1">
              Navigate the page without leaving the keyboard.
            </p>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            aria-label="Close shortcuts dialog"
          >
            <span aria-hidden="true" className="text-lg leading-none">
              ×
            </span>
          </button>
        </div>

        <ul className="px-6 py-4 space-y-3">
          {SHORTCUTS.map((s) => (
            <li
              key={s.keys.join('+')}
              className="flex items-center justify-between gap-4"
            >
              <span className="text-sm text-slate-200">{s.description}</span>
              <span className="flex items-center gap-1" aria-hidden="true">
                {s.keys.map((k, i) => (
                  <span key={i} className="flex items-center gap-1">
                    {i > 0 && (
                      <span className="text-xs text-slate-500">then</span>
                    )}
                    <kbd className="min-w-[1.75rem] px-2 py-1 text-center bg-slate-800 border border-slate-600 rounded text-xs font-mono text-slate-100">
                      {k}
                    </kbd>
                  </span>
                ))}
              </span>
              <span className="sr-only">
                Shortcut: {s.keys.join(' then ')}
              </span>
            </li>
          ))}
        </ul>

        <div className="px-6 pb-5 pt-2 border-t border-slate-800">
          <p className="text-xs text-slate-500">
            Shortcuts are ignored while typing in a form field.
          </p>
        </div>
      </div>
    </dialog>
  )
}
