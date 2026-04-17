import { useState } from 'react'

const EMAIL = 'alex@alexchen.dev'

export default function Contact() {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      // Fallback for older browsers / insecure contexts
      const textarea = document.createElement('textarea')
      textarea.value = EMAIL
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      try {
        document.execCommand('copy')
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (e) {
        console.error('Copy failed:', e)
      }
      document.body.removeChild(textarea)
    }
  }

  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <h2 className="text-4xl font-bold">Get in touch</h2>
        <p className="text-slate-400 leading-relaxed">
          Got an interesting project or just want to say hi? Drop me a line.
        </p>

        <div className="flex items-center gap-2 pt-2">
          <a
            href={`mailto:${EMAIL}`}
            className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 font-mono text-sm hover:border-slate-700 transition-colors"
          >
            {EMAIL}
          </a>

          <div className="relative">
            <button
              onClick={handleCopy}
              aria-label={copied ? 'Copied to clipboard' : 'Copy email to clipboard'}
              className="p-2 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors text-slate-300 hover:text-white"
            >
              {copied ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-green-400"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              )}
            </button>

            {copied && (
              <div
                role="status"
                className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 border border-slate-700 rounded-md text-xs text-slate-200 whitespace-nowrap shadow-lg"
              >
                Copied!
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
