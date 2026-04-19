export default function KeyPressIndicator({ keys }) {
  if (!keys || keys.length === 0) return null
  return (
    <div
      aria-hidden="true"
      className="key-indicator fixed bottom-20 right-4 z-40 flex items-center gap-1 px-3 py-2 rounded-lg border border-purple-500/30 bg-purple-500/10 backdrop-blur text-xs text-purple-200"
    >
      {keys.map((k, i) => (
        <kbd key={i} className="px-2 py-0.5 rounded border border-purple-400/40 bg-slate-950/60 font-mono text-[11px]">
          {k}
        </kbd>
      ))}
    </div>
  )
}
