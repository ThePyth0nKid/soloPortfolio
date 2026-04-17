import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'

export default function App() {
  return (
    <div className="min-h-screen">
      <Hero />
      <About />
      <Skills />
      <Projects />
      <footer className="py-8 text-center text-sm text-slate-500 border-t border-slate-800">
        © 2026 Alex Chen — built with too much coffee ☕
      </footer>
    </div>
  )
}
