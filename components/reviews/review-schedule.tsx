import { cn } from "@/lib/utils";
import { taskStatus, todayYmd } from "@/lib/reviews/schedule";
import type { ReviewStatus, ReviewTask, ReviewType } from "@/lib/reviews/types";
import { formatCompletedDate } from "@/lib/problems/validation";

const STATUS_LABEL: Record<ReviewStatus, string> = {
  upcoming: "Upcoming",
  due: "Due today",
  overdue: "Overdue",
  done: "Done",
};

function typeTone(type: ReviewType) {
  return type === "Recall"
    ? "border-lane/40 text-lane"
    : "border-cobalt/40 text-cobalt";
}

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

export function ReviewSchedule({ tasks }: { tasks: ReviewTask[] }) {
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
          No review dates yet. Open this problem again in a moment.
        </p>
      ) : (
        <ol className="flex flex-col divide-y divide-steel-seam border-t border-steel-seam">
          {tasks.map((task) => {
            const status = taskStatus(
              task.scheduled_for,
              task.completed_at,
              today
            );

            return (
              <li
                key={task.id}
                className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
              >
                <div className="flex min-w-0 flex-col gap-2">
                  <p className="font-display text-base font-bold tracking-tight text-rail">
                    {formatCompletedDate(task.scheduled_for)}
                  </p>
                  <span
                    className={cn(
                      "w-fit font-display px-2 py-0.5 text-xs font-bold tracking-[0.16em] uppercase border",
                      typeTone(task.review_type)
                    )}
                  >
                    {task.review_type}
                  </span>
                </div>
                <p
                  className={cn(
                    "font-display text-xs font-bold tracking-[0.16em] uppercase",
                    statusTone(status)
                  )}
                >
                  {STATUS_LABEL[status]}
                </p>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
