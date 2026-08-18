"use client";

import { useId, useRef } from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

const RATINGS = [
  {
    label: "Needs work",
    meaning: "You're shaky on this one. We add it to the review queue.",
  },
  {
    label: "Keep practicing",
    meaning: "You know it, but you still want reps. We add it to the queue.",
  },
  {
    label: "Confident",
    meaning: "You've got this. We skip the queue; it stays in your library.",
  },
] as const;

export function ConfidenceHelp({
  onRail = true,
}: {
  onRail?: boolean;
}) {
  const tooltipId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="relative inline-flex">
      <button
        ref={buttonRef}
        type="button"
        aria-describedby={tooltipId}
        aria-label="What confidence ratings mean"
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            buttonRef.current?.blur();
          }
        }}
        className={cn(
          "peer inline-flex size-6 items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lane/60",
          onRail
            ? "text-asphalt/55 hover:text-asphalt"
            : "text-track-mist hover:text-rail"
        )}
      >
        <Info className="size-3.5" aria-hidden />
      </button>
      <div
        id={tooltipId}
        role="tooltip"
        className={cn(
          "pointer-events-none invisible absolute top-[calc(100%+0.5rem)] left-0 z-20 w-72 border p-4 opacity-0 shadow-[0_10px_24px_rgb(15_23_32_/_28%)] transition-[opacity,visibility] peer-hover:visible peer-hover:opacity-100 peer-focus-visible:visible peer-focus-visible:opacity-100 sm:w-80",
          onRail
            ? "border-asphalt/20 bg-asphalt text-rail"
            : "border-steel-seam bg-rail text-asphalt"
        )}
      >
        <ul className="flex flex-col gap-3">
          {RATINGS.map((rating) => (
            <li key={rating.label} className="flex flex-col gap-1">
              <p className="font-display text-xs font-bold tracking-[0.12em] uppercase">
                {rating.label}
              </p>
              <p
                className={cn(
                  "text-sm leading-relaxed",
                  onRail ? "text-rail/80" : "text-asphalt/70"
                )}
              >
                {rating.meaning}
              </p>
            </li>
          ))}
        </ul>
        <p
          className={cn(
            "mt-4 border-t pt-3 text-sm leading-relaxed",
            onRail
              ? "border-rail/15 text-rail/80"
              : "border-asphalt/15 text-asphalt/70"
          )}
        >
          After you finish the 5-rep cycle, we ask again so you can re-add it to
          the queue if you still want practice.
        </p>
      </div>
    </div>
  );
}
