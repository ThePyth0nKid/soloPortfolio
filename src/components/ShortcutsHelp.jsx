import { useEffect } from 'react'

const SHORTCUTS = [
  { keys: ['j'], description: 'Next section' },
  { keys: ['k'], description: 'Previous section' },
  { keys: ['g', 't'], description: 'Go to top' },
  { keys: ['g', 'b'], description: 'Go to bottom' },
  { keys: ['?'], description: 'Toggle this help' },
  { keys: ['Esc'], description: 'Close this help' },
]

function Kbd({ children }) {
  return (
    <kbd className="inline-flex items-center justify-center min-w-[1.75rem] h-7 px-2 bg-slate-800 border border-slate-700 rounded-md text-xs font-mono text-slate-200">
      {children}
    </kbd>
  )
}

export default function ShortcutsHelp({ open, onClose }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-title"
      className="fixed inset-0 z-50 flex items-center justify-center px-6"
    >
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
      />
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 id="shortcuts-title" className="text-lg font-semibold">
            Keyboard shortcuts
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-200 transition-colors text-sm"
            aria-label="Close help"
          >
            ✕
          </button>
        </div>
        <ul className="space-y-2">
          {SHORTCUTS.map((s) => (
            <li
              key={s.keys.join('+')}
              className="flex items-center justify-between py-1.5"
            >
              <span className="text-sm text-slate-400">{s.description}</span>
              <span className="flex items-center gap-1">
                {s.keys.map((k, i) => (
                  <span key={i} className="flex items-center gap-1">
                    {i > 0 && <span className="text-slate-600 text-xs">then</span>}
                    <Kbd>{k}</Kbd>
                  </span>
                ))}
              </span>
            </li>
          ))}
        </ul>
        <p className="text-xs text-slate-500 pt-2 border-t border-slate-800">
          Shortcuts are disabled while typing in form fields.
        </p>
      </div>
    </div>
  )
}
