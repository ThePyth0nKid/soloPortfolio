import { useEffect, useRef } from 'react'

const SHORTCUTS = [
  { keys: ['j'], label: 'Next section' },
  { keys: ['k'], label: 'Previous section' },
  { keys: ['g', 't'], label: 'Jump to top' },
  { keys: ['?'], label: 'Show this help' },
  { keys: ['Esc'], label: 'Close this help' },
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
      <div className="shortcuts-panel w-[min(92vw,440px)] rounded-2xl border border-slate-800 bg-slate-950/95 backdrop-blur-xl p-6 text-slate-100 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold tracking-tight">Keyboard shortcuts</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="h-8 w-8 grid place-items-center rounded-md text-slate-400 hover:text-slate-100 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 transition-[transform,background-color,color] duration-200 ease-out active:scale-90"
          >
            ✕
          </button>
        </div>
        <ul className="space-y-2">
          {SHORTCUTS.map((s, i) => (
            <li
              key={s.label}
              className="shortcut-row flex items-center justify-between gap-4 py-2 px-3 rounded-lg hover:bg-slate-900 transition-colors duration-200"
              style={{ animationDelay: `${60 + i * 40}ms` }}
            >
              <span className="text-sm text-slate-300">{s.label}</span>
              <span className="flex items-center gap-1">
                {s.keys.map((k, j) => (
                  <span key={j} className="flex items-center gap-1">
                    {j > 0 && <span className="text-[10px] text-slate-600">then</span>}
                    <kbd className="px-2 py-1 min-w-[28px] text-center text-xs font-mono font-medium rounded-md border border-slate-700 bg-slate-900 text-slate-200 shadow-[0_2px_0_0_theme(colors.slate.800)]">
                      {k}
                    </kbd>
                  </span>
                ))}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-5 pt-4 border-t border-slate-800 text-xs text-slate-500">
          Shortcuts are disabled while typing in a form.
        </p>
      </div>
    </dialog>
  )
}
