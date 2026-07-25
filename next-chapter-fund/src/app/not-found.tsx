import ButtonLink from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="flex min-h-svh flex-col items-center justify-center px-4 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-ember-700">
        404
      </p>
      <h1 className="font-display mt-4 max-w-xl text-4xl font-semibold text-ink sm:text-5xl">
        This page hasn&apos;t been written yet.
      </h1>
      <p className="mt-4 max-w-md text-ink-soft">
        But the next chapter is still being written — and you can be part of it.
      </p>
      <div className="mt-8">
        <ButtonLink href="/">Back to Home</ButtonLink>
      </div>
    </section>
  );
}
