import { cn } from "@/lib/utils";
import type { ProgressSnapshot } from "@/lib/progress/types";

const STAT_ITEMS: Array<{
  key: keyof Pick<
    ProgressSnapshot,
    "problemsLogged" | "repsCompleted" | "currentStreak" | "totalReviews"
  >;
  label: string;
}> = [
  { key: "problemsLogged", label: "Problems Logged" },
  { key: "repsCompleted", label: "Reps Completed" },
  { key: "currentStreak", label: "Current Streak" },
  { key: "totalReviews", label: "Total Reviews" },
];

export function ProgressStats({
  snapshot,
}: {
  snapshot: ProgressSnapshot;
}) {
  return (
    <dl className="grid grid-cols-2 border border-steel-seam bg-lane-board lg:grid-cols-4">
      {STAT_ITEMS.map((item, index) => (
        <div
          key={item.key}
          className={cn(
            "flex flex-col gap-1 px-4 py-4 sm:px-5",
            cellBorder(index)
          )}
        >
          <dt className="font-display text-xs font-bold tracking-[0.16em] text-track-mist uppercase">
            {item.label}
          </dt>
          <dd className="font-display text-3xl font-extrabold tracking-tight text-rail">
            {snapshot[item.key]}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function cellBorder(index: number) {
  return cn(
    index % 2 === 0 && "border-r border-steel-seam",
    index < 2 && "border-b border-steel-seam lg:border-b-0",
    index < 3 ? "lg:border-r lg:border-steel-seam" : "lg:border-r-0"
  );
}
