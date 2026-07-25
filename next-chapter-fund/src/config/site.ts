/**
 * ─────────────────────────────────────────────────────────────
 * SITE CONFIGURATION — edit this file to change site content.
 *
 * Everything editorial lives here: navigation, headlines, copy,
 * program areas, donation levels, impact metrics, photos, videos,
 * social links, and contact details. Components read from this
 * file, so you rarely need to touch component code.
 *
 * Placeholder rule: anything wrapped in [BRACKETS] or marked
 * "placeholder" must be confirmed/replaced before public launch.
 * See LAUNCH_CHECKLIST.md at the project root.
 * ─────────────────────────────────────────────────────────────
 */

export type NavItem = { label: string; href: string };
export type MediaAsset = {
  /** Path under /public, e.g. "/images/hero.jpg" */
  src: string;
  alt: string;
  /** Short label rendered on placeholder frames until real media is added */
  placeholderLabel?: string;
};
export type VideoAsset = {
  /** Path to an .mp4/.webm under /public, or an embed URL once confirmed */
  src: string;
  /** Optional WebM alternative served alongside the mp4 for wider support */
  webmSrc?: string;
  poster?: string;
  title: string;
  /** Path to a .vtt captions file under /public */
  captions?: string;
  placeholderLabel?: string;
};

/* ── URLs (from environment) ────────────────────────────────── */

export const donationUrl =
  process.env.NEXT_PUBLIC_DONATION_URL || "/donate#give";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://thenextchapterfund.example.com";

/* ── Identity ───────────────────────────────────────────────── */

export const site = {
  name: "The Next Chapter Fund",
  tagline: "A Reyes Initiative for the Ghetto Kids",
  description:
    "Support the education, artistic development, and long-term opportunities of the Ghetto Kids of Uganda.",
  homeTitle: "The Next Chapter Fund | Supporting the Ghetto Kids",
  /** Social sharing image, 1200×630 — replace /public/og-image.png before launch */
  ogImage: "/og-image.png",
};

export const contact = {
  /** [PLACEHOLDER] confirm real contact email before launch */
  email: "hello@thenextchapterfund.example.com",
  /** [PLACEHOLDER] confirm Instagram handle before launch */
  instagram: "https://instagram.com/[instagram-handle]",
  instagramLabel: "@[instagram-handle]",
};

export const socialLinks: { label: string; href: string }[] = [
  { label: "Instagram", href: contact.instagram },
];

/* ── Navigation ─────────────────────────────────────────────── */

export const navigation: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Their Story", href: "/their-story" },
  { label: "Our Mission", href: "/our-mission" },
  { label: "The Plan", href: "/the-plan" },
  { label: "Impact", href: "/impact" },
  { label: "Donate", href: "/donate" },
];

export const footerLegalLinks: NavItem[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Donation Disclaimer", href: "/donation-disclaimer" },
];

export const legalDisclaimer =
  "The Next Chapter Fund is an independent initiative supporting the education, artistic development, and well-being of participating Ghetto Kids. References to artists, performances, companies, or events do not imply formal sponsorship or endorsement unless expressly stated.";

/* ── Homepage copy ──────────────────────────────────────────── */

