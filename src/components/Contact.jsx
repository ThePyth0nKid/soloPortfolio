import { useMemo, useRef, useState } from 'react'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate({ name, email, message }) {
  const errors = {}
  if (!name.trim()) errors.name = 'Name is required.'
  if (!email.trim()) errors.email = 'Email is required.'
  else if (!EMAIL_RE.test(email.trim())) errors.email = 'That doesn\u2019t look like a valid email.'
  if (message.trim().length < 10) errors.message = `Message needs at least 10 characters (${message.trim().length}/10).`
  return errors
}

export default function Contact() {
  const [values, setValues] = useState({ name: '', email: '', message: '' })
  const [touched, setTouched] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [sent, setSent] = useState(false)
  const formRef = useRef(null)

  const errors = useMemo(() => validate(values), [values])
  const isValid = Object.keys(errors).length === 0

  function onChange(e) {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
  }

  function onBlur(e) {
    setTouched((t) => ({ ...t, [e.target.name]: true }))
  }

  function showError(field) {
    return (touched[field] || submitted) && errors[field]
  }

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
    if (!isValid) {
      // shake invalid fields
      formRef.current?.querySelectorAll('[data-invalid="true"]').forEach((el) => {
        el.animate(
          [
            { transform: 'translateX(0)' },
            { transform: 'translateX(-6px)' },
            { transform: 'translateX(6px)' },
            { transform: 'translateX(-4px)' },
            { transform: 'translateX(0)' },
          ],
          { duration: 280, easing: 'cubic-bezier(.36,.07,.19,.97)' }
        )
      })
      return
    }
    console.log('Contact form submitted:', values)
    setSent(true)
    setValues({ name: '', email: '', message: '' })
    setTouched({})
    setSubmitted(false)
    setTimeout(() => setSent(false), 4000)
  }

  return (
    <section id="contact" className="py-24 px-6 contact-section">
      <div className="max-w-xl mx-auto space-y-8">
        <div className="space-y-2 contact-heading">
          <h2 className="text-4xl font-bold">Get in touch</h2>
          <p className="text-slate-400">
            Have a project, question, or just want to say hi? Drop a note.
          </p>
        </div>

        <form
          ref={formRef}
          noValidate
          onSubmit={handleSubmit}
          className="space-y-5 contact-form"
          aria-live="polite"
        >
          <Field
            label="Name"
            name="name"
            value={values.name}
            onChange={onChange}
            onBlur={onBlur}
            error={showError('name') ? errors.name : null}
            autoComplete="name"
            delay="60ms"
          />
          <Field
            label="Email"
            name="email"
            type="email"
            value={values.email}
            onChange={onChange}
            onBlur={onBlur}
            error={showError('email') ? errors.email : null}
            autoComplete="email"
            delay="120ms"
          />
          <Field
            label="Message"
            name="message"
            as="textarea"
            value={values.message}
            onChange={onChange}
            onBlur={onBlur}
            error={showError('message') ? errors.message : null}
            delay="180ms"
          />

          <div className="flex items-center justify-between gap-4 pt-2 contact-submit-row">
            <span
              className={`text-xs transition-opacity duration-200 ${
                sent ? 'opacity-100 text-green-400' : 'opacity-0'
              }`}
              aria-hidden={!sent}
            >
              ✓ Message sent — I\u2019ll reply soon.
            </span>
            <button
              type="submit"
              disabled={!isValid}
              className="submit-btn px-6 py-3 rounded-lg font-medium bg-purple-600 text-white disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed"
            >
              <span className="submit-btn-label">Send message</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

function Field({ label, name, value, onChange, onBlur, error, as = 'input', type = 'text', autoComplete, delay = '0ms' }) {
  const Tag = as
  const id = `contact-${name}`
  const errorId = `${id}-error`
  const invalid = Boolean(error)

  const commonProps = {
    id,
    name,
    value,
    onChange,
    onBlur,
    'aria-invalid': invalid,
    'aria-describedby': invalid ? errorId : undefined,
    'data-invalid': invalid ? 'true' : 'false',
    className: `contact-input w-full bg-slate-900 border rounded-lg px-4 py-3 text-slate-100 placeholder-slate-600 outline-none ${
      invalid ? 'border-red-500/70' : 'border-slate-800'
    }`,
  }

  return (
    <div className="contact-field" style={{ '--field-delay': delay }}>
      <label htmlFor={id} className="block text-sm text-slate-300 mb-1.5">
        {label}
      </label>
      {as === 'textarea' ? (
        <textarea {...commonProps} rows={5} placeholder="Tell me what\u2019s on your mind\u2026" />
      ) : (
        <Tag {...commonProps} type={type} autoComplete={autoComplete} placeholder={label} />
      )}
      <div
        id={errorId}
        role={invalid ? 'alert' : undefined}
        className={`contact-error text-xs text-red-400 mt-1.5 ${invalid ? 'is-visible' : ''}`}
      >
        {error || '\u00A0'}
      </div>
    </div>
  )
}
