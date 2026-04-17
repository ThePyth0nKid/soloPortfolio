import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Timeline from './components/Timeline'
// 👇 PatchParty agents will add a Contact section here
// import Contact from './components/Contact'

export default function App() {
  return (
    <div className="min-h-screen">
      <Hero />
      <About />
      <Timeline />
      <Projects />
      {/* <Contact /> ← agents add this */}
      <footer className="py-8 text-center text-sm text-slate-500 border-t border-slate-800">
        © 2026 Alex Chen — built with too much coffee ☕
      </footer>
    </div>
  )
}
