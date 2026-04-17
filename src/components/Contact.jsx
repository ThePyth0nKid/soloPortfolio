import { useState } from 'react'

const EMAIL = 'alex@alexchen.dev'

export default function Contact() {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = EMAIL
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <h2 className="text-4xl font-bold">Contact</h2>
        <p className="text-slate-400">Want to work together? Drop me a line.</p>
        <div className="inline-flex items-center gap-2 p-2 pl-4 bg-slate-900 border border-slate-800 rounded-lg">
          <a href={`mailto:${EMAIL}`} className="text-slate-200 hover:text-purple-400 transition-colors">
            {EMAIL}
          </a>
          <div className="relative">
            <button
              onClick={copy}
              aria-label="Copy email to clipboard"
              className="p-2 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
            >
              {copied ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              )}
            </button>
            {copied && (
              <span className="absolute -top-9 left-1/2 -translate-x-1/2 px-2 py-1 text-xs bg-slate-800 border border-slate-700 rounded text-slate-200 whitespace-nowrap">
                Copied!
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
