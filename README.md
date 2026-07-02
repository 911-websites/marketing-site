# 911 Websites, positioning A/B test

Bilingual (FR + EN) marketing site with **two standalone landing pages**, each defending a different positioning angle for 911 Websites, so they can be shown to prospects independently and compared.

| Route | Variant | Angle | Featured tier |
|---|---|---|---|
| `/` | Internal selector | Compare both at a glance (noindex, not for prospects) | - |
| `/website` | **A: The Website** | Be found, look solid, capture requests | Starter, $99/mo |
| `/reception` | **B: The Dispatch Desk** | Calls answered, qualified, summarized; evenings back | Pro, $199/mo |

Both variants share the same theme and components on purpose: the test isolates the **message**, not the design.

## Stack

Static HTML + vanilla CSS/JS. **Why:** zero build step and zero dependencies means it runs anywhere with one command, deploys to any static host for free, and nothing on these pages needs a framework.

## Run locally

```bash
npx serve .
# -> http://localhost:3000  (selector)
# -> http://localhost:3000/website
# -> http://localhost:3000/reception
```

`serve` resolves clean URLs (`/website` -> `website.html`) the same way Vercel does. Python's `http.server` does not; use `serve`.

## Deploy

```bash
npx vercel          # preview
npx vercel --prod   # production
```

Or connect the Git repo to Vercel: every push deploys automatically (previews per branch, production on `main`). `vercel.json` already sets `cleanUrls` and security headers. Netlify or any static host also works; enable "pretty URLs" or add equivalent redirects.

## Languages (FR / EN)

- **All copy lives in [assets/js/i18n.js](assets/js/i18n.js)**: two dictionaries (`en`, `fr`), same keys. Edit there; the text inline in the HTML is only the no-JS fallback (mirror of `en`).
- The FR/EN toggle in the header persists via `localStorage` and applies across pages. First visit defaults to the browser language.
- French register: professional **vouvoiement**, Quebec vocabulary ("soumission", "infolettre"). If you target France instead, swap those terms in `i18n.js` (search "soumission" -> "devis", "infolettre" -> "newsletter").

## Pricing (USD, shown on both variants)

- **Starter $99/mo**: website + smart chat capture + Google Business profile
- **Pro $199/mo**: Starter + voice assistant on the business line (after-hours only, or 24/7)
- **Sales Ops $299/mo**: Pro + sales CRM
- **Add-ons $49/mo each**: Google reviews, newsletters, SMS marketing, local SEO + blog, social media

Variant A features Starter ("Most popular"); Variant B features Pro ("Recommended").

## Naming: the call-handling offer

Applied on variant B: **EN "The Dispatch Desk" / FR "Le Standard"** (native trades vocabulary; says the function without saying "AI").

Alternatives to consider, pick and swap in `i18n.js` (`b.sol.title`, `b.f3.a`, `home.b.title`):

| EN | FR | Note |
|---|---|---|
| Front Desk 24/7 | L'Accueil 24/7 | The original working title; clear but generic |
| No Missed Calls | Zéro appel manqué | Benefit-as-name, doubles as a tagline |
| The Answer Line | La Permanence | "Permanence téléphonique" is the established FR service category |

## Measuring the test

- Send prospects **directly** to `/website` or `/reception`. The selector `/` is noindex and never linked from the variants.
- The demo form builds a **mailto to team@911websites.co** with a tagged subject (`[Website]` or `[Reception]`) plus the prospect's language, so every demo request self-identifies its variant with no tracking.
- No third-party tracking, no API keys, no backend.

## Placeholders to replace before showing widely

- **Testimonials**: 3 per variant, marked "example testimonials" on the page (`a.q1.*` ... `b.q3.*` in `i18n.js`).
- **OG images**: none yet; add 1200x630 images and `og:image` tags per variant.
- **Domain**: `og:url` tags assume `911websites.co`; confirm.

## Accessibility and performance

Semantic landmarks, skip link, visible focus states, 44px+ touch targets, WCAG AA contrast (primary button bg `#E31A21` for 4.5:1 white text), `prefers-reduced-motion` honored, no external resources except Google Fonts.

## Structure

```
├── index.html          # Internal selector (noindex)
├── website.html        # Variant A, served at /website
├── reception.html      # Variant B, served at /reception
├── assets/
│   ├── css/styles.css  # Shared theme: tokens -> components -> sections
│   └── js/
│       ├── i18n.js     # ALL copy, EN + FR
│       └── main.js     # Language manager, reveals, FAQ, form (mailto)
├── vercel.json         # cleanUrls + security headers
└── README.md
```
