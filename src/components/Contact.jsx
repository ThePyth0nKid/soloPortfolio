import CopyEmailButton from './CopyEmailButton'

/**
 * Public contact email displayed in the Contact section.
 * Kept as a named constant so the copy-button and the visible text
 * can never drift apart.
 */
const CONTACT_EMAIL = 'alex@alexchen.dev'

export default function Contact() {
  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <h2 className="text-4xl font-bold">Get in touch</h2>
        <p className="text-slate-400 leading-relaxed">
          The fastest way to reach me is email. I read everything, I reply to
          most things.
        </p>
        <div className="flex items-center gap-3 p-4 bg-slate-900 border border-slate-800 rounded-xl w-fit">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-slate-100 font-mono text-sm md:text-base hover:text-purple-400 transition-colors"
          >
            {CONTACT_EMAIL}
          </a>
          <CopyEmailButton email={CONTACT_EMAIL} />
        </div>
      </div>
    </section>
  )
}
