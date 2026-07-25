import Reveal from "@/components/ui/Reveal";

type SectionHeadingProps = {
  eyebrow?: string;
  headline: string;
  copy?: string;
  align?: "left" | "center";
  dark?: boolean;
  /** Heading level — defaults to h2 */
  as?: "h1" | "h2";
};

export default function SectionHeading({
  eyebrow,
  headline,
  copy,
  align = "left",
  dark = false,
  as: Tag = "h2",
}: SectionHeadingProps) {
  const alignment = align === "center" ? "text-center mx-auto" : "text-left";
  return (
    <Reveal className={`max-w-3xl ${align === "center" ? "mx-auto" : ""}`}>
      {eyebrow && (
        <p
          className={`mb-4 text-xs font-semibold uppercase tracking-[0.22em] ${alignment} ${
            dark ? "text-ember-300" : "text-ember-700"
          }`}
        >
          {eyebrow}
        </p>
      )}
      <Tag
        className={`font-display text-3xl leading-[1.08] font-semibold sm:text-4xl lg:text-5xl ${alignment} ${
          dark ? "text-cream" : "text-ink"
        }`}
      >
        {headline}
      </Tag>
      {copy && (
        <p
          className={`mt-6 text-lg leading-relaxed ${alignment} ${
            dark ? "text-cream/75" : "text-ink-soft"
          }`}
        >
          {copy}
        </p>
      )}
    </Reveal>
  );
}
