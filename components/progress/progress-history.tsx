"use client";

import { useId, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Tooltip,
  XAxis,
} from "recharts";
import { ChartTooltip } from "@/components/progress/chart-tooltip";
import { ClientChart } from "@/components/progress/client-chart";
import {
  CHART_LANE,
  CHART_MIST,
  CHART_RAIL,
  CHART_SEAM,
} from "@/lib/progress/chart-colors";
import { cn } from "@/lib/utils";
import type { HistoryRange, ProgressHistory } from "@/lib/progress/types";

const RANGES: Array<{ id: HistoryRange; label: string }> = [
  { id: "week", label: "This week" },
  { id: "month", label: "1 month" },
  { id: "quarter", label: "3 months" },
];

const tickStyle = {
  fill: CHART_MIST,
  fontSize: 11,
  fontFamily: "Barlow Condensed, ui-sans-serif, sans-serif",
  fontWeight: 700,
};

const labelStyle = {
  fill: CHART_RAIL,
  fontSize: 11,
  fontFamily: "Barlow Condensed, ui-sans-serif, sans-serif",
  fontWeight: 700,
};

type BarPoint = {
  key: string;
  count: number;
  tick: string;
  tooltip: string;
};

export function ProgressHistory({ history }: { history: ProgressHistory }) {
  const [range, setRange] = useState<HistoryRange>("quarter");
  const labelId = useId();
  const { bars, startLabel, endLabel } = barsForRange(history, range);
  const showTicks = bars.some((bar) => bar.tick);

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h2
          id={labelId}
          className="font-display text-xl font-extrabold tracking-tight text-rail uppercase"
        >
          Completed Reps
        </h2>
        <div
          role="tablist"
          aria-labelledby={labelId}
          className="grid grid-cols-3 gap-1 border border-steel-seam bg-lane-pit p-1 sm:w-80"
        >
          {RANGES.map((option) => {
            const selected = range === option.id;
            return (
              <button
                key={option.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setRange(option.id)}
                className={cn(
                  "font-display h-10 px-2 text-sm font-bold tracking-[0.08em] uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lane/60",
                  selected
                    ? "bg-rail text-asphalt"
                    : "text-track-mist hover:text-rail"
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="border border-steel-seam bg-lane-board px-4 py-5 sm:px-5">
        <ClientChart className="w-full" height={176}>
          <BarChart
            data={bars}
            margin={{ top: 24, right: 4, left: 4, bottom: showTicks ? 4 : 0 }}
            barCategoryGap="18%"
          >
            <CartesianGrid
              vertical={false}
              stroke={CHART_SEAM}
              strokeDasharray="0"
            />
            <XAxis
              dataKey="tick"
              tick={showTicks ? tickStyle : false}
              axisLine={false}
              tickLine={false}
              interval={0}
            />
            <Tooltip
              content={ChartTooltip}
              cursor={{ fill: "rgba(54, 217, 160, 0.08)" }}
            />
            <Bar
              dataKey="count"
              fill={CHART_LANE}
              radius={0}
              maxBarSize={40}
              minPointSize={2}
              isAnimationActive={false}
            >
              <LabelList dataKey="count" position="top" style={labelStyle} />
            </Bar>
          </BarChart>
        </ClientChart>
        <div className="mt-3 flex justify-between gap-2">
          <p className="font-display text-xs font-bold tracking-[0.16em] text-track-mist uppercase">
            {startLabel}
          </p>
          <p className="font-display text-xs font-bold tracking-[0.16em] text-track-mist uppercase">
            {endLabel}
          </p>
        </div>
      </div>
    </section>
  );
}

function barsForRange(
  history: ProgressHistory,
  range: HistoryRange
): { bars: BarPoint[]; startLabel: string; endLabel: string } {
  if (range === "week") {
    const bars = history.week.map((bucket) => ({
      key: bucket.day,
      count: bucket.count,
      tick: formatWeekday(bucket.day),
      tooltip: `${formatWeekday(bucket.day)} ${formatDate(bucket.day)}: ${repsPhrase(bucket.count)}`,
    }));
    const first = history.week[0];
    const last = history.week[history.week.length - 1];
    return {
      bars,
      startLabel: first ? formatDate(first.day) : "",
      endLabel: last ? formatDate(last.day) : "",
    };
  }

  const weeks = range === "month" ? history.month : history.quarter;
  const bars = weeks.map((bucket) => ({
    key: bucket.weekStart,
    count: bucket.count,
    tick: "",
    tooltip: `Week of ${formatDate(bucket.weekStart)}: ${repsPhrase(bucket.count)}`,
  }));
  const first = weeks[0];
  const last = weeks[weeks.length - 1];
  return {
    bars,
    startLabel: first ? `Week of ${formatDate(first.weekStart)}` : "",
    endLabel: last ? `Week of ${formatDate(last.weekStart)}` : "",
  };
}

function repsPhrase(count: number) {
  return count === 1 ? "1 rep" : `${count} reps`;
}

function formatDate(ymd: string): string {
  const [year, month, day] = ymd.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

function formatWeekday(ymd: string): string {
  const [year, month, day] = ymd.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-US", {
    weekday: "short",
    timeZone: "UTC",
  });
}
