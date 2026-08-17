import { EmptyState, ErrorState } from "@/components/app/page-states";
import { AddProblemLink } from "@/components/problems/add-problem-link";
import { ProblemList } from "@/components/problems/problem-list";
import { listProblems } from "@/lib/problems/queries";

export default async function ProblemsPage() {
  const { problems, error } = await listProblems();

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-rail uppercase">
          Problems
        </h1>
        <AddProblemLink />
      </header>

      {error ? (
        <ErrorState description={error} />
      ) : problems.length === 0 ? (
        <EmptyState
          title="No problems logged"
          description="Your solved LeetCode problems will show up here when you start adding them."
          action={<AddProblemLink className="w-fit" />}
        />
      ) : (
        <ProblemList problems={problems} />
      )}
    </div>
  );
}
