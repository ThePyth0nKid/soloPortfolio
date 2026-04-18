export default function ShortcutToast({ toast }) {
  if (!toast) return null
  return (
    <div
      key={toast.id}
      className="shortcut-toast fixed bottom-6 left-1/2 -translate-x-1/2 z-40 px-3 py-1.5 bg-slate-900/90 backdrop-blur border border-slate-700 rounded-md text-xs font-mono text-slate-200 shadow-lg pointer-events-none"
      aria-live="polite"
    >
      {toast.text}
    </div>
  )
}
