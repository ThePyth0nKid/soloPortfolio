import { useState } from 'react'

const validate = ({ name, email, message }) => ({
  name: name.trim() ? '' : 'Name is required.',
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? '' : 'Enter a valid email.',
  message: message.trim().length >= 10 ? '' : 'Message must be at least 10 characters.',
})

export default function Contact() {
  const [values, setValues] = useState({ name: '', email: '', message: '' })
  const [touched, setTouched] = useState({})
  const [sent, setSent] = useState(false)

  const errors = validate(values)
  const isValid = !errors.name && !errors.email && !errors.message

  const update = (e) => setValues({ ...values, [e.target.name]: e.target.value })
  const blur = (e) => setTouched({ ...touched, [e.target.name]: true })

  const onSubmit = (e) => {
    e.preventDefault()
    if (!isValid) return
    console.log('Contact form submitted:', values)
    setSent(true)
  }

  const fieldClass = (name) =>
    `w-full px-3 py-2 bg-slate-900 border rounded-md text-sm text-slate-100 focus:outline-none focus:border-purple-500 ${
      touched[name] && errors[name] ? 'border-red-500/60' : 'border-slate-700'
    }`

  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-xl mx-auto space-y-8">
        <h2 className="text-4xl font-bold">Contact</h2>
        {sent ? (
          <p className="text-slate-400">Thanks — your message has been logged to the console.</p>
        ) : (
          <form onSubmit={onSubmit} noValidate className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm text-slate-300 mb-1">Name</label>
              <input id="name" name="name" value={values.name} onChange={update} onBlur={blur}
                aria-invalid={!!(touched.name && errors.name)}
                aria-describedby="name-error" className={fieldClass('name')} />
              {touched.name && errors.name && (
                <p id="name-error" className="mt-1 text-xs text-red-400">{errors.name}</p>
              )}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm text-slate-300 mb-1">Email</label>
              <input id="email" name="email" type="email" value={values.email} onChange={update} onBlur={blur}
                aria-invalid={!!(touched.email && errors.email)}
                aria-describedby="email-error" className={fieldClass('email')} />
              {touched.email && errors.email && (
                <p id="email-error" className="mt-1 text-xs text-red-400">{errors.email}</p>
              )}
            </div>
            <div>
              <label htmlFor="message" className="block text-sm text-slate-300 mb-1">Message</label>
              <textarea id="message" name="message" rows="5" value={values.message} onChange={update} onBlur={blur}
                aria-invalid={!!(touched.message && errors.message)}
                aria-describedby="message-error" className={fieldClass('message')} />
              {touched.message && errors.message && (
                <p id="message-error" className="mt-1 text-xs text-red-400">{errors.message}</p>
              )}
            </div>
            <button type="submit" disabled={!isValid}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed rounded-lg font-medium transition-colors">
              Send
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
