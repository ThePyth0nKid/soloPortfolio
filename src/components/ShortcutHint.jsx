export default function ShortcutHint({ onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="Show keyboard shortcuts"
      className="shortcut-hint fixed bottom-4 right-4 z-40 flex items-center gap-2 px-3 py-2 rounded-full border border-slate-800 bg-slate-900/80 backdrop-blur text-xs text-slate-400 hover:text-slate-100 hover:border-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 transition-[transform,color,border-color] duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
    >
      <kbd className="px-1.5 py-0.5 rounded border border-slate-700 bg-slate-950 font-mono text-[10px] text-slate-200">?</kbd>
      <span>shortcuts</span>
    </button>
  )
}
