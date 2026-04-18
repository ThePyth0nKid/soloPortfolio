import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Timeline from './components/Timeline'
import ThemeToggle from './components/ThemeToggle'

export default function App() {
  return (
    <div className="min-h-screen">
      <ThemeToggle />
      <Hero />
      <About />
      <Projects />
      <Timeline />
      <footer className="py-8 text-center text-sm text-slate-500 border-t border-slate-200 dark:border-slate-800">
        © 2026 Alex Chen — built with too much coffee ☕
      </footer>
    </div>
  )
}
