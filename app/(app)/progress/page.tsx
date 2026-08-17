import { EmptyState, ErrorState } from "@/components/app/page-states";
import { AddProblemLink } from "@/components/problems/add-problem-link";
import { ProgressBreakdowns } from "@/components/progress/progress-breakdowns";
import { ProgressHistory } from "@/components/progress/progress-history";
import { ProgressStats } from "@/components/progress/progress-stats";
import { getProgressSnapshot } from "@/lib/progress/queries";

export default async function ProgressPage() {
  const { snapshot, error } = await getProgressSnapshot();

  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-rail uppercase">
        Progress
      </h1>

      {error ? (
        <ErrorState description={error} />
      ) : snapshot.problemsLogged === 0 ? (
        <EmptyState
          title="No progress yet"
          description="Counts and streaks by difficulty and pattern will appear once you log problems and start putting in reps."
          action={<AddProblemLink className="w-fit" />}
        />
      ) : (
        <div className="flex flex-col gap-10">
          <ProgressStats snapshot={snapshot} />
          <ProgressBreakdowns
            difficulty={snapshot.difficulty}
            patterns={snapshot.patterns}
          />
          <ProgressHistory history={snapshot.history} />
        </div>
      )}
    </div>
  );
}