export const home = {
  hero: {
    eyebrow: "The Next Chapter Fund",
    headline:
      "Shakira helped the world discover them. Together, we can help them write the next chapter.",
    copy: "The Ghetto Kids have inspired millions through their extraordinary talent, resilience, and joy. The Next Chapter Fund helps turn that global recognition into lasting opportunity through education, artistic development, mentorship, and long-term support.",
    primaryCta: "Support Their Next Chapter",
    secondaryCta: "Watch Their Story",
    /**
     * Background video: muted, looping, no audio track. The poster
     * image doubles as the reduced-motion / slow-connection fallback.
     * Confirm guardian permissions for this footage before launch.
     */
    video: {
      src: "/videos/hero.mp4",
      webmSrc: "/videos/hero.webm",
      poster: "/images/hero-poster.jpg",
      title:
        "The Ghetto Kids backstage, celebrating together after a performance",
    } as VideoAsset,
  },
  moment: {
    eyebrow: "More Than a Moment",
    headline:
      "A global stage can create a moment. Opportunity turns that moment into a future.",
    copy: "Their performance introduced millions of people to what those closest to them already knew: these young artists are exceptional. But lasting transformation requires more than recognition. It requires education, training, stability, mentorship, and access to the right opportunities.",
  },
  mission: {
    eyebrow: "Our Mission",
    headline: "Helping extraordinary young artists build extraordinary futures.",
    copy: "The Next Chapter Fund supports the Ghetto Kids' education, artistic growth, personal well-being, and professional development. Our goal is not simply to help them reach another stage, but to give them the foundation to build meaningful lives and sustainable careers.",
    cta: "Read Our Mission",
  },
  story: {
    eyebrow: "Their Story",
    headline: "Talent born in Uganda. Joy shared with the world.",
    copy: "Through dance, music, discipline, and community, the Ghetto Kids have built a story that has inspired audiences around the world. Their success is a testament to what can happen when talent meets opportunity. We want to help ensure that their next chapter is even greater than the moment that introduced them to millions.",
    cta: "Discover Their Story",
    media: {
      src: "/images/story.svg",
      alt: "The Ghetto Kids dancing together in Kampala — photo placeholder",
      placeholderLabel: "Cinematic photo / video — dance session (pending permissions)",
    } satisfies MediaAsset,
  },
  donate: {
    eyebrow: "Donate",
    headline: "Be part of their next chapter.",
    copy: "Every contribution helps provide the education, training, stability, and opportunities these young artists need to continue growing.",
  },
  transparency: {
    eyebrow: "Transparency & Impact",
    headline: "Built on trust. Measured by impact.",
    copy: "Donors receive regular updates about how funds are being used and the progress being made — from school enrollment and training programs to creative projects and milestones. We publish what we raise, what we spend, and what it achieves.",
  },
  finalCta: {
    headline:
      "The world saw what they can do. Let's help them discover how far they can go.",
    primaryCta: "Donate Now",
    secondaryCta: "Become a Partner",
  },
};

/* ── Areas of support ───────────────────────────────────────── */

export type ProgramArea = {
  title: string;
  description: string;
  icon: "education" | "artistic" | "mentorship" | "wellbeing" | "global" | "creative";
};

export const programAreas: ProgramArea[] = [
  {
    title: "Education",
    description: "School tuition, books, technology, tutoring, and scholarships.",
    icon: "education",
  },
  {
    title: "Artistic Development",
    description:
      "Professional training in dance, music, singing, choreography, and performance.",
    icon: "artistic",
  },
  {
    title: "Mentorship",
    description:
      "Access to artists, producers, choreographers, educators, and industry professionals.",
    icon: "mentorship",
  },
  {
    title: "Well-Being",
    description:
      "Housing, nutrition, healthcare, safety, and responsible adult support.",
    icon: "wellbeing",
  },
  {
    title: "Global Opportunities",
    description:
      "Educational exchanges, workshops, residencies, and cultural experiences.",
    icon: "global",
  },
  {
    title: "Creative Projects",
    description:
      "Music, film, live performances, and digital content that help build sustainable careers.",
    icon: "creative",
  },
];

/* ── The plan (three phases) ────────────────────────────────── */

export type Phase = {
  label: string;
  title: string;
  description: string;
  details: string[];
};

