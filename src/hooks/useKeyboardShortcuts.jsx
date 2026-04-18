import { useEffect, useState, useCallback, useRef } from 'react'

const SECTION_IDS = ['hero', 'about', 'projects', 'timeline']

function isEditableTarget(target) {
  if (!target) return false
  const tag = target.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true
  if (target.isContentEditable) return true
  // Also skip when focus is inside any role="dialog" that isn't our shortcuts help
  return false
}

function getSectionElements() {
  // Hero has no id in the existing markup; we'll add it, but fall back defensively.
  return SECTION_IDS
    .map((id) => document.getElementById(id))
    .filter(Boolean)
}

function scrollToElement(el) {
  if (!el) return
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollIntoView({
    behavior: prefersReducedMotion ? 'auto' : 'smooth',
    block: 'start',
  })
  // Move focus to the section heading for screen reader users.
  const heading = el.querySelector('h1, h2, h3') || el
  const prevTabIndex = heading.getAttribute('tabindex')
  heading.setAttribute('tabindex', '-1')
  heading.focus({ preventScroll: true })
  // Clean up the tabindex after blur so it doesn't linger in the tab order.
  const cleanup = () => {
    if (prevTabIndex === null) heading.removeAttribute('tabindex')
    else heading.setAttribute('tabindex', prevTabIndex)
    heading.removeEventListener('blur', cleanup)
  }
  heading.addEventListener('blur', cleanup)
}

export function useKeyboardShortcuts({ onShowHelp, announce } = {}) {
  const gPressedRef = useRef({ active: false, timer: null })

  const moveSection = useCallback((direction) => {
    const sections = getSectionElements()
    if (sections.length === 0) return
    const scrollY = window.scrollY + 80 // fudge for fixed headers / padding
    let currentIndex = 0
    for (let i = 0; i < sections.length; i++) {
      if (sections[i].offsetTop <= scrollY) currentIndex = i
    }
    const nextIndex = Math.max(0, Math.min(sections.length - 1, currentIndex + direction))
    const target = sections[nextIndex]
    scrollToElement(target)
    if (announce) {
      const heading = target.querySelector('h1, h2, h3')
      announce(`Moved to ${heading ? heading.textContent : target.id} section`)
    }
  }, [announce])

  useEffect(() => {
    function handleKeyDown(e) {
      // Ignore if modifier keys — don't hijack browser shortcuts.
      if (e.ctrlKey || e.metaKey || e.altKey) return
      // Skip when typing in form fields.
      if (isEditableTarget(e.target)) return

      const key = e.key

      // "g" then "t" -> scroll to top
      if (key === 'g') {
        gPressedRef.current.active = true
        if (gPressedRef.current.timer) clearTimeout(gPressedRef.current.timer)
        gPressedRef.current.timer = setTimeout(() => {
          gPressedRef.current.active = false
        }, 1000)
        return
      }

      if (gPressedRef.current.active && key === 't') {
        e.preventDefault()
        gPressedRef.current.active = false
        if (gPressedRef.current.timer) clearTimeout(gPressedRef.current.timer)
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' })
        const firstHeading = document.querySelector('h1')
        if (firstHeading) {
          firstHeading.setAttribute('tabindex', '-1')
          firstHeading.focus({ preventScroll: true })
        }
        if (announce) announce('Jumped to top of page')
        return
      }

      // Any other key breaks the "g" sequence.
      gPressedRef.current.active = false

      if (key === 'j') {
        e.preventDefault()
        moveSection(1)
      } else if (key === 'k') {
        e.preventDefault()
        moveSection(-1)
      } else if (key === '?' || (e.shiftKey && key === '/')) {
        e.preventDefault()
        if (onShowHelp) onShowHelp()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      if (gPressedRef.current.timer) clearTimeout(gPressedRef.current.timer)
    }
  }, [moveSection, onShowHelp, announce])
}

export const SHORTCUTS = [
  { keys: ['j'], description: 'Move to next section' },
  { keys: ['k'], description: 'Move to previous section' },
  { keys: ['g', 't'], description: 'Jump to top of page' },
  { keys: ['?'], description: 'Show this help dialog' },
  { keys: ['Esc'], description: 'Close this help dialog' },
]
