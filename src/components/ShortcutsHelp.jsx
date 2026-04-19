import { useEffect, useRef } from 'react'

export const SHORTCUTS = [
  { keys: ['j'], label: 'Next section' },
  { keys: ['k'], label: 'Previous section' },
  { keys: ['g', 't'], label: 'Go to top' },
  { keys: ['G'], label: 'Go to bottom' },
  { keys: ['?'], label: 'Toggle this help' },
  { keys: ['Esc'], label: 'Close dialogs' },
]

function Kbd({ children }) {
  return (
    <kbd className="inline-flex items-center justify-center min-w-[1.75rem] px-2 py-1 bg-slate-800 border border-slate-700 rounded-md text-xs font-mono text-slate-200">
      {children}
    </kbd>
  )
}

export default function ShortcutsHelp({ open, onClose, shortcuts = SHORTCUTS }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    const d = dialogRef.current
    if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose()
      }}
      className="backdrop:bg-slate-950/70 bg-transparent p-0 rounded-xl text-slate-100"
      aria-labelledby="shortcuts-title"
    >
      <div className="w-[min(92vw,28rem)] bg-slate-900 border border-slate-800 rounded-xl shadow-2xl">
        <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h2 id="shortcuts-title" className="text-sm font-semibold tracking-wide text-slate-200">
            Keyboard shortcuts
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-500 hover:text-slate-200 transition-colors text-lg leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </header>
        <ul className="px-6 py-4 space-y-3">
          {shortcuts.map((s) => (
            <li key={s.label} className="flex items-center justify-between gap-4">
              <span className="text-sm text-slate-400">{s.label}</span>
              <span className="flex items-center gap-1">
                {s.keys.map((k, i) => (
                  <span key={i} className="flex items-center gap-1">
                    {i > 0 && <span className="text-[10px] text-slate-600">then</span>}
                    <Kbd>{k}</Kbd>
                  </span>
                ))}
              </span>
            </li>
          ))}
        </ul>
        <footer className="px-6 py-3 border-t border-slate-800 text-[11px] text-slate-500">
          Shortcuts are disabled while typing in a form field.
        </footer>
      </div>
    </dialog>
  )
}