export const phases: Phase[] = [
  {
    label: "Phase One",
    title: "Support Today",
    description:
      "Provide reliable funding for education, housing, nutrition, healthcare, and immediate needs.",
    details: [
      "Consistent monthly funding for school tuition and supplies",
      "Safe, stable housing and daily nutrition",
      "Access to healthcare and routine checkups",
      "Responsible adult support and safeguarding",
    ],
  },
  {
    label: "Phase Two",
    title: "Develop Their Talent",
    description:
      "Create professional programs in dance, music, performance, content creation, and mentorship.",
    details: [
      "Structured dance, music, and vocal training",
      "Workshops with professional choreographers and producers",
      "Content creation and media literacy programs",
      "One-on-one mentorship with industry professionals",
    ],
  },
  {
    label: "Phase Three",
    title: "Build Long-Term Opportunity",
    description:
      "Develop scholarships, international educational programs, industry partnerships, and sustainable career pathways.",
    details: [
      "Scholarship pathways to secondary and higher education",
      "International educational and cultural programs",
      "Partnerships with schools, studios, and cultural institutions",
      "Career development in the arts and beyond",
    ],
  },
];

/** Sample roadmap shown on The Plan page — illustrative, not a commitment. */
export type RoadmapItem = { period: string; focus: string; items: string[] };

export const roadmap: RoadmapItem[] = [
  {
    period: "Months 1–3",
    focus: "Foundation",
    items: [
      "Confirm guardianship consents and permissions for all participating children",
      "Establish the fund's legal and financial structure with qualified professionals",
      "Set up transparent donation processing and reporting",
      "Assess each child's educational and personal needs",
    ],
  },
  {
    period: "Months 4–6",
    focus: "Stability",
    items: [
      "Fund school enrollment, tuition, and supplies for the school year",
      "Establish reliable support for housing, meals, and healthcare",
      "Publish the first donor transparency report",
    ],
  },
  {
    period: "Months 7–9",
    focus: "Development",
    items: [
      "Launch structured dance, music, and performance training",
      "Begin the mentorship program with vetted professionals",
      "Document progress with the children's and guardians' consent",
    ],
  },
  {
    period: "Months 10–12",
    focus: "Growth",
    items: [
      "Explore international educational and cultural opportunities, guided by qualified legal, educational, and child-welfare professionals",
      "Develop the first creative projects with the children as participants and beneficiaries",
      "Publish a full first-year impact report",
    ],
  },
];

/* ── Donation levels ────────────────────────────────────────── */

export type DonationLevel = {
  amount: number;
  /** Shown on the Donate page giving-level list */
  description: string;
};

export const donationLevels: DonationLevel[] = [
  { amount: 25, description: "helps provide educational supplies." },
  {
    amount: 50,
    description: "contributes toward meals, transportation, or basic support.",
  },
  {
    amount: 100,
    description: "supports lessons, technology, or training materials.",
  },
  {
    amount: 250,
    description: "contributes toward tuition or professional artistic training.",
  },
  {
    amount: 500,
    description: "helps fund a larger educational or creative opportunity.",
  },
];

export const donationDisclaimers = {
  illustrative:
    "Giving levels are illustrative examples. Funds may be allocated based on the children's most important needs at any given time.",
  secure:
    "Donations are processed securely by our donation platform. Your payment details never touch our servers.",
  taxStatus:
    "Please note: tax-deductibility depends on the fund's legal structure and your local tax laws. We will publish confirmed details here once the organization's status is finalized.",
};

/* ── Impact metrics (zero-state placeholders — do NOT invent numbers) ── */

export type ImpactMetric = {
  label: string;
  /** Displayed value. Keep as an em dash or "0" until real, verified numbers exist. */
  value: string;
  note: string;
};

export const impactMetrics: ImpactMetric[] = [
  { label: "Funds raised", value: "—", note: "Updated after launch" },
  { label: "Children supported", value: "—", note: "Updated after launch" },
  { label: "School expenses funded", value: "—", note: "Updated after launch" },
  { label: "Training hours provided", value: "—", note: "Updated after launch" },
  { label: "Creative projects completed", value: "—", note: "Updated after launch" },
];

/* ── Impact page update cards (zero-state) ──────────────────── */

export type UpdateCard = {
  category: string;
  title: string;
  description: string;
  date?: string;
};

