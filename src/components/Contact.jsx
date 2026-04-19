export default function Contact() {
  function handleSubmit(e) {
    e.preventDefault()
    const form = e.currentTarget
    // Native constraint validation — let the platform check first.
    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }
    const data = Object.fromEntries(new FormData(form).entries())
    console.log('Contact form submitted:', data)
    form.reset()
    // Show a transient success popover via the popover API.
    document.getElementById('contact-success')?.showPopover?.()
  }

  return (
    <section id="contact" className="contact-section">
      <div className="contact-shell">
        <header className="contact-head">
          <h2>Contact</h2>
          <p>Got a project, a question, or just want to say hi? Drop a note.</p>
        </header>

        <form className="contact-form" onSubmit={handleSubmit} noValidate={false}>
          <div className="field">
            <label htmlFor="cf-name">Name</label>
            <input
              id="cf-name"
              name="name"
              type="text"
              required
              minLength={1}
              autoComplete="name"
              placeholder="Ada Lovelace"
            />
            <p className="error" aria-live="polite">
              <span data-when="valueMissing">Name is required.</span>
              <span data-when="default">Please enter your name.</span>
            </p>
          </div>

          <div className="field">
            <label htmlFor="cf-email">Email</label>
            <input
              id="cf-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="ada@example.com"
            />
            <p className="error" aria-live="polite">
              <span data-when="valueMissing">Email is required.</span>
              <span data-when="typeMismatch">That doesn't look like a valid email.</span>
              <span data-when="default">Please enter a valid email.</span>
            </p>
          </div>

          <div className="field">
            <label htmlFor="cf-message">Message</label>
            <textarea
              id="cf-message"
              name="message"
              required
              minLength={10}
              rows={5}
              placeholder="Tell me what you're building…"
            />
            <p className="error" aria-live="polite">
              <span data-when="valueMissing">Message is required.</span>
              <span data-when="tooShort">Message must be at least 10 characters.</span>
              <span data-when="default">Please enter a longer message.</span>
            </p>
          </div>

          {/* Submit is disabled via :has() until the form is :valid. No JS state. */}
          <button type="submit" className="submit">Send message</button>
        </form>

        <div
          id="contact-success"
          popover="auto"
          className="success-pop"
        >
          ✓ Message sent — check the console.
        </div>
      </div>
    </section>
  )
}
