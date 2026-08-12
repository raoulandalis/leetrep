import Link from "next/link";
import { EmptyState, ErrorState } from "@/components/app/page-states";
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

      {problems.length === 0 ? (
        <EmptyState
          title="No problems logged"
          description="Your solved LeetCode problems will show up here when you start adding them."
        />
      ) : error ? (
        <ErrorState description={error} />
      ) : (
        <ProblemList problems={problems} />
      )}
    </div>
  );
}

function AddProblemLink() {
  return (
    <Link
      href="/problems/new"
      className="inline-flex h-12 items-center justify-center bg-lane px-6 font-display text-base font-extrabold tracking-[0.12em] text-asphalt uppercase shadow-[0_10px_24px_rgb(15_23_32_/_28%)] transition-[transform,box-shadow,background-color] hover:bg-lane/90 active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lane focus-visible:ring-offset-2 focus-visible:ring-offset-asphalt"
    >
      + Add Problem
    </Link>
  );
}