export const updates: UpdateCard[] = [
  {
    category: "Quarterly Report",
    title: "Update coming soon",
    description:
      "Our first quarterly report will detail funds raised, funds spent, and what they made possible.",
  },
  {
    category: "Financial Summary",
    title: "Update coming soon",
    description:
      "A clear, simple breakdown of income and spending, published for every donor to see.",
  },
  {
    category: "Program Update",
    title: "Update coming soon",
    description:
      "News from education, training, and mentorship programs as they launch.",
  },
  {
    category: "Video",
    title: "Update coming soon",
    description:
      "Video updates from the children and the team — shared with guardian consent.",
  },
  {
    category: "Student Milestones",
    title: "Update coming soon",
    description:
      "School enrollments, performances, graduations, and personal achievements.",
  },
  {
    category: "Donor Stories",
    title: "Update coming soon",
    description:
      "Why people around the world are choosing to support the next chapter.",
  },
];

/* ── Their Story page ───────────────────────────────────────── */

export const storyPage = {
  hero: {
    eyebrow: "Their Story",
    headline: "Talent born in Uganda. Joy shared with the world.",
    copy: "From the streets of Kampala to stages and screens around the world — this is a story about what happens when extraordinary talent meets community, discipline, and joy.",
  },
  sections: [
    {
      title: "Where it began",
      body: "The Ghetto Kids began in Kampala, Uganda, where a local mentor opened his home to children in need and discovered something remarkable: their gift for dance. [PLACEHOLDER: Confirm founding details, dates, names, and history directly with the group before publication.]",
    },
    {
      title: "Dance as a language",
      body: "For the Ghetto Kids, dance and music have never been just performance. They are a language of joy, a discipline that structures each day, and a source of community and belonging. Their signature style — energetic, precise, and irrepressibly joyful — grew from Ugandan dance traditions and the music they love.",
    },
    {
      title: "The world takes notice",
      body: "Videos of the group's dancing began reaching audiences far beyond Uganda, earning millions of views and invitations to perform internationally. [PLACEHOLDER: Confirm specific milestones, appearances, and dates before publication.]",
    },
    {
      title: "A global stage",
      body: "Their recent performance on one of the world's biggest stages introduced them to their largest audience yet. [PLACEHOLDER: Describe the performance factually once details and permissions are confirmed. Do not imply endorsement or sponsorship by any artist or organization.]",
    },
    {
      title: "Beyond one moment",
      body: "The Ghetto Kids' ambitions reach far beyond any single performance. They want to study, to train, to create, and to build careers — in music, film, dance, and beyond. The Next Chapter Fund exists to help make those ambitions real.",
    },
  ],
  gallery: [
    { src: "/images/gallery-1.svg", alt: "Photo placeholder — rehearsal in Kampala", placeholderLabel: "Photo 1 — pending permissions" },
    { src: "/images/gallery-2.svg", alt: "Photo placeholder — performance", placeholderLabel: "Photo 2 — pending permissions" },
    { src: "/images/gallery-3.svg", alt: "Photo placeholder — in the studio", placeholderLabel: "Photo 3 — pending permissions" },
    { src: "/images/gallery-4.svg", alt: "Photo placeholder — community", placeholderLabel: "Photo 4 — pending permissions" },
    { src: "/images/gallery-5.svg", alt: "Photo placeholder — travel", placeholderLabel: "Photo 5 — pending permissions" },
    { src: "/images/gallery-6.svg", alt: "Photo placeholder — celebration", placeholderLabel: "Photo 6 — pending permissions" },
  ] satisfies MediaAsset[],
  video: {
    src: "",
    title: "Watch their story",
    captions: "/captions/story.vtt",
    placeholderLabel: "Embedded video — add approved footage or an embed link (pending permissions)",
  } as VideoAsset,
};

/* ── Our Mission page ───────────────────────────────────────── */

