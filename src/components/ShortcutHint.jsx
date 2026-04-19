export default function ShortcutHint({ onOpen }) {
  return (
    <button
      onClick={onOpen}
      aria-label="Show keyboard shortcuts"
      className="shortcut-hint"
    >
      Press <kbd className="kbd kbd-sm">?</kbd> for shortcuts
    </button>
  )
}
