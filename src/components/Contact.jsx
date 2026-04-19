import { useState } from 'react'

const INITIAL_VALUES = { name: '', email: '', message: '' }

function validate(values) {
  const errors = {}
  if (!values.name.trim()) {
    errors.name = 'Please enter your name.'
  }
  if (!values.email.trim()) {
    errors.email = 'Please enter your email.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Please enter a valid email address.'
  }
  if (values.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters.'
  }
  return errors
}

export default function Contact() {
  const [values, setValues] = useState(INITIAL_VALUES)
  const [touched, setTouched] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const errors = validate(values)
  const isValid = Object.keys(errors).length === 0

  function update(field) {
    return (e) => {
      setValues((v) => ({ ...v, [field]: e.target.value }))
      setSubmitted(false)
    }
  }

  function blur(field) {
    return () => setTouched((t) => ({ ...t, [field]: true }))
  }

  function onSubmit(e) {
    e.preventDefault()
    if (!isValid) return
    console.log('Contact form submission:', values)
    setSubmitted(true)
    setValues(INITIAL_VALUES)
    setTouched({})
  }

  const showError = (field) => touched[field] && errors[field]

  const inputBase =
    'w-full px-4 py-3 bg-slate-900 border rounded-lg text-slate-100 placeholder-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500/40'
  const inputOk = 'border-slate-800 hover:border-slate-700 focus:border-purple-500'
  const inputErr = 'border-red-500/60 focus:border-red-500'

  return (
    <section id="contact" className="py-24 px-6 bg-slate-900/30 border-t border-slate-800">
      <div className="max-w-xl mx-auto space-y-8">
        <div className="space-y-3">
          <h2 className="text-4xl font-bold">Contact</h2>
          <p className="text-slate-400 leading-relaxed">
            Got a project in mind, or just want to say hi? Drop me a note.
          </p>
        </div>

        <form onSubmit={onSubmit} noValidate className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-slate-300">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={values.name}
              onChange={update('name')}
              onBlur={blur('name')}
              aria-invalid={Boolean(showError('name'))}
              aria-describedby={showError('name') ? 'name-error' : undefined}
              placeholder="Ada Lovelace"
              className={`${inputBase} ${showError('name') ? inputErr : inputOk}`}
            />
            {showError('name') && (
              <p id="name-error" className="text-xs text-red-400">
                {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-slate-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={values.email}
              onChange={update('email')}
              onBlur={blur('email')}
              aria-invalid={Boolean(showError('email'))}
              aria-describedby={showError('email') ? 'email-error' : undefined}
              placeholder="you@example.com"
              className={`${inputBase} ${showError('email') ? inputErr : inputOk}`}
            />
            {showError('email') && (
              <p id="email-error" className="text-xs text-red-400">
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="block text-sm font-medium text-slate-300">
              Message
            </label>
            <textarea
              id="message"
              rows={5}
              value={values.message}
              onChange={update('message')}
              onBlur={blur('message')}
              aria-invalid={Boolean(showError('message'))}
              aria-describedby={showError('message') ? 'message-error' : undefined}
              placeholder="Tell me a bit about what you're working on…"
              className={`${inputBase} resize-none ${showError('message') ? inputErr : inputOk}`}
            />
            {showError('message') && (
              <p id="message-error" className="text-xs text-red-400">
                {errors.message}
              </p>
            )}
          </div>

          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={!isValid}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
            >
              Send message
            </button>
            {submitted && (
              <span className="text-sm text-green-400">
                Thanks — I'll be in touch soon.
              </span>
            )}
          </div>
        </form>
      </div>
    </section>
  )
}
