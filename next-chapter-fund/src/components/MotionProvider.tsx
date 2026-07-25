"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Central animation policy. reducedMotion="user" makes Framer Motion
 * honor prefers-reduced-motion for every animation in the app:
 * movement (transforms) is disabled while gentle opacity fades still
 * complete, so content is never left hidden. Keeping one render tree
 * for all users also avoids SSR hydration mismatches.
 */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
