"use client";

import type { TooltipContentProps } from "recharts";

export function ChartTooltip({ active, payload }: TooltipContentProps) {
  if (!active || payload.length === 0) {
    return null;
  }

  const item = payload[0];
  const detail =
    typeof item.payload?.tooltip === "string"
      ? item.payload.tooltip
      : String(item.value ?? "");

  return (
    <div className="rounded-none border border-steel-seam bg-lane-pit px-3 py-2">
      <p className="text-sm leading-relaxed text-rail">{detail}</p>
    </div>
  );
}
