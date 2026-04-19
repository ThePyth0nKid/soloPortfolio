import { useEffect, useRef } from 'react'

const SHORTCUTS = [
  { keys: ['j'], label: 'Jump to next section' },
  { keys: ['k'], label: 'Jump to previous section' },
  { keys: ['g', 't'], label: 'Go to top' },
  { keys: ['?'], label: 'Show this help' },
  { keys: ['Esc'], label: 'Close this dialog' },
]

export default function ShortcutsHelp({ open, onClose }) {
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
      className="shortcuts-dialog"
    >
      <div className="shortcuts-panel" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-100">Keyboard shortcuts</h2>
            <p className="text-xs text-slate-500 mt-1">Vim-style navigation</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="shortcuts-close"
          >
            ×
          </button>
        </div>
        <ul className="space-y-2">
          {SHORTCUTS.map((s, i) => (
            <li
              key={s.label}
              className="shortcuts-row flex items-center justify-between gap-6 py-2 px-3 rounded-md"
              style={{ animationDelay: `${80 + i * 40}ms` }}
            >
              <span className="text-sm text-slate-300">{s.label}</span>
              <span className="flex items-center gap-1">
                {s.keys.map((k, ki) => (
                  <kbd key={ki} className="kbd">{k}</kbd>
                ))}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-500">
          Shortcuts are ignored while typing in inputs.
        </div>
      </div>
    </dialog>
  )
}
