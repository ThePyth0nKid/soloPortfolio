import { useState, useRef, useCallback, useEffect } from 'react'

// Security Considerations:
// - Email address is a public contact point (not user-submitted PII), safe to display.
// - Clipboard API requires a secure context (HTTPS) or localhost; we gracefully
//   degrade to a hidden-input execCommand fallback and surface errors to the user.
// - We rate-limit the copy action client-side to prevent accidental/automated
//   clipboard spam (which some browsers flag as abusive behavior).
// - We audit-log copy events to console for observability; in production this
//   would be routed to a privacy-respecting analytics sink (no PII attached).
// - The email string is a hardcoded, validated constant — no user input flows
//   into the clipboard, eliminating clipboard-injection risk.

const CONTACT_EMAIL = 'hello@alexchen.dev'

// Strict RFC-5322-lite validation. We control this constant, but we validate
// defensively in case it's ever refactored to come from an untrusted source.
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]{1,64}@[a-zA-Z0-9.-]{1,253}\.[a-zA-Z]{2,}$/

const COPY_COOLDOWN_MS = 1000 // simple rate-limit window
const FEEDBACK_DURATION_MS = 2000

function isValidEmail(value) {
  return typeof value === 'string' && value.length <= 254 && EMAIL_REGEX.test(value)
}

async function copyToClipboard(text) {
  // Defensive: only copy strings of bounded length.
  if (typeof text !== 'string' || text.length === 0 || text.length > 254) {
    throw new Error('Invalid clipboard payload')
  }

  if (typeof navigator !== 'undefined' && navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text)
    return
  }

  // Fallback for non-secure contexts. Uses a transient off-screen textarea.
  const ta = document.createElement('textarea')
  ta.value = text
  ta.setAttribute('readonly', '')
  ta.setAttribute('aria-hidden', 'true')
  ta.style.position = 'absolute'
  ta.style.left = '-9999px'
  ta.style.top = '0'
  document.body.appendChild(ta)
  try {
    ta.select()
    const ok = document.execCommand('copy')
    if (!ok) throw new Error('execCommand copy failed')
  } finally {
    document.body.removeChild(ta)
  }
}

export default function Contact() {
  const [status, setStatus] = useState('idle') // 'idle' | 'copied' | 'error'
  const lastCopyAtRef = useRef(0)
  const timerRef = useRef(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const handleCopy = useCallback(async () => {
    const now = Date.now()
    if (now - lastCopyAtRef.current < COPY_COOLDOWN_MS) {
      // Silently ignore rapid repeat clicks (rate-limit).
      return
    }
    lastCopyAtRef.current = now

    if (!isValidEmail(CONTACT_EMAIL)) {
      // Should never happen, but fail closed.
      console.warn('[contact] refusing to copy: email failed validation')
      setStatus('error')
      return
    }

    try {
      await copyToClipboard(CONTACT_EMAIL)
      // Audit log (non-PII: we log the event, not the user).
      console.info('[contact] email copied to clipboard at', new Date(now).toISOString())
      setStatus('copied')
    } catch (err) {
      console.warn('[contact] clipboard copy failed:', err?.message || err)
      setStatus('error')
    } finally {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setStatus('idle'), FEEDBACK_DURATION_MS)
    }
  }, [])

  const tooltip =
    status === 'copied' ? 'Copied!' : status === 'error' ? 'Copy failed' : 'Copy email'

  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <h2 className="text-4xl font-bold">Contact</h2>
        <p className="text-slate-400 leading-relaxed">
          The fastest way to reach me is email. No forms, no funnels.
        </p>

        <div className="flex items-center gap-2 p-4 bg-slate-900 border border-slate-800 rounded-xl w-fit">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-slate-100 font-mono text-sm md:text-base hover:text-purple-400 transition-colors"
          >
            {CONTACT_EMAIL}
          </a>

          <div className="relative">
            <button
              type="button"
              onClick={handleCopy}
              aria-label={status === 'copied' ? 'Email copied to clipboard' : 'Copy email to clipboard'}
              aria-live="polite"
              className={`ml-2 inline-flex items-center justify-center w-9 h-9 rounded-md border transition-colors ${
                status === 'copied'
                  ? 'bg-green-500/10 border-green-500/40 text-green-400'
                  : status === 'error'
                    ? 'bg-red-500/10 border-red-500/40 text-red-400'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white'
              }`}
            >
              {status === 'copied' ? (
                // check icon
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : status === 'error' ? (
                // x icon
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                // copy icon
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              )}
            </button>

            <span
              role="tooltip"
              className={`pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 text-xs rounded-md border transition-opacity ${
                status === 'idle'
                  ? 'opacity-0'
                  : status === 'copied'
                    ? 'opacity-100 bg-green-500/10 border-green-500/40 text-green-300'
                    : 'opacity-100 bg-red-500/10 border-red-500/40 text-red-300'
              }`}
            >
              {tooltip}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
