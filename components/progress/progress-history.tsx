import type { WeekBucket } from "@/lib/progress/types";

export function ProgressHistory({ weeks }: { weeks: WeekBucket[] }) {
  const max = Math.max(1, ...weeks.map((week) => week.count));

  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-display text-xl font-extrabold tracking-tight text-rail uppercase">
        Completed Reps
      </h2>
      <div className="border border-steel-seam bg-lane-board px-4 py-5 sm:px-5">
        <ul className="flex h-44 items-stretch gap-1.5 sm:gap-2">
          {weeks.map((week) => {
            const heightPct =
              week.count === 0 ? 0 : Math.max(8, (week.count / max) * 100);
            const label = formatWeekOf(week.weekStart);
            const repsLabel = week.count === 1 ? "1 rep" : `${week.count} reps`;

            return (
              <li
                key={week.weekStart}
                className="flex min-w-0 flex-1 flex-col"
              >
                <span className="mb-2 text-center font-display text-xs font-bold tracking-[0.08em] text-rail">
                  {week.count}
                </span>
                <div className="flex min-h-0 flex-1 items-end">
                  <div
                    role="img"
                    aria-label={`Week of ${label}: ${repsLabel}`}
                    className="w-full bg-lane"
                    style={{
                      height: week.count === 0 ? 2 : `${heightPct}%`,
                    }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
        <div className="mt-3 flex justify-between gap-2">
          <p className="font-display text-xs font-bold tracking-[0.16em] text-track-mist uppercase">
            {weeks[0] ? `Week of ${formatWeekOf(weeks[0].weekStart)}` : null}
          </p>
          <p className="font-display text-xs font-bold tracking-[0.16em] text-track-mist uppercase">
            {weeks[weeks.length - 1]
              ? `Week of ${formatWeekOf(weeks[weeks.length - 1].weekStart)}`
              : null}
          </p>
        </div>
      </div>
    </section>
  );
}

function formatWeekOf(ymd: string): string {
  const [year, month, day] = ymd.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}
