# The Next Chapter Fund

A polished, mobile-first fundraising website for **The Next Chapter Fund** — a Reyes
family initiative supporting the education, artistic development, and well-being of
the Ghetto Kids of Uganda.

Built with **Next.js (App Router) + TypeScript + Tailwind CSS + Framer Motion**.
Deployable to **Vercel**.

> ⚠️ **Do not publish this site** until the children's legal guardians approve the
> use of their names, images, stories, and performance footage — and every item in
> [`LAUNCH_CHECKLIST.md`](./LAUNCH_CHECKLIST.md) is confirmed.

---

## Quick start

```bash
cd next-chapter-fund
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
```

Production build:

```bash
npm run build
npm start
```

## Deploying to Vercel

1. Push this repository to GitHub.
2. In Vercel, **Add New Project** → import the repo.
3. Set **Root Directory** to `next-chapter-fund` (the app lives in this
   subdirectory). Framework preset: **Next.js** (auto-detected).
4. Add the environment variables from `.env.example` under
   **Project → Settings → Environment Variables**:
   - `NEXT_PUBLIC_DONATION_URL`
   - `NEXT_PUBLIC_SITE_URL` (your production domain, e.g. `https://thenextchapterfund.org`)
   - `NEXT_PUBLIC_FORM_ENDPOINT` (optional)
5. Deploy.

---

## Connecting Givebutter (or another donation platform)

1. Create a campaign on [Givebutter](https://givebutter.com) (or Donorbox,
   GoFundMe Charity, etc.).
2. Copy the campaign page URL, e.g. `https://givebutter.com/next-chapter-fund`.
3. Set it as `NEXT_PUBLIC_DONATION_URL` in `.env.local` (local) and in Vercel's
   environment variables (production). Redeploy.

That's it — **every donate button on the site** (header, hero, donation widget,
CTAs) links to this URL. The donation widget also appends the visitor's selected
amount and frequency as query parameters (`?amount=100&recurring=monthly`) so the
platform can pre-fill them where supported.

Until the variable is set, donate buttons fall back to the on-site `/donate#give`
section so nothing is broken during development.

## Connecting the forms (email signup, partner inquiry, contact)

Forms run in **demo mode** by default: validation and success states work, but
nothing is sent. To make them live, either:

- **Formspree (fastest):** create a form at formspree.io and set
  `NEXT_PUBLIC_FORM_ENDPOINT=https://formspree.io/f/<your-id>`. All three forms
  POST JSON there with a `formKind` field (`email-signup`, `partner-inquiry`,
  `contact`) so you can filter submissions.
- **HubSpot / Mailchimp / custom API:** replace the body of `submitForm` in
  [`src/lib/forms.ts`](./src/lib/forms.ts). That's the only file that talks to a
  backend — no component changes needed.

---

## Editing content (text, links, goals, photos, videos)

**Almost everything editorial lives in one file:**
[`src/config/site.ts`](./src/config/site.ts)

| What | Where in `site.ts` |
| --- | --- |
| Navigation & footer links | `navigation`, `footerLegalLinks` |
| Homepage headlines & copy | `home` |
| Areas of support | `programAreas` |
| The three phases + roadmap | `phases`, `roadmap` |
| Donation amounts & giving levels | `donationLevels` |
| Impact metrics (zero-state) | `impactMetrics` |
| Impact page update cards | `updates` |
| Their Story page copy, gallery, video | `storyPage` |
| Mission, vision, principles, commitments | `missionPage` |
| Team / advisors | `team` |
| Testimonials | `testimonials` |
| Donation FAQ | `donationFaq` |
| Contact email & Instagram | `contact`, `socialLinks` |
| Legal disclaimer text | `legalDisclaimer`, `donationDisclaimers` |

### Replacing placeholder images

1. Drop real, **approved** photos into `public/images/` (e.g. `hero.jpg`,
   `story.jpg`, `gallery-1.jpg`, …). Use compressed web formats — WebP or AVIF
   preferred, JPG fine. Hero ≈ 2000px wide; gallery ≈ 1200px.
2. Update the matching `src` values in `src/config/site.ts` and write
   **descriptive `alt` text** for each image.
3. Remove the `placeholderLabel` for any asset that's now real — the label chip
   disappears automatically.

The hero currently uses a pure CSS gradient placeholder; swap it for a real
photo/video by editing `src/components/home/Hero.tsx` (the marked
"Full-bleed media placeholder" block) — e.g. an `<img>` or a muted, captioned
`<video>` element.

### Replacing the video placeholder

In `storyPage.video` (in `site.ts`), set `src` to an `.mp4` in `public/` (plus a
`poster` image and a real `captions` `.vtt` file in `public/captions/`). The
Their Story page automatically renders a proper `<video controls>` player with a
captions track instead of the placeholder. No autoplay audio, ever.

### Replacing contact details

Edit `contact.email` and `contact.instagram` in `site.ts`. The email appears in
the footer, the Donate page, and the legal pages automatically.

### Social sharing image

Replace `public/og-image.png` (1200×630) with a real, approved photo-based image.

---

## Project structure

```
next-chapter-fund/
├── src/
│   ├── config/site.ts          ← ALL editable content
│   ├── lib/forms.ts            ← form submission abstraction
│   ├── app/
│   │   ├── layout.tsx          ← global metadata, fonts, JSON-LD
│   │   ├── page.tsx            ← homepage
│   │   ├── their-story/ our-mission/ the-plan/ impact/ donate/
│   │   ├── privacy/ terms/ donation-disclaimer/
│   │   ├── sitemap.ts robots.ts
│   │   └── globals.css         ← theme colors & typography
│   └── components/
│       ├── layout/  (Header, Footer)
│       ├── home/    (Hero, SupportGrid, PhaseCards, StatsGrid)
│       ├── donate/  (DonationWidget)
│       ├── forms/   (EmailSignupForm, PartnerForm, ContactForm, fields)
│       └── ui/      (Button, SectionHeading, MediaPlaceholder, Reveal)
├── public/          (images, captions, og-image.png)
├── .env.example
└── LAUNCH_CHECKLIST.md
```

## Accessibility & performance notes

- WCAG-conscious contrast (accent used at a dark shade for text on light
  backgrounds), visible focus rings, skip-to-content link, semantic headings,
  labeled form fields with inline `role="alert"` errors.
- All animation respects `prefers-reduced-motion` (Framer Motion's
  `useReducedMotion` + CSS `motion-safe:` utilities).
- Fully static output (every route prerendered), self-hosted variable fonts,
  no external requests, no autoplay audio, video always has controls and a
  captions track slot.
