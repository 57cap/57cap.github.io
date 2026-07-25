import Reveal from "@/components/ui/Reveal";
import { programAreas, type ProgramArea } from "@/config/site";

const icons: Record<ProgramArea["icon"], React.ReactNode> = {
  education: (
    <path d="M12 4 2 9l10 5 8-4v6h2V9L12 4zM6 12.5V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-3.5l-6 3-6-3z" />
  ),
  artistic: (
    <path d="M12 3a9 9 0 1 0 9 9c0-1.1-.9-2-2-2h-2a2 2 0 0 1-2-2V6c0-1.7-1.3-3-3-3zm-4.5 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm3-4A1.5 1.5 0 1 1 12 6.5 1.5 1.5 0 0 1 10.5 8zm3 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
  ),
  mentorship: (
    <path d="M16 11c1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3 1.3 3 3 3zm-8 0c1.7 0 3-1.3 3-3S9.7 5 8 5 5 6.3 5 8s1.3 3 3 3zm0 2c-2.3 0-7 1.2-7 3.5V19h14v-2.5C15 14.2 10.3 13 8 13zm8 0c-.3 0-.6 0-1 .1 1.2.8 2 1.9 2 3.4V19h6v-2.5c0-2.3-4.7-3.5-7-3.5z" />
  ),
  wellbeing: (
    <path d="M12 21s-7.5-4.9-9.7-9.1C.8 8.9 2.4 5.5 5.5 5c1.9-.3 3.8.6 4.9 2.2h3.2c1.1-1.6 3-2.5 4.9-2.2 3.1.5 4.7 3.9 3.2 6.9C19.5 16.1 12 21 12 21z" />
  ),
  global: (
    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm7.9 9h-3a15.7 15.7 0 0 0-1.2-5.4A8 8 0 0 1 19.9 11zM12 4c.9 1.3 1.6 3.8 1.9 7h-3.8c.3-3.2 1-5.7 1.9-7zM8.3 5.6A15.7 15.7 0 0 0 7.1 11h-3a8 8 0 0 1 4.2-5.4zM4.1 13h3c.2 2 .6 3.8 1.2 5.4A8 8 0 0 1 4.1 13zM12 20c-.9-1.3-1.6-3.8-1.9-7h3.8c-.3 3.2-1 5.7-1.9 7zm3.7-1.6c.6-1.6 1-3.4 1.2-5.4h3a8 8 0 0 1-4.2 5.4z" />
  ),
  creative: (
    <path d="M18 3v10.6a3.5 3.5 0 1 0 2 3.2V7h2V3h-4zM6 5v10.6A3.5 3.5 0 1 0 8 18.8V9h6V5H6z" />
  ),
};

export default function SupportGrid() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {programAreas.map((area, i) => (
        <Reveal key={area.title} delay={i * 0.07}>
          <article className="group h-full rounded-2xl border border-ink/8 bg-white p-7 shadow-sm transition-all duration-300 motion-safe:hover:-translate-y-1 hover:shadow-lift">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-ember-50 text-ember-600 transition-colors group-hover:bg-ember-600 group-hover:text-white">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6 fill-current">
                {icons[area.icon]}
              </svg>
            </div>
            <h3 className="font-display text-xl font-semibold text-ink">{area.title}</h3>
            <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">
              {area.description}
            </p>
          </article>
        </Reveal>
      ))}
    </div>
  );
}
