import { useEffect, useRef } from 'react'

const SHORTCUTS = [
  { keys: ['j'], desc: 'Next section' },
  { keys: ['k'], desc: 'Previous section' },
  { keys: ['g', 't'], desc: 'Go to top' },
  { keys: ['g', 'b'], desc: 'Go to bottom' },
  { keys: ['?'], desc: 'Show this help' },
  { keys: ['Esc'], desc: 'Close help' },
]

function isEditable(el) {
  if (!el) return false
  const tag = el.tagName
  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    el.isContentEditable
  )
}

export default function KeyboardShortcuts() {
  const dialogRef = useRef(null)
  const gPendingRef = useRef(false)
  const gTimerRef = useRef(null)

  useEffect(() => {
    const getSections = () =>
      Array.from(document.querySelectorAll('section[id], section'))

    const currentIndex = (sections) => {
      const scrollY = window.scrollY
      const viewportMid = scrollY + window.innerHeight / 3
      let idx = 0
      for (let i = 0; i < sections.length; i++) {
        const top = sections[i].getBoundingClientRect().top + scrollY
        if (top <= viewportMid) idx = i
      }
      return idx
    }

    const scrollToSection = (delta) => {
      const sections = getSections()
      if (!sections.length) return
      const idx = currentIndex(sections)
      const next = Math.max(0, Math.min(sections.length - 1, idx + delta))
      sections[next].scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    const clearGPending = () => {
      gPendingRef.current = false
      if (gTimerRef.current) {
        clearTimeout(gTimerRef.current)
        gTimerRef.current = null
      }
    }

    const onKeyDown = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (isEditable(document.activeElement)) return

      const dialog = dialogRef.current
      const dialogOpen = dialog?.open

      if (e.key === 'Escape') {
        if (dialogOpen) dialog.close()
        clearGPending()
        return
      }

      if (e.key === '?') {
        e.preventDefault()
        if (dialog) {
          if (dialogOpen) dialog.close()
          else dialog.showModal()
        }
        clearGPending()
        return
      }

      // don't hijack keys while the help modal is open
      if (dialogOpen) return

      if (gPendingRef.current) {
        if (e.key === 't') {
          e.preventDefault()
          window.scrollTo({ top: 0, behavior: 'smooth' })
          clearGPending()
          return
        }
        if (e.key === 'b') {
          e.preventDefault()
          window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth',
          })
          clearGPending()
          return
        }
        clearGPending()
      }

      if (e.key === 'g') {
        e.preventDefault()
        gPendingRef.current = true
        gTimerRef.current = setTimeout(clearGPending, 1000)
        return
      }

      if (e.key === 'j') {
        e.preventDefault()
        scrollToSection(1)
        return
      }

      if (e.key === 'k') {
        e.preventDefault()
        scrollToSection(-1)
        return
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      clearGPending()
    }
  }, [])

  return (
    <>
      <button
        type="button"
        popovertarget="kbd-hint"
        className="kbd-fab"
        aria-label="Keyboard shortcuts (press ?)"
        onClick={(e) => {
          e.preventDefault()
          dialogRef.current?.showModal()
        }}
      >
        <kbd>?</kbd>
      </button>

      <dialog ref={dialogRef} className="kbd-dialog" aria-labelledby="kbd-title">
        <div className="kbd-dialog__inner">
          <header>
            <h2 id="kbd-title">Keyboard shortcuts</h2>
            <button
              type="button"
              aria-label="Close"
              onClick={() => dialogRef.current?.close()}
              className="kbd-close"
            >
              ×
            </button>
          </header>
          <ul className="kbd-list">
            {SHORTCUTS.map((s) => (
              <li key={s.desc}>
                <span className="kbd-keys">
                  {s.keys.map((k, i) => (
                    <span key={i}>
                      <kbd>{k}</kbd>
                      {i < s.keys.length - 1 && (
                        <span className="kbd-then"> then </span>
                      )}
                    </span>
                  ))}
                </span>
                <span className="kbd-desc">{s.desc}</span>
              </li>
            ))}
          </ul>
          <footer>
            <p>Shortcuts are ignored while typing in form fields.</p>
          </footer>
        </div>
      </dialog>
    </>
  )
}
