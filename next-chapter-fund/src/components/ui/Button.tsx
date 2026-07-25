import Link from "next/link";
import type { ReactNode } from "react";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "md" | "lg";
  className?: string;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 motion-safe:hover:-translate-y-0.5 focus-visible:outline-3 focus-visible:outline-ember-600";

const variants = {
  primary: "bg-ember-600 text-white hover:bg-ember-700 shadow-lg shadow-ember-600/25",
  secondary:
    "border-2 border-ink/15 bg-white/60 text-ink hover:border-ink/40 backdrop-blur",
  ghost: "text-ink underline-offset-4 hover:underline",
};

const sizes = {
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

export default function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  className = "",
}: ButtonLinkProps) {
  const isExternal = href.startsWith("http");
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  if (isExternal) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