export const missionPage = {
  mission:
    "The Next Chapter Fund supports the Ghetto Kids' education, artistic growth, personal well-being, and professional development — helping extraordinary young artists build extraordinary futures.",
  vision:
    "A world where the Ghetto Kids' talent, discipline, and joy carry them as far as they choose to go — with the education, stability, and opportunities to build lives and careers on their own terms, while staying rooted in the community and country that shaped them.",
  principles: [
    "Opportunity, not pity",
    "Education before exposure",
    "Child welfare before content",
    "Long-term development over short-term attention",
    "Transparency and accountability",
    "Respect for the children's identity, families, guardians, and community",
  ],
  commitments: [
    {
      title: "Commitment to education",
      body: "Education comes first. Tuition, tutoring, books, and technology are funded before anything else, and every program is scheduled around school — never instead of it.",
    },
    {
      title: "Commitment to child safety",
      body: "Every program, trip, and project is designed around the children's safety and well-being, with responsible adult supervision, guardian consent, and guidance from qualified child-welfare professionals.",
    },
    {
      title: "Commitment to transparency",
      body: "Donors will receive regular updates on funds raised and how they are used. We will publish reports, keep our numbers honest, and never overstate our impact.",
    },
    {
      title: "Commitment to Uganda",
      body: "The children's connection to Uganda — their families, community, culture, and home — is a strength to be preserved, not a circumstance to escape. Programs are designed to keep those roots strong.",
    },
  ],
};

/* ── Team / advisors (placeholders) ─────────────────────────── */

export type Person = { name: string; role: string; bio: string };

export const team: Person[] = [
  {
    name: "[Name placeholder]",
    role: "Founder — Reyes Family Initiative",
    bio: "[Bio coming soon. Confirm names, roles, and bios before launch.]",
  },
  {
    name: "[Advisor placeholder]",
    role: "Education Advisor",
    bio: "[Bio coming soon. Confirm names, roles, and bios before launch.]",
  },
  {
    name: "[Advisor placeholder]",
    role: "Child-Welfare Advisor",
    bio: "[Bio coming soon. Confirm names, roles, and bios before launch.]",
  },
];

/* ── Testimonials (placeholders — require consent before use) ── */

export type Testimonial = { quote: string; attribution: string };

export const testimonials: Testimonial[] = [
  {
    quote:
      "[Testimonial placeholder — quotes from mentors, teachers, or partners may be added here only with their written permission.]",
    attribution: "[Name, role]",
  },
];

/* ── Donation FAQ ───────────────────────────────────────────── */

export type FaqItem = { question: string; answer: string };

export const donationFaq: FaqItem[] = [
  {
    question: "Where does my donation go?",
    answer:
      "Donations fund the children's education, artistic training, mentorship, housing, nutrition, healthcare, and long-term opportunities. Giving levels are illustrative — funds are allocated to the children's most important needs at any given time, and we report on how they are used.",
  },
  {
    question: "Is my donation secure?",
    answer:
      "Yes. Donations are processed by an established donation platform over an encrypted connection. Your payment details are handled by the platform and never touch our servers.",
  },
  {
    question: "Is my donation tax-deductible?",
    answer:
      "Tax-deductibility depends on the fund's legal structure and your local tax laws. We will publish confirmed details here once the organization's status is finalized. Please consult a tax professional about your specific situation.",
  },
  {
    question: "Can I give monthly?",
    answer:
      "Yes — monthly giving is the most powerful way to support the children, because it lets us plan tuition, housing, and training with confidence. You can choose monthly support on the donation page and cancel anytime.",
  },
  {
    question: "How will I know what my donation achieved?",
    answer:
      "Donors receive regular updates, and we publish reports on the Impact page covering funds raised, how they were spent, and the progress the children are making.",
  },
  {
    question: "I represent an organization. How can we help?",
    answer:
      "We welcome conversations with schools, studios, brands, and cultural institutions. Use the partner inquiry form or email us directly about major gifts and corporate partnerships.",
  },
];

/* ── Form field options ─────────────────────────────────────── */

export const partnershipTypes = [
  "Corporate partnership",
  "Major gift",
  "Education partner",
  "Arts & training partner",
  "Media & storytelling",
  "Other",
];
