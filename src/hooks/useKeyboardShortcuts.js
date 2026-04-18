import { useEffect, useRef, useState } from 'react'

const SECTION_IDS = ['hero', 'about', 'projects', 'timeline']

function isEditable(el) {
  if (!el) return false
  const tag = el.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true
  if (el.isContentEditable) return true
  return false
}

function getSectionTops() {
  return SECTION_IDS
    .map((id) => {
      const el = id === 'hero' ? document.querySelector('section') : document.getElementById(id)
      if (!el) return null
      return { id, top: el.getBoundingClientRect().top + window.scrollY }
    })
    .filter(Boolean)
}

function scrollToSection(index) {
  const sections = getSectionTops()
  if (!sections.length) return
  const clamped = Math.max(0, Math.min(sections.length - 1, index))
  window.scrollTo({ top: sections[clamped].top - 8, behavior: 'smooth' })
  const target = document.getElementById(sections[clamped].id) || document.querySelector('section')
  if (target) {
    target.classList.remove('section-flash')
    // force reflow so the animation can replay
    void target.offsetWidth
    target.classList.add('section-flash')
  }
}

function currentSectionIndex() {
  const sections = getSectionTops()
  const y = window.scrollY + 80
  let idx = 0
  for (let i = 0; i < sections.length; i++) {
    if (sections[i].top <= y) idx = i
  }
  return idx
}

export default function useKeyboardShortcuts() {
  const [helpOpen, setHelpOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const gPendingRef = useRef(false)
  const gTimerRef = useRef(null)
  const toastTimerRef = useRef(null)

  const showToast = (text) => {
    setToast({ text, id: Date.now() })
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    toastTimerRef.current = setTimeout(() => setToast(null), 1100)
  }

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (isEditable(document.activeElement)) return

      // Help modal — ? (shift + /)
      if (e.key === '?') {
        e.preventDefault()
        setHelpOpen((v) => !v)
        return
      }

      if (e.key === 'Escape' && helpOpen) {
        e.preventDefault()
        setHelpOpen(false)
        return
      }

      // When modal is open, swallow nav keys
      if (helpOpen) return

      // g then t → scroll to top
      if (e.key === 'g') {
        e.preventDefault()
        if (gPendingRef.current) {
          gPendingRef.current = false
          clearTimeout(gTimerRef.current)
        } else {
          gPendingRef.current = true
          showToast('g…')
          gTimerRef.current = setTimeout(() => {
            gPendingRef.current = false
          }, 900)
        }
        return
      }

      if (gPendingRef.current && e.key === 't') {
        e.preventDefault()
        gPendingRef.current = false
        clearTimeout(gTimerRef.current)
        window.scrollTo({ top: 0, behavior: 'smooth' })
        showToast('↑ top')
        return
      }

      if (gPendingRef.current && e.key === 'b') {
        e.preventDefault()
        gPendingRef.current = false
        clearTimeout(gTimerRef.current)
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
        showToast('↓ bottom')
        return
      }

      // Any other key cancels the g prefix
      if (gPendingRef.current) {
        gPendingRef.current = false
        clearTimeout(gTimerRef.current)
      }

      if (e.key === 'j') {
        e.preventDefault()
        scrollToSection(currentSectionIndex() + 1)
        showToast('↓ next')
        return
      }

      if (e.key === 'k') {
        e.preventDefault()
        scrollToSection(currentSectionIndex() - 1)
        showToast('↑ prev')
        return
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      clearTimeout(gTimerRef.current)
      clearTimeout(toastTimerRef.current)
    }
  }, [helpOpen])

  return { helpOpen, setHelpOpen, toast }
}
