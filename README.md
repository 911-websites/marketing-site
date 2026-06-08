# 911 Websites — Marketing Site

Static single-page marketing site for [911 Websites](https://911websites.com) — fast, mobile-first websites + AI lead capture for HVAC and skilled-trade businesses.

## Stack

Plain HTML + CSS + vanilla JS. No build step, no framework, no dependencies beyond Google Fonts.

## Local development

```bash
# Any static file server works. Recommended:
npx serve .

# Or with Python:
python3 -m http.server 8080

# Or open index.html directly in a browser (smooth-scroll and fetch work fine over file://)
```

## Deploy to Vercel

```bash
npm i -g vercel
vercel
```

Vercel auto-detects a static site (no framework). Root directory is `/`. The site deploys as-is — no build command needed.

Alternatively: drag the project folder into [vercel.com/new](https://vercel.com/new).

## Before going live — fill these in

| Location | What to replace |
|---|---|
| `index.html` × 3 | `(555) 911-SITE` / `tel:+15559110000` → real phone |
| `index.html` × 2 | `hello@911websites.com` → real email |
| `index.html` × 2 | `https://911websites.com` → real domain in OG tags + footer |
| `index.html` form `action` | `YOUR_FORM_ID` → Formspree form ID (see below) |
| `index.html` testimonials | 3 × PLACEHOLDER blocks — add real name, company, city, quote |
| `assets/js/main.js` line 1 | Footer year is set automatically |

### Formspree setup (lead form)

1. Create a free account at [formspree.io](https://formspree.io)
2. Create a new form — copy the form ID (e.g. `xpwzabcd`)
3. In `index.html`, find `action="https://formspree.io/f/YOUR_FORM_ID"` and replace `YOUR_FORM_ID`
4. Done. Submissions land in your Formspree dashboard and are forwarded to your email.

### OG image

Add a 1200×630px image at `assets/og-image.jpg` and update the `og:image` meta tag.

## Lighthouse targets

- Performance: 95+
- Accessibility: 95+
- Best Practices: 100
- SEO: 100

The site uses semantic HTML, ARIA labels, skip link, 44px minimum tap targets, focus-visible states, and `prefers-reduced-motion` support. Contrast ratios: red (#ED1C24) on black passes WCAG AA at 4.55:1; red-deep (#C41019) on off-white passes at 5.34:1.

## File structure

```
911-websites/
├── index.html          # Single page — all 15 sections
├── assets/
│   ├── css/
│   │   └── styles.css  # Design system tokens → mobile-first layout → breakpoints
│   └── js/
│       └── main.js     # Trade pill rotation, nav, IntersectionObserver, FAQ, form
└── README.md
```

## Deployment

Auto-deployed from GitHub via Vercel Git integration.

Last integration check: 2026-06-08T16:19:07Z
