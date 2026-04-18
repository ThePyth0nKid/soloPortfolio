import { useEffect, useRef } from 'react'

const SHORTCUTS = [
  { keys: ['j'], label: 'Next section' },
  { keys: ['k'], label: 'Previous section' },
  { keys: ['g', 't'], label: 'Go to top' },
  { keys: ['g', 'b'], label: 'Go to bottom' },
  { keys: ['?'], label: 'Toggle this help' },
  { keys: ['Esc'], label: 'Close this help' },
]

export default function ShortcutsHelp({ open, onClose }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    if (open && dialogRef.current) {
      dialogRef.current.focus()
    }
  }, [open])

  if (!open) return null

  return (
    <div
      className="shortcuts-overlay fixed inset-0 z-50 flex items-center justify-center px-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Keyboard shortcuts"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="shortcuts-dialog relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-6 outline-none"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Keyboard shortcuts</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="kbd-close w-8 h-8 inline-flex items-center justify-center rounded-md border border-slate-700 text-slate-400 hover:text-slate-100 hover:border-slate-500"
          >
            ✕
          </button>
        </div>
        <ul className="space-y-2">
          {SHORTCUTS.map((s, i) => (
            <li
              key={s.label}
              className="shortcut-row flex items-center justify-between py-1.5"
              style={{ animationDelay: `${i * 35}ms` }}
            >
              <span className="text-sm text-slate-300">{s.label}</span>
              <span className="flex gap-1">
                {s.keys.map((k, idx) => (
                  <kbd
                    key={idx}
                    className="kbd px-2 min-w-[1.75rem] h-7 inline-flex items-center justify-center text-xs font-mono bg-slate-800 border border-slate-700 border-b-2 rounded text-slate-100"
                  >
                    {k}
                  </kbd>
                ))}
              </span>
            </li>
          ))}
        </ul>
        <p className="text-xs text-slate-500 mt-5 pt-4 border-t border-slate-800">
          Press <kbd className="kbd px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 border border-slate-700 rounded">?</kbd> anytime to toggle this.
        </p>
      </div>
    </div>
  )
}
