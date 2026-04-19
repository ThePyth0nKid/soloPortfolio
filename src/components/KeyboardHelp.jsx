import { forwardRef } from 'react'

const SHORTCUTS = [
  { group: 'Navigation', items: [
    { keys: ['j'], desc: 'Next section' },
    { keys: ['k'], desc: 'Previous section' },
    { keys: ['g', 't'], desc: 'Go to top' },
    { keys: ['G'], desc: 'Go to bottom' },
  ]},
  { group: 'Help', items: [
    { keys: ['?'], desc: 'Toggle this help' },
    { keys: ['Esc'], desc: 'Dismiss' },
  ]},
]

function Kbd({ children }) {
  return (
    <kbd className="inline-flex items-center justify-center min-w-[1.75rem] px-2 py-0.5 bg-slate-800 border border-slate-700 rounded-md text-xs font-mono text-slate-200 shadow-[0_1px_0_rgb(0_0_0/0.4)]">
      {children}
    </kbd>
  )
}

const KeyboardHelp = forwardRef(function KeyboardHelp(_props, ref) {
  return (
    <div
      ref={ref}
      id="keyboard-help"
      popover="auto"
      className="kbd-help"
      aria-label="Keyboard shortcuts"
    >
      <div className="kbd-help__panel">
        <header className="flex items-baseline justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-100">Keyboard shortcuts</h2>
          <button
            type="button"
            popovertarget="keyboard-help"
            popovertargetaction="hide"
            className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
            aria-label="Close"
          >
            Esc ✕
          </button>
        </header>

        <div className="grid gap-6">
          {SHORTCUTS.map((section) => (
            <section key={section.group}>
              <h3 className="text-[0.7rem] uppercase tracking-wider text-slate-500 mb-3">{section.group}</h3>
              <ul className="grid gap-2">
                {section.items.map((item) => (
                  <li key={item.desc} className="flex items-center justify-between gap-4">
                    <span className="text-sm text-slate-300">{item.desc}</span>
                    <span className="flex items-center gap-1">
                      {item.keys.map((k, i) => (
                        <span key={i} className="flex items-center gap-1">
                          {i > 0 && <span className="text-[0.65rem] text-slate-500">then</span>}
                          <Kbd>{k}</Kbd>
                        </span>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <footer className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-500">
          Shortcuts are ignored while typing in form fields.
        </footer>
      </div>
    </div>
  )
})

export default KeyboardHelp
