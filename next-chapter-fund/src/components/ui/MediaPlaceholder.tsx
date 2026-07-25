/* eslint-disable @next/next/no-img-element */
type MediaPlaceholderProps = {
  src?: string;
  alt: string;
  label?: string;
  /** e.g. "aspect-video", "aspect-[4/5]" */
  aspect?: string;
  kind?: "photo" | "video";
  className?: string;
  rounded?: boolean;
};

/**
 * Renders real media when a src is provided, otherwise a labeled
 * placeholder frame. Swap sources in src/config/site.ts — see the
 * README for how to replace placeholder assets with real photos
 * and video.
 */
export default function MediaPlaceholder({
  src,
  alt,
  label,
  aspect = "aspect-video",
  kind = "photo",
  className = "",
  rounded = true,
}: MediaPlaceholderProps) {
  const frame = `relative w-full overflow-hidden ${aspect} ${
    rounded ? "rounded-2xl" : ""
  } ${className}`;

  return (
    <figure className={frame}>
      {src ? (
        <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div
          role="img"
          aria-label={alt}
          className="absolute inset-0 bg-gradient-to-br from-ember-200 via-cream-deep to-gold/30"
        />
      )}
      {label && (
        <figcaption className="absolute inset-0 flex items-center justify-center p-6">
          <span className="flex items-center gap-3 rounded-full bg-ink/70 px-5 py-3 text-center text-xs font-medium text-cream backdrop-blur-sm sm:text-sm">
            {kind === "video" && (
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-5 w-5 shrink-0 fill-current"
              >
                <path d="M8 5.14v13.72L19 12 8 5.14z" />
              </svg>
            )}
            {label}
          </span>
        </figcaption>
      )}
    </figure>
  );
}
