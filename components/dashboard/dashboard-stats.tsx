import type { DashboardStats as DashboardStatsData } from "@/lib/reviews/types";

const STAT_ITEMS: Array<{
  key: keyof DashboardStatsData;
  label: string;
}> = [
  { key: "problems", label: "Problems" },
  { key: "repsCompleted", label: "Reps Completed" },
  { key: "dayStreak", label: "Day Streak" },
];

export function DashboardStats({ stats }: { stats: DashboardStatsData }) {
  return (
    <dl
      id="onborda-stats"
      className="grid grid-cols-3 divide-x divide-steel-seam border border-steel-seam bg-lane-board"
    >
      {STAT_ITEMS.map((item) => (
        <div key={item.key} className="flex flex-col gap-1 px-4 py-4 sm:px-5">
          <dt className="font-display text-xs font-bold tracking-[0.16em] text-track-mist uppercase">
            {item.label}
          </dt>
          <dd className="font-display text-3xl font-extrabold tracking-tight text-rail">
            {stats[item.key]}
          </dd>
        </div>
      ))}
    </dl>
  );
}
