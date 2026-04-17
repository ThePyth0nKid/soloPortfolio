import { useState, useEffect, useRef } from 'react'

const EMAIL = 'alex@alexchen.dev'

export default function Contact() {
  const [copyState, setCopyState] = useState('idle') // 'idle' | 'copied' | 'error'
  const [showTooltip, setShowTooltip] = useState(false)
  const timeoutRef = useRef(null)
  const buttonRef = useRef(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const handleCopy = async () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(EMAIL)
      } else {
        // Fallback for older browsers / insecure contexts
        const textarea = document.createElement('textarea')
        textarea.value = EMAIL
        textarea.setAttribute('readonly', '')
        textarea.style.position = 'absolute'
        textarea.style.left = '-9999px'
        document.body.appendChild(textarea)
        textarea.select()
        const ok = document.execCommand('copy')
        document.body.removeChild(textarea)
        if (!ok) throw new Error('execCommand copy failed')
      }

      setCopyState('copied')
      setShowTooltip(true)
      console.log('[Contact] Email copied to clipboard:', EMAIL)

      timeoutRef.current = setTimeout(() => {
        setCopyState('idle')
        setShowTooltip(false)
      }, 2000)
    } catch (err) {
      console.error('[Contact] Failed to copy email:', err)
      setCopyState('error')
      setShowTooltip(true)
      timeoutRef.current = setTimeout(() => {
        setCopyState('idle')
        setShowTooltip(false)
      }, 2500)
    }
  }

  const tooltipText =
    copyState === 'copied'
      ? 'Copied!'
      : copyState === 'error'
        ? 'Press Ctrl+C to copy'
        : 'Copy to clipboard'

  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <h2 className="text-4xl font-bold">Get in touch</h2>
        <p className="text-slate-400 leading-relaxed">
          Working on something interesting, or just want to say hi? Drop me a
          line — I read everything.
        </p>

        <div className="inline-flex items-center gap-2 p-1 pl-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors">
          <a
            href={`mailto:${EMAIL}`}
            className="text-slate-100 font-mono text-sm sm:text-base hover:text-purple-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded px-1"
          >
            {EMAIL}
          </a>

          <div className="relative">
            <button
              ref={buttonRef}
              type="button"
              onClick={handleCopy}
              onMouseEnter={() => copyState === 'idle' && setShowTooltip(true)}
              onMouseLeave={() => copyState === 'idle' && setShowTooltip(false)}
              onFocus={() => copyState === 'idle' && setShowTooltip(true)}
              onBlur={() => copyState === 'idle' && setShowTooltip(false)}
              aria-label={
                copyState === 'copied'
                  ? 'Email copied to clipboard'
                  : `Copy email address ${EMAIL} to clipboard`
              }
              aria-live="polite"
              className={`relative flex items-center justify-center w-10 h-10 rounded-lg border transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 ${
                copyState === 'copied'
                  ? 'bg-green-500/10 border-green-500/40 text-green-400'
                  : copyState === 'error'
                    ? 'bg-red-500/10 border-red-500/40 text-red-400'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-100 hover:border-slate-600 active:scale-95'
              }`}
            >
              {/* Copy icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className={`absolute transition-all duration-200 ${
                  copyState === 'idle'
                    ? 'opacity-100 scale-100 rotate-0'
                    : 'opacity-0 scale-50 -rotate-45'
                }`}
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>

              {/* Check icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className={`absolute transition-all duration-200 ${
                  copyState === 'copied'
                    ? 'opacity-100 scale-100 rotate-0'
                    : 'opacity-0 scale-50 rotate-45'
                }`}
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>

              {/* Error icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className={`absolute transition-all duration-200 ${
                  copyState === 'error'
                    ? 'opacity-100 scale-100'
                    : 'opacity-0 scale-50'
                }`}
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </button>

            {/* Tooltip */}
            <div
              role="tooltip"
              className={`pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-1 text-xs font-medium rounded-md shadow-lg transition-all duration-150 ${
                showTooltip
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-1'
              } ${
                copyState === 'copied'
                  ? 'bg-green-500 text-white'
                  : copyState === 'error'
                    ? 'bg-red-500 text-white'
                    : 'bg-slate-700 text-slate-100'
              }`}
            >
              {tooltipText}
              <span
                className={`absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 ${
                  copyState === 'copied'
                    ? 'border-t-green-500'
                    : copyState === 'error'
                      ? 'border-t-red-500'
                      : 'border-t-slate-700'
                }`}
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        {/* Screen-reader-only status announcement */}
        <span className="sr-only" role="status" aria-live="polite">
          {copyState === 'copied'
            ? 'Email address copied to clipboard'
            : copyState === 'error'
              ? 'Failed to copy email address'
              : ''}
        </span>
      </div>
    </section>
  )
}
