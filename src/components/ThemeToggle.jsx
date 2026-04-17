import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('theme')
    if (saved) return saved === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    const root = document.documentElement
    if (dark) {
      root.classList.add('dark')
      document.body.classList.remove('bg-white', 'text-slate-900')
      document.body.classList.add('bg-slate-950', 'text-slate-100')
    } else {
      root.classList.remove('dark')
      document.body.classList.remove('bg-slate-950', 'text-slate-100')
      document.body.classList.add('bg-white', 'text-slate-900')
    }
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  return (
    <button
      onClick={() => setDark(d => !d)}
      aria-label="Toggle theme"
      className="fixed top-4 right-4 z-50 p-2 rounded-lg border border-slate-700 bg-slate-900/70 hover:border-slate-500 text-slate-100 backdrop-blur"
    >
      {dark ? '☀️' : '🌙'}
    </button>
  )
}
