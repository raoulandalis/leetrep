"use client";

import { Cell, Pie, PieChart, Tooltip } from "recharts";
import { ChartTooltip } from "@/components/progress/chart-tooltip";
import { ClientChart } from "@/components/progress/client-chart";
import { CHART_BOARD, sliceColor } from "@/lib/progress/chart-colors";
import { patternPieSlices } from "@/lib/progress/pattern-pie";
import type { NamedCount } from "@/lib/progress/types";

export function PatternPieChart({ patterns }: { patterns: NamedCount[] }) {
  const { slices } = patternPieSlices(patterns);
  const data = slices.map((slice, index) => ({
    ...slice,
    fill: sliceColor(index),
    tooltip: `${slice.name}: ${tagsPhrase(slice.count)}`,
  }));

  return (
    <div className="flex h-full min-h-44 flex-1 flex-col border border-steel-seam bg-lane-board p-5 sm:p-6">
      <div className="flex flex-1 flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
        <div className="mx-auto size-44 shrink-0 sm:mx-0 sm:size-48">
          <ClientChart className="size-full">
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={0}
                outerRadius="88%"
                paddingAngle={1.5}
                stroke={CHART_BOARD}
                strokeWidth={2}
                isAnimationActive={false}
              >
                {data.map((slice, index) => (
                  <Cell key={`${slice.name}-${index}`} fill={slice.fill} />
                ))}
              </Pie>
              <Tooltip
                content={ChartTooltip}
                cursor={false}
              />
            </PieChart>
          </ClientChart>
        </div>

        <ul className="flex min-w-0 flex-1 flex-col">
          {data.map((slice, index) => (
            <li
              key={`${slice.name}-${index}`}
              className="flex items-center justify-between gap-4 border-b border-steel-seam py-2.5 last:border-b-0"
            >
              <span className="flex min-w-0 items-center gap-2.5">
                <span
                  className="size-2.5 shrink-0"
                  style={{ backgroundColor: slice.fill }}
                  aria-hidden
                />
                <span className="text-sm leading-relaxed text-rail">
                  {slice.name}
                </span>
              </span>
              <span className="font-display text-2xl font-extrabold tracking-tight text-rail">
                {slice.count}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function tagsPhrase(count: number) {
  return count === 1 ? "1 tag" : `${count} tags`;
}
