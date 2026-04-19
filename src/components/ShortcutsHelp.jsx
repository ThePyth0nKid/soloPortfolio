import { useEffect, useRef } from 'react'

export const SHORTCUTS = [
  { keys: ['j'], description: 'Next section' },
  { keys: ['k'], description: 'Previous section' },
  { keys: ['g', 't'], description: 'Scroll to top' },
  { keys: ['?'], description: 'Toggle this help' },
  { keys: ['Esc'], description: 'Close dialogs' },
]

function Kbd({ children }) {
  return (
    <kbd className="inline-flex items-center justify-center min-w-[1.75rem] px-2 py-1 bg-slate-800 border border-slate-700 rounded-md text-xs font-medium text-slate-200 shadow-sm">
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
      className="backdrop:bg-slate-950/70 bg-transparent p-0 rounded-xl"
    >
      <div className="w-[min(92vw,28rem)] bg-slate-900 border border-slate-800 rounded-xl shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h2 className="text-base font-semibold text-slate-100">Keyboard shortcuts</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-slate-400 hover:text-slate-200 transition-colors text-lg leading-none"
          >
            ×
          </button>
        </div>
        <ul className="px-6 py-4 space-y-3">
          {shortcuts.map((s) => (
            <li key={s.keys.join('+')} className="flex items-center justify-between gap-4">
              <span className="text-sm text-slate-300">{s.description}</span>
              <span className="flex items-center gap-1">
                {s.keys.map((k, i) => (
                  <span key={i} className="flex items-center gap-1">
                    {i > 0 && <span className="text-xs text-slate-500">then</span>}
                    <Kbd>{k}</Kbd>
                  </span>
                ))}
              </span>
            </li>
          ))}
        </ul>
        <div className="px-6 py-3 border-t border-slate-800 text-xs text-slate-500">
          Shortcuts are disabled while typing in inputs.
        </div>
      </div>
    </dialog>
  )
}
