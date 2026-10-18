# Saleem Portfolio

A responsive developer portfolio built with plain HTML, CSS, and JavaScript.

## Included sections

- Hero / introduction
- About section
- Skills grid
- Featured projects
- Experience timeline
- Contact / CTA area

## Customize it

Edit the content in [index.html](index.html) to add:

- Your real name and role
- Bio and location
- Skills and tech stack
- Project titles and descriptions
- Links to GitHub, LinkedIn, and email

## Preview locally

The contact form uses a Vercel serverless function. Use Vercel's local development
server instead of Python's static server to test form submissions:

```bash
npx vercel dev
```

Set the EmailJS environment variables in Vercel's project settings (or in a local
`.env.local` file) before submitting the form. See [.env.example](.env.example)
for the required variable names. Never commit `.env.local` or place the EmailJS
private key in browser code.

The EmailJS template should use `{{from_name}}`, `{{from_email}}`, `{{message}}`,
and `{{to_email}}`; set Reply To to `{{from_email}}`.

Deploying to Vercel makes the `/api/contact` endpoint available automatically.

## Files

- [index.html](index.html)
- [styles.css](styles.css)
- [script.js](script.js)
