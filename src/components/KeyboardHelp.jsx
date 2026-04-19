import { forwardRef } from 'react'

const SHORTCUTS = [
  { keys: ['j'], desc: 'Next section' },
  { keys: ['k'], desc: 'Previous section' },
  { keys: ['g', 't'], desc: 'Go to top' },
  { keys: ['g', 'b'], desc: 'Go to bottom' },
  { keys: ['g', 'g'], desc: 'Go to top (vim-style)' },
  { keys: ['G'], desc: 'Go to bottom (vim-style)' },
  { keys: ['?'], desc: 'Toggle this help' },
  { keys: ['Esc'], desc: 'Close this help' },
]

const KeyboardHelp = forwardRef(function KeyboardHelp(_, ref) {
  return (
    <dialog ref={ref} className="kbd-help" aria-labelledby="kbd-help-title">
      <form method="dialog" className="kbd-help__inner">
        <header className="kbd-help__header">
          <h2 id="kbd-help-title">Keyboard shortcuts</h2>
          <button value="close" className="kbd-help__close" aria-label="Close">×</button>
        </header>
        <dl className="kbd-help__list">
          {SHORTCUTS.map((s) => (
            <div className="kbd-help__row" key={s.desc}>
              <dt>
                {s.keys.map((k, i) => (
                  <span key={i}>
                    <kbd>{k}</kbd>
                    {i < s.keys.length - 1 && <span className="kbd-help__then"> then </span>}
                  </span>
                ))}
              </dt>
              <dd>{s.desc}</dd>
            </div>
          ))}
        </dl>
        <footer className="kbd-help__footer">
          Shortcuts are disabled while typing in form fields.
        </footer>
      </form>
    </dialog>
  )
})

export default KeyboardHelp
