# Pre-Launch Checklist — Facts & Permissions

**Do not take this site public until every item below is confirmed.**
The site was intentionally built with placeholders wherever facts, permissions,
or legal status are unverified.

## 1. Consent & permissions (blocking — nothing publishes without these)

- [ ] Written approval from each child's **legal guardian** for use of their
      name, image, story, and performance footage
- [ ] Written approval from the Ghetto Kids' management/organization for the
      initiative and the use of the group's name
- [ ] Signed media releases for every photo and video used on the site
- [ ] Confirmation that testimonial quotes (if any) have written permission
- [ ] Consent process documented for all future content featuring the children

## 2. Factual claims to verify (Their Story page & homepage)

- [ ] Founding history of the Ghetto Kids: dates, names, locations
- [ ] Details of their rise to international recognition (videos, milestones)
- [ ] Description of their recent global performance — factual wording only;
      **must not imply endorsement or sponsorship by Shakira, FIFA, Sony, or any
      other artist or organization** unless formally confirmed in writing
- [ ] Number of children participating in the fund
- [ ] Any statistics, dates, or names mentioned anywhere on the site

## 3. Legal & financial structure

- [ ] Legal structure of The Next Chapter Fund established (entity type, jurisdiction)
- [ ] Nonprofit status confirmed or clearly disclaimed — the site currently says
      tax-deductibility is **not yet confirmed**; update `donationDisclaimers` in
      `src/config/site.ts` once resolved
- [ ] Privacy Policy drafted by a qualified professional (`/privacy` is a placeholder)
- [ ] Terms of Use drafted by a qualified professional (`/terms` is a placeholder)
- [ ] Donation Disclaimer finalized (`/donation-disclaimer`)
- [ ] Child-welfare, legal, and educational professionals engaged for any
      international programs (site already states this — make it true)

## 4. Donation platform

- [ ] Givebutter (or alternative) campaign created under the fund's legal entity
- [ ] `NEXT_PUBLIC_DONATION_URL` set in Vercel
- [ ] Test donation completed end-to-end (one-time and monthly)
- [ ] Funds flow and accounting responsibility confirmed

## 5. Content & assets

- [ ] Real approved photos replace all placeholder frames (`public/images/`)
- [ ] Real approved video with captions replaces the video placeholder
- [ ] `public/og-image.png` replaced with an approved photo-based social image
- [ ] Real contact email set in `src/config/site.ts` (`contact.email`)
- [ ] Real Instagram handle set (`contact.instagram`)
- [ ] Team & advisor names/bios confirmed and filled in (`team`)
- [ ] All `[PLACEHOLDER]` and `[bracketed]` strings removed —
      search the codebase for `PLACEHOLDER` and `[` in `src/config/site.ts`

## 6. Operations

- [ ] `NEXT_PUBLIC_SITE_URL` set to the real production domain
- [ ] `NEXT_PUBLIC_FORM_ENDPOINT` connected (Formspree/HubSpot/Mailchimp) and
      test submissions received for all three forms
- [ ] Email update process in place (who sends donor updates, how often)
- [ ] Impact metrics reporting process defined — replace the zero-state values
      in `impactMetrics` only with real, verified numbers
- [ ] Custom domain connected on Vercel; HTTPS verified
- [ ] Final accessibility pass (keyboard-only walkthrough + screen reader spot check)
