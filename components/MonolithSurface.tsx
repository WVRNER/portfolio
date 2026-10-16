"use client";

import { type ReactNode } from "react";

interface MonolithSurfaceProps {
  className?: string;
  style?: React.CSSProperties;
  children?: ReactNode;
  variant?: "graphite" | "black";
}

/**
 * ARCHITECTURAL MONOLITH SURFACE
 *
 * The unified material primitive of the WVRNER motion system:
 * - Layer A: Clean, resolution-independent vector geometry (CSS/SVG)
 * - Layer B: Flat tactile printed grain strictly clipped to internal boundary
 *
 * Strictly 2D graphic design:
 * ZERO 3D volumetric shading, ZERO radial glows, ZERO blur, ZERO pixelation.
 * Razor-sharp boundaries at 4K / Retina scale.
 */
export function MonolithSurface({
  className = "",
  style,
  children,
  variant = "graphite",
}: MonolithSurfaceProps) {
  const bgClass = variant === "black" ? "bg-[#0A0A0A]" : "bg-[#141413]";

  return (
    <div
      style={style}
      className={`relative overflow-hidden ${bgClass} ${className}`}
    >
      {/* Layer B: Tactile flat printed ink grain clipped inside */}
      <div
        className="absolute inset-0 grain-level-2 opacity-50 pointer-events-none select-none z-0"
        aria-hidden="true"
      />

      {/* Layer C: Optional content or media mounted cleanly above grain */}
      {children && <div className="relative z-10 w-full h-full">{children}</div>}
    </div>
  );
}
