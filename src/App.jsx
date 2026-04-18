import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Timeline from './components/Timeline'
import ShortcutsProvider from './components/ShortcutsProvider'

export default function App() {
  return (
    <div className="min-h-screen">
      <a
        href="#hero"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-3 focus:py-2 focus:bg-slate-900 focus:text-white focus:rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
      >
        Skip to main content
      </a>
      <Hero />
      <About />
      <Projects />
      <Timeline />
      <footer className="py-8 text-center text-sm text-slate-500 border-t border-slate-800">
        © 2026 Alex Chen — built with too much coffee ☕
      </footer>
      <ShortcutsProvider />
    </div>
  )
}
