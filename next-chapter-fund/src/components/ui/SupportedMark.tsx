/* eslint-disable @next/next/no-img-element */
import { supportedGroup } from "@/config/site";

type SupportedMarkProps = {
  /** Which artwork to use — "light" for dark backgrounds, "dark" for light ones */
  tone?: "light" | "dark";
  /** Rendered width of the mark in pixels */
  width?: number;
  align?: "left" | "center";
  className?: string;
};

/**
 * The "In support of — Ghetto Kids" lockup. The label is part of the
 * component by design: the mark belongs to the group, and pairing it
 * with the label keeps the relationship explicit everywhere it appears.
 */
export default function SupportedMark({
  tone = "light",
  width = 150,
  align = "left",
  className = "",
}: SupportedMarkProps) {
  const src = tone === "light" ? supportedGroup.logoLight : supportedGroup.logoDark;

  return (
    <div
      className={`flex flex-col gap-2.5 ${
        align === "center" ? "items-center" : "items-start"
      } ${className}`}
    >
      <span
        className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${
          tone === "light" ? "text-cream/55" : "text-ink-faint"
        }`}
      >
        {supportedGroup.label}
      </span>
      <img
        src={src}
        alt={supportedGroup.name}
        width={width}
        height={Math.round((width * 441) / 822)}
        style={{ width, height: "auto" }}
        className="block"
      />
    </div>
  );
}
