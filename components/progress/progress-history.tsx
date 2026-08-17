"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/utils";
import type { HistoryRange, ProgressHistory } from "@/lib/progress/types";

const RANGES: Array<{ id: HistoryRange; label: string }> = [
  { id: "week", label: "This week" },
  { id: "month", label: "1 month" },
  { id: "quarter", label: "3 months" },
];

type Bar = {
  key: string;
  count: number;
  ariaLabel: string;
  tick?: string;
};

export function ProgressHistory({ history }: { history: ProgressHistory }) {
  const [range, setRange] = useState<HistoryRange>("quarter");
  const labelId = useId();
  const { bars, startLabel, endLabel } = barsForRange(history, range);
  const max = Math.max(1, ...bars.map((bar) => bar.count));
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
        <ul className="flex h-44 items-stretch gap-1.5 sm:gap-2">
          {bars.map((bar) => {
            const heightPct =
              bar.count === 0 ? 0 : Math.max(8, (bar.count / max) * 100);

            return (
              <li key={bar.key} className="flex min-w-0 flex-1 flex-col">
                <span className="mb-2 text-center font-display text-xs font-bold tracking-[0.08em] text-rail">
                  {bar.count}
                </span>
                <div className="flex min-h-0 flex-1 items-end">
                  <div
                    role="img"
                    aria-label={bar.ariaLabel}
                    className="w-full bg-lane"
                    style={{
                      height: bar.count === 0 ? 2 : `${heightPct}%`,
                    }}
                  />
                </div>
                {showTicks ? (
                  <span className="mt-2 text-center font-display text-xs font-bold tracking-[0.08em] text-track-mist uppercase">
                    {bar.tick}
                  </span>
                ) : null}
              </li>
            );
          })}
        </ul>
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
): { bars: Bar[]; startLabel: string; endLabel: string } {
  if (range === "week") {
    const bars = history.week.map((bucket) => ({
      key: bucket.day,
      count: bucket.count,
      ariaLabel: `${formatWeekday(bucket.day)} ${formatDate(bucket.day)}: ${repsPhrase(bucket.count)}`,
      tick: formatWeekday(bucket.day),
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
    ariaLabel: `Week of ${formatDate(bucket.weekStart)}: ${repsPhrase(bucket.count)}`,
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
