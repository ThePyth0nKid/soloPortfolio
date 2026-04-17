# Solo Portfolio — Demo Repo for PatchParty

A minimal Vite + React + Tailwind landing page used as the demo target for [PatchParty](https://github.com/your-user/patchparty).

## What's here

A simple personal portfolio for "Alex Chen" — a fictional solo founder. Has:

- 🏠 Hero section
- 👤 About section
- 🛠 Projects section

## What's intentionally missing

**A contact form.** This is the demo issue PatchParty agents will implement.

## Run locally

```bash
npm install
npm run dev
# → http://localhost:3000
```

## The Demo Issue

When you open this repo in PatchParty, paste this issue URL:

```
https://github.com/{your-user}/solo-portfolio/issues/1
```

The issue text:

> **Add a contact form to the landing page**
>
> Add a contact form section at the bottom of the page (below Projects, above the footer).
>
> Requirements:
> - Fields: Name, Email, Message
> - Sits in a new `<Contact />` component in `src/components/Contact.jsx`
> - Imported and rendered in `src/App.jsx` between `<Projects />` and the footer
> - Submission for now can just `console.log` and show a success state
> - Style consistent with the existing dark theme
>
> Surprise us with how you implement it.

The five agents will produce wildly different contact forms.

## Why this repo is perfect for the PatchParty demo

- **Fast install:** ~25 sec on cold cache (Vite + React minimum)
- **Fast dev-server:** <2 sec to first paint
- **Visual diff:** all 5 implementations are visible side-by-side in iframes
- **Interactive:** judge can type into each form, feel the UX differences
- **Universally understood:** everyone knows what a contact form is

## License

MIT
