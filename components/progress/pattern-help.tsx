"use client";

import { useId, useRef } from "react";
import { Info } from "lucide-react";
import { PATTERN_PIE_LIMIT } from "@/lib/progress/pattern-pie";

export function PatternHelp() {
  const tooltipId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="relative inline-flex">
      <button
        ref={buttonRef}
        type="button"
        aria-describedby={tooltipId}
        aria-label="What the patterns chart shows"
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            buttonRef.current?.blur();
          }
        }}
        className="peer inline-flex size-6 items-center justify-center text-track-mist transition-colors hover:text-rail focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lane/60"
      >
        <Info className="size-3.5" aria-hidden />
      </button>
      <div
        id={tooltipId}
        role="tooltip"
        className="pointer-events-none invisible absolute top-[calc(100%+0.5rem)] right-0 z-20 w-64 border border-steel-seam bg-rail p-3 text-asphalt opacity-0 shadow-[0_10px_24px_rgb(15_23_32_/_28%)] transition-[opacity,visibility] peer-hover:visible peer-hover:opacity-100 peer-focus-visible:visible peer-focus-visible:opacity-100 sm:left-0 sm:right-auto sm:w-72"
      >
        <p className="text-sm leading-relaxed text-asphalt/80">
          These are your top pattern tags by how often you used them. Anything
          past the top {PATTERN_PIE_LIMIT} is grouped as Other.
        </p>
      </div>
    </div>
  );
}
