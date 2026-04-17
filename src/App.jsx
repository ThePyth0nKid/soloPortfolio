import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import ThemeToggle from './components/ThemeToggle'
// 👇 PatchParty agents will add a Contact section here
// import Contact from './components/Contact'

export default function App() {
  return (
    <div className="min-h-screen">
      {/* Floating theme toggle — fixed top-right, always accessible */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <Hero />
      <About />
      <Projects />
      {/* <Contact /> ← agents add this */}
      <footer className="py-8 text-center text-sm text-slate-500 border-t border-slate-200 dark:border-slate-800 transition-colors">
        © 2026 Alex Chen — built with too much coffee ☕
      </footer>
    </div>
  )
}
