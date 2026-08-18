import Link from "next/link";
import { ReviewTypeChip } from "@/components/reviews/review-type-chip";
import type { Confidence } from "@/lib/problems/types";
import { formatCompletedDate } from "@/lib/problems/validation";
import { canStartRep } from "@/lib/reviews/rep";
import { taskStatus, todayYmd } from "@/lib/reviews/schedule";
import type { ReviewStatus, ReviewTask } from "@/lib/reviews/types";
import { cn } from "@/lib/utils";

const STATUS_LABEL: Record<ReviewStatus, string> = {
  upcoming: "Upcoming",
  due: "Due today",
  overdue: "Overdue",
  done: "Done",
};

function statusTone(status: ReviewStatus) {
  switch (status) {
    case "due":
      return "text-lane";
    case "overdue":
      return "text-signal";
    case "done":
      return "text-track-mist/70";
    default:
      return "text-track-mist";
  }
}

export function ReviewSchedule({
  tasks,
  confidence,
}: {
  tasks: ReviewTask[];
  confidence: Confidence | null;
}) {
  const today = todayYmd();

  return (
    <section className="min-w-0 border border-steel-seam bg-lane-pit p-6 sm:p-8">
      <h2 className="font-display text-xl font-extrabold tracking-tight text-rail uppercase">
        Review schedule
      </h2>
      <p className="mt-2 mb-8 max-w-xl text-sm leading-relaxed text-track-mist">
        Five reps over the next 30 days — recall the approach, then re-solve on
        LeetCode.
      </p>

      {tasks.length === 0 ? (
        <p className="text-sm leading-relaxed text-track-mist">
          {confidence === "Confident"
            ? "You're not reviewing this one. Change confidence to add it to the queue."
            : "No review dates yet. Open this problem again in a moment."}
        </p>
      ) : (
        <ol className="flex flex-col divide-y divide-steel-seam border-t border-steel-seam">
          {tasks.map((task) => {
            const status = taskStatus(
              task.scheduled_for,
              task.completed_at,
              today
            );
            const startable = canStartRep(status);

            return (
              <li
                key={task.id}
                className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
              >
                <div className="flex min-w-0 flex-col gap-2">
                  <p className="font-display text-base font-bold tracking-tight text-rail">
                    {formatCompletedDate(task.scheduled_for)}
                  </p>
                  <ReviewTypeChip type={task.review_type} bordered />
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <p
                    className={cn(
                      "font-display text-xs font-bold tracking-[0.16em] uppercase",
                      statusTone(status)
                    )}
                  >
                    {STATUS_LABEL[status]}
                  </p>
                  {startable ? (
                    <Link
                      href={`/reviews/${task.id}`}
                      className="inline-flex h-10 items-center justify-center bg-lane px-4 font-display text-sm font-extrabold tracking-[0.12em] text-asphalt uppercase transition-colors hover:bg-lane/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lane focus-visible:ring-offset-2 focus-visible:ring-offset-asphalt"
                    >
                      Start Rep
                    </Link>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
