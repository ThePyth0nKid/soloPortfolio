import { useEffect } from 'react'

const isEditableTarget = (target) => {
  if (!target) return false
  const tag = target.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true
  if (target.isContentEditable) return true
  return false
}

/**
 * Vim-style keyboard shortcut engine.
 *
 * shortcuts: Array<{ keys: string | string[], handler: (e) => void }>
 *  - keys: a single key ('j') or a sequence (['g', 't'])
 *
 * Sequences time out after 1s. Shortcuts are skipped when focus is
 * inside a form input or contenteditable element.
 */
export function useKeyboardShortcuts(shortcuts, { enabled = true } = {}) {
  useEffect(() => {
    if (!enabled) return

    let buffer = []
    let timer = null

    const resetBuffer = () => {
      buffer = []
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
    }

    const handleKeyDown = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (isEditableTarget(e.target)) return

      const key = e.key
      buffer.push(key)

      const bufferStr = buffer.join(' ')

      let matched = false
      let hasPrefix = false

      for (const shortcut of shortcuts) {
        const seq = Array.isArray(shortcut.keys) ? shortcut.keys : [shortcut.keys]
        const seqStr = seq.join(' ')

        if (seqStr === bufferStr) {
          e.preventDefault()
          shortcut.handler(e)
          matched = true
          break
        }

        if (seqStr.startsWith(bufferStr + ' ')) {
          hasPrefix = true
        }
      }

      if (matched) {
        resetBuffer()
        return
      }

      if (hasPrefix) {
        if (timer) clearTimeout(timer)
        timer = setTimeout(resetBuffer, 1000)
      } else {
        resetBuffer()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      if (timer) clearTimeout(timer)
    }
  }, [shortcuts, enabled])
}
