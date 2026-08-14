import Link from "next/link";
import { ReviewTypeChip } from "@/components/reviews/review-type-chip";
import type { DueReviewTask } from "@/lib/reviews/types";

export function DueRepList({ tasks }: { tasks: DueReviewTask[] }) {
  return (
    <ul className="flex flex-col divide-y divide-steel-seam border border-steel-seam bg-lane-board">
      {tasks.map((task) => {
        const title = task.problems?.title ?? "Untitled problem";
        const meta = problemMetaLine(task.problems?.difficulty, task.problems?.patterns);

        return (
          <li
            key={task.id}
            className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6"
          >
            <div className="flex min-w-0 flex-col gap-2">
              <h2 className="font-display text-xl font-extrabold tracking-tight text-rail uppercase">
                {title}
              </h2>
              {meta ? (
                <p className="font-display text-xs font-bold tracking-[0.16em] text-track-mist uppercase">
                  {meta}
                </p>
              ) : null}
              <ReviewTypeChip type={task.review_type} />
            </div>
            <Link
              href={`/reviews/${task.id}`}
              className="inline-flex h-12 shrink-0 items-center justify-center bg-lane px-6 font-display text-base font-extrabold tracking-[0.12em] text-asphalt uppercase shadow-[0_10px_24px_rgb(15_23_32_/_28%)] transition-[transform,box-shadow,background-color] hover:bg-lane/90 active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lane focus-visible:ring-offset-2 focus-visible:ring-offset-asphalt"
            >
              Start Rep
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function problemMetaLine(
  difficulty: string | undefined,
  patterns: string[] | undefined
) {
  const pattern = patterns?.[0];
  if (difficulty && pattern) {
    return `${difficulty} · ${pattern}`;
  }
  return difficulty ?? "";
}
