import { useId, useRef, useState } from 'react'

function validate({ name, email, message }) {
  const errors = {}
  if (!name.trim()) {
    errors.name = 'Please enter your name.'
  }
  if (!email.trim()) {
    errors.email = 'Please enter your email address.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.email = 'Please enter a valid email address (e.g. you@example.com).'
  }
  if (!message.trim()) {
    errors.message = 'Please enter a message.'
  } else if (message.trim().length < 10) {
    errors.message = `Message must be at least 10 characters (currently ${message.trim().length}).`
  }
  return errors
}

export default function Contact() {
  const nameId = useId()
  const emailId = useId()
  const messageId = useId()
  const nameErrId = `${nameId}-err`
  const emailErrId = `${emailId}-err`
  const messageErrId = `${messageId}-err`
  const messageHintId = `${messageId}-hint`

  const [values, setValues] = useState({ name: '', email: '', message: '' })
  const [touched, setTouched] = useState({ name: false, email: false, message: false })
  const [submitted, setSubmitted] = useState(false)
  const [success, setSuccess] = useState(false)
  const statusRef = useRef(null)

  const errors = validate(values)
  const isValid = Object.keys(errors).length === 0

  function showError(field) {
    return (touched[field] || submitted) && errors[field]
  }

  function handleChange(field) {
    return (e) => {
      setValues((v) => ({ ...v, [field]: e.target.value }))
      if (success) setSuccess(false)
    }
  }

  function handleBlur(field) {
    return () => setTouched((t) => ({ ...t, [field]: true }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
    setTouched({ name: true, email: true, message: true })
    if (!isValid) {
      // Move focus to first invalid field for keyboard + screen-reader users.
      const order = ['name', 'email', 'message']
      const first = order.find((f) => errors[f])
      if (first) {
        const el = document.getElementById(
          first === 'name' ? nameId : first === 'email' ? emailId : messageId,
        )
        el?.focus()
      }
      return
    }
    // eslint-disable-next-line no-console
    console.log('Contact form submission:', {
      name: values.name.trim(),
      email: values.email.trim(),
      message: values.message.trim(),
    })
    setSuccess(true)
    setValues({ name: '', email: '', message: '' })
    setTouched({ name: false, email: false, message: false })
    setSubmitted(false)
  }

  const inputBase =
    'w-full px-3 py-2 bg-slate-900 border rounded-lg text-slate-100 placeholder:text-slate-500 ' +
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 ' +
    'focus-visible:ring-offset-slate-950 transition-colors'

  function borderFor(field) {
    return showError(field)
      ? 'border-red-400'
      : 'border-slate-700 hover:border-slate-500'
  }

  return (
    <section id="contact" className="py-24 px-6 bg-slate-900/30" aria-labelledby="contact-heading">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="space-y-2">
          <h2 id="contact-heading" className="text-4xl font-bold">Contact</h2>
          <p className="text-slate-400">
            Have a project in mind, or just want to say hi? Send a note.
          </p>
        </div>

        <form noValidate onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label htmlFor={nameId} className="block text-sm font-medium text-slate-200">
              Name <span aria-hidden="true" className="text-red-400">*</span>
              <span className="sr-only"> (required)</span>
            </label>
            <input
              id={nameId}
              name="name"
              type="text"
              autoComplete="name"
              required
              value={values.name}
              onChange={handleChange('name')}
              onBlur={handleBlur('name')}
              aria-invalid={showError('name') ? 'true' : 'false'}
              aria-describedby={showError('name') ? nameErrId : undefined}
              className={`${inputBase} ${borderFor('name')}`}
            />
            {showError('name') && (
              <p id={nameErrId} className="text-sm text-red-400">
                {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor={emailId} className="block text-sm font-medium text-slate-200">
              Email <span aria-hidden="true" className="text-red-400">*</span>
              <span className="sr-only"> (required)</span>
            </label>
            <input
              id={emailId}
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              value={values.email}
              onChange={handleChange('email')}
              onBlur={handleBlur('email')}
              aria-invalid={showError('email') ? 'true' : 'false'}
              aria-describedby={showError('email') ? emailErrId : undefined}
              className={`${inputBase} ${borderFor('email')}`}
            />
            {showError('email') && (
              <p id={emailErrId} className="text-sm text-red-400">
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor={messageId} className="block text-sm font-medium text-slate-200">
              Message <span aria-hidden="true" className="text-red-400">*</span>
              <span className="sr-only"> (required)</span>
            </label>
            <textarea
              id={messageId}
              name="message"
              rows={5}
              required
              minLength={10}
              value={values.message}
              onChange={handleChange('message')}
              onBlur={handleBlur('message')}
              aria-invalid={showError('message') ? 'true' : 'false'}
              aria-describedby={
                showError('message') ? `${messageErrId} ${messageHintId}` : messageHintId
              }
              className={`${inputBase} ${borderFor('message')} resize-y`}
            />
            <p id={messageHintId} className="text-xs text-slate-400">
              At least 10 characters.
            </p>
            {showError('message') && (
              <p id={messageErrId} className="text-sm text-red-400">
                {errors.message}
              </p>
            )}
          </div>

          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={!isValid}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium transition-colors
                         hover:bg-purple-500
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400
                         focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950
                         disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed"
            >
              Send message
            </button>
            {!isValid && (submitted || Object.values(touched).some(Boolean)) && (
              <span className="text-xs text-slate-400" aria-hidden="true">
                Fill in all fields to enable sending.
              </span>
            )}
          </div>

          <div ref={statusRef} role="status" aria-live="polite" className="min-h-[1.5rem]">
            {success && (
              <p className="text-sm text-green-400">
                Thanks — your message has been logged. I'll be in touch.
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  )
}
