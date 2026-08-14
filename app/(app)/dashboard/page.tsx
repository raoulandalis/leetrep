import { EmptyState, ErrorState } from "@/components/app/page-states";
import { DueRepList } from "@/components/reviews/due-rep-list";
import { listDueReviewTasks } from "@/lib/reviews/queries";
import { todayYmd } from "@/lib/reviews/schedule";

export default async function DashboardPage() {
  const { tasks, error } = await listDueReviewTasks(todayYmd());

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-rail uppercase">
        Today&apos;s Reps
      </h1>

      {error ? (
        <ErrorState description={error} />
      ) : tasks.length === 0 ? (
        <EmptyState
          title="No reps yet"
          description="Today's Reps will land here once you log problems and schedule reviews."
        />
      ) : (
        <DueRepList tasks={tasks} />
      )}
    </div>
  );
}
