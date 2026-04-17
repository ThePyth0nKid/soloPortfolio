import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Timeline from './components/Timeline'

export default function App() {
  return (
    <div className="min-h-screen">
      <Hero />
      <About />
      <Timeline />
      <Projects />
      <footer className="py-8 text-center text-sm text-slate-400 border-t border-slate-800">
        © 2026 Alex Chen — built with too much coffee ☕
      </footer>
    </div>
  )
}
