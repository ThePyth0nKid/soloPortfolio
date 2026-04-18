export default function ShortcutsHint({ onOpen }) {
  return (
    <button
      onClick={onOpen}
      aria-label="Show keyboard shortcuts"
      className="shortcuts-hint fixed bottom-4 right-4 z-30 px-2.5 py-1.5 bg-slate-900/80 backdrop-blur border border-slate-800 hover:border-slate-600 rounded-md text-[11px] font-mono text-slate-400 hover:text-slate-100 flex items-center gap-1.5"
    >
      Press
      <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 border-b-2 rounded text-slate-100">?</kbd>
      for shortcuts
    </button>
  )
}
