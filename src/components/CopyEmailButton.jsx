import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Duration (ms) to show the "Copied!" confirmation state before reverting.
 */
const COPIED_FEEDBACK_MS = 2000

/**
 * Fallback copy strategy for environments where navigator.clipboard is
 * unavailable (e.g. insecure contexts, older browsers). Uses a hidden
 * textarea + document.execCommand('copy').
 *
 * @param {string} text - The text to place on the clipboard.
 * @returns {boolean} true if the copy succeeded, false otherwise.
 */
function legacyCopyToClipboard(text) {
  if (typeof document === 'undefined') return false

  const textarea = document.createElement('textarea')
  textarea.value = text
  // Prevent scrolling to bottom of page in MS Edge.
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'absolute'
  textarea.style.left = '-9999px'
  document.body.appendChild(textarea)

  try {
    textarea.select()
    return document.execCommand('copy')
  } catch {
    return false
  } finally {
    document.body.removeChild(textarea)
  }
}

/**
 * Copy arbitrary text to the clipboard. Prefers the async Clipboard API,
 * falls back to the legacy execCommand approach.
 *
 * @param {string} text
 * @returns {Promise<boolean>} true on success.
 */
async function copyToClipboard(text) {
  if (typeof text !== 'string' || text.length === 0) {
    throw new Error('copyToClipboard: `text` must be a non-empty string.')
  }

  if (
    typeof navigator !== 'undefined' &&
    navigator.clipboard &&
    typeof navigator.clipboard.writeText === 'function'
  ) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      // Fall through to legacy path.
    }
  }

  return legacyCopyToClipboard(text)
}

/**
 * A small icon button that copies the supplied `email` string to the
 * user's clipboard. On success it swaps to a check icon and shows a
 * brief tooltip ("Copied!"); on failure it shows "Copy failed".
 *
 * @param {{ email: string, className?: string }} props
 */
export default function CopyEmailButton({ email, className = '' }) {
  if (typeof email !== 'string' || email.length === 0) {
    throw new Error('<CopyEmailButton /> requires a non-empty `email` prop.')
  }

  /** @type {['idle' | 'copied' | 'error', Function]} */
  const [status, setStatus] = useState('idle')
  const timeoutRef = useRef(/** @type {number | null} */ (null))

  // Cleanup any pending timeout on unmount to avoid state updates on
  // an unmounted component.
  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleClick = useCallback(async () => {
    let ok = false
    try {
      ok = await copyToClipboard(email)
    } catch {
      ok = false
    }

    setStatus(ok ? 'copied' : 'error')

    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = window.setTimeout(() => {
      setStatus('idle')
      timeoutRef.current = null
    }, COPIED_FEEDBACK_MS)
  }, [email])

  const tooltip =
    status === 'copied'
      ? 'Copied!'
      : status === 'error'
        ? 'Copy failed'
        : 'Copy email'

  return (
    <span className={`relative inline-flex items-center ${className}`}>
      <button
        type="button"
        onClick={handleClick}
        aria-label={`Copy email address ${email} to clipboard`}
        title={tooltip}
        className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-slate-700 bg-slate-800/60 hover:border-slate-500 hover:bg-slate-800 transition-colors text-slate-300"
        data-testid="copy-email-button"
        data-status={status}
      >
        {status === 'copied' ? (
          // Check icon
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4 text-green-400"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M16.704 5.296a1 1 0 010 1.414l-7.5 7.5a1 1 0 01-1.414 0l-3.5-3.5a1 1 0 011.414-1.414L8.5 12.09l6.79-6.793a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          // Clipboard icon
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4"
            aria-hidden="true"
          >
            <path d="M8 2a2 2 0 00-2 2H5a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2h-1a2 2 0 00-2-2H8zm0 2h4v1H8V4z" />
          </svg>
        )}
      </button>

      {/* Tooltip — only rendered while in a non-idle state so it acts
          as feedback for the copy action. */}
      {status !== 'idle' && (
        <span
          role="status"
          aria-live="polite"
          className={`pointer-events-none absolute left-1/2 -translate-x-1/2 -top-8 whitespace-nowrap px-2 py-1 text-xs rounded-md border shadow-md ${
            status === 'copied'
              ? 'bg-green-500/10 border-green-500/40 text-green-300'
              : 'bg-red-500/10 border-red-500/40 text-red-300'
          }`}
        >
          {tooltip}
        </span>
      )}
    </span>
  )
}
