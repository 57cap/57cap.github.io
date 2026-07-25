import Reveal from "@/components/ui/Reveal";
import { impactMetrics } from "@/config/site";

/**
 * Impact metrics — values come from src/config/site.ts and are
 * intentionally zero-state until real, verified numbers exist.
 */
export default function StatsGrid({ dark = false }: { dark?: boolean }) {
  return (
    <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {impactMetrics.map((metric, i) => (
        <Reveal key={metric.label} delay={i * 0.06}>
          <div
            className={`h-full rounded-2xl p-6 text-center ${
              dark ? "bg-cream/5 ring-1 ring-cream/15" : "bg-white ring-1 ring-ink/8"
            }`}
          >
            <dd
              className={`font-display text-4xl font-semibold ${
                dark ? "text-cream" : "text-ink"
              }`}
            >
              {metric.value}
            </dd>
            <dt
              className={`mt-2 text-sm font-medium ${
                dark ? "text-cream/70" : "text-ink-soft"
              }`}
            >
              {metric.label}
            </dt>
            <p
              className={`mt-1 text-xs ${dark ? "text-cream/40" : "text-ink-faint"}`}
            >
              {metric.note}
            </p>
          </div>
        </Reveal>
      ))}
    </dl>
  );
}
