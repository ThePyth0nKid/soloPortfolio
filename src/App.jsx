import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Timeline from './components/Timeline'
import ShortcutsHelp from './components/ShortcutsHelp'
import ShortcutToast from './components/ShortcutToast'
import ShortcutsHint from './components/ShortcutsHint'
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts'

export default function App() {
  const { helpOpen, setHelpOpen, toast } = useKeyboardShortcuts()

  return (
    <div className="min-h-screen">
      <Hero />
      <About />
      <Projects />
      <Timeline />
      <footer className="py-8 text-center text-sm text-slate-500 border-t border-slate-800">
        © 2026 Alex Chen — built with too much coffee ☕
      </footer>
      <ShortcutsHint onOpen={() => setHelpOpen(true)} />
      <ShortcutsHelp open={helpOpen} onClose={() => setHelpOpen(false)} />
      <ShortcutToast toast={toast} />
    </div>
  )
}
