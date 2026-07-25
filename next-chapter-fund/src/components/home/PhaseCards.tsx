import Reveal from "@/components/ui/Reveal";
import { phases } from "@/config/site";

export default function PhaseCards({ detailed = false }: { detailed?: boolean }) {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {phases.map((phase, i) => (
        <Reveal key={phase.label} delay={i * 0.1}>
          <article className="relative h-full overflow-hidden rounded-2xl bg-white p-8 shadow-sm ring-1 ring-ink/8">
            <span
              aria-hidden="true"
              className="font-display absolute -right-3 -top-6 text-[7rem] font-bold leading-none text-ember-600/10"
            >
              {i + 1}
            </span>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ember-700">
              {phase.label}
            </p>
            <h3 className="font-display mt-3 text-2xl font-semibold text-ink">
              {phase.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              {phase.description}
            </p>
            {detailed && (
              <ul className="mt-6 space-y-3 border-t border-ink/8 pt-6">
                {phase.details.map((detail) => (
                  <li key={detail} className="flex gap-3 text-sm text-ink-soft">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="mt-0.5 h-4 w-4 shrink-0 stroke-ember-600"
                      fill="none"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m5 12.5 4.5 4.5L19 7.5" />
                    </svg>
                    {detail}
                  </li>
                ))}
              </ul>
            )}
          </article>
        </Reveal>
      ))}
    </div>
  );
}
