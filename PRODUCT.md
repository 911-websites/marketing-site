# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Owner-operators of small trade businesses in North America: HVAC, plumbing,
electrical, roofing. Typically one person who runs the company and also works on
the tools.

Their situation when they meet this product: on a job site or in a truck, phone
in hand, between calls, with limited patience for marketing language. They are
evaluating quickly and sceptically, often after being sold to before.

Their job: win more booked work without spending time on marketing and without
missing the calls that come in while their hands are busy.

## Product Purpose

Gives a trade business two things as one package: a fast, professional website,
and a 24/7 receptionist that answers calls in the company's name, qualifies the
request, books the appointment, and hands over a summary. Live in 24 hours, with
no work required from the owner.

Success is booked jobs that would otherwise have been lost — to a competitor who
answered first, or to a call that rang out at 9pm.

## Positioning

"The first company that answers wins the job." The mechanism is the pairing:
most competitors sell either a website or an answering service. This sells the
whole path from search to booked appointment, live within 24 hours, month to
month, with a money-back guarantee.

## Operating Context

Customers find these businesses on a phone, frequently mid-emergency (a flooded
basement, a dead furnace in July), and frequently outside business hours. The
first company that responds usually gets the work. The owner cannot answer while
under a sink or on a roof, so the calls that matter most are the ones most likely
to be missed.

Evaluation of this product happens on a phone, fast, by someone who did not plan
to be shopping for a website.

## Capabilities and Constraints

Three tiers, billed monthly in USD, 10% off annually:

- Website — $99/mo: fast mobile-first site, smart chat capturing requests 24/7,
  Google Business profile set up.
- 24/7 Receptionist — $199/mo: the above, plus a voice assistant on the business
  line, after-hours only or around the clock.
- Sales CRM — $299/mo: the above, plus every request tracked through to a quote,
  and follow-ups.

Add-ons at $49/mo each: Google reviews management, newsletters, SMS marketing,
local SEO and blog, social media management.

Commercial terms: live in 24 hours, no setup fee, month to month, cancel
anytime, 30-day money-back guarantee.

Language: English and French are both first-class, at parity. The French is
**French of France, not Québécois** (confirmed 2026-08-12): the FR market is
France, matching the Brittany prospecting campaign. Avoid soumission, courriel,
cellulaire, fournaise, souper, contrat-as-job; use devis, e-mail, portable,
chaudière, dîner, chantier, and artisans rather than "gens de métier". French copy runs
roughly 20% longer than English, which constrains layout. Strings live in a
single dictionary (`assets/js/i18n.js`); HTML carries the English fallback for
the no-JS case.

Two publishing surfaces exist: this static site (Vercel) and a WordPress.com
mirror. WordPress.com strips `<iframe>`, `<script>`, `<style>` and event
attributes from block content, so anything interactive must live on the static
site and be linked to. Site-wide CSS on WordPress.com is available through
global styles.

Undecided / not yet built: the conversion mechanism. The intended path is online
self-serve booking (a scheduling tool where the visitor picks a slot). The code
today still opens a `mailto:` form to team@911websites.co. Future work should
design toward the calendar, and must not describe booking as working before it
does.

Production domain is not confirmed; the code carries a TODO against
`911websites.co`.

## Brand Commitments

- Name: 911 Websites. Logo is three red squares reading 9-1-1.
- Contact: team@911websites.co.
- The founders ran digital campaigns for Home Depot, Lowe's, Castorama,
  Chevrolet, Cadillac and Lexus. This is a real, usable credibility claim and is
  already on the site.

## Evidence on Hand

**There are no customers yet.** No signed clients, no delivered results, no
measured outcomes, no real testimonials, no client logos. This is pre-launch.

Every testimonial currently on the site is invented and is labelled as an
example. Future work must not present invented testimonials, logos, counts,
ratings or results as real, and must not quietly remove the label that marks
them as examples.

What is real and usable:

- The founders' agency background (above).
- A working before/after demonstration at `/demo`: `demo-before.html` recreates
  an un-modernised contractor site, `demo-after.html` is the rebuilt version.
  Both use an invented business identity; the "before" is a recreation, not a
  screenshot of a real site, and the page says so.
- Photography in `assets/img/`: `painter-spraying.jpg`, `painters-pair.jpg`,
  plus older `contractor.jpg`, `electrician.jpg`, `plumbing-work.jpg`,
  `crew.jpg`.
- The commercial terms above, which are real promises.

## Product Principles

1. **Credibility has to come from somewhere other than customers.** With no
   proof to show, the weight falls on demonstration, the guarantee, transparency
   about being early, and the founders' track record. Anything that merely looks
   like proof is off the table.
2. **The visitor is on a phone, in a hurry, and has been sold to before.** Speed
   to comprehension beats completeness. Anything that reads as marketing filler
   costs trust rather than adding to it.
3. **Every claim must survive a tradesperson's bullshit filter.** Concrete,
   checkable, in their vocabulary — not "solutions" and "platforms".
4. **Show the product working rather than describing it.** The demo is the
   strongest asset the company currently owns.
5. **Both languages are first-class.** Nothing may depend on English line
   lengths; French must not look like an afterthought.

## Accessibility & Inclusion

No formal standard has been set for this product. Two audience facts should
inform future work: the readers skew older than a typical SaaS audience, and
they read on phones, often one-handed and in poor conditions. Type size, tap
target size and contrast carry more weight here than on a desktop-first product.
