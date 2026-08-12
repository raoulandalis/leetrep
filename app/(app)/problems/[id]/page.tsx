import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { ErrorState } from "@/components/app/page-states";
import { DeleteProblemButton } from "@/components/problems/delete-problem-button";
import { ProblemForm } from "@/components/problems/problem-form";
import {
  DifficultyChip,
  PatternChip,
} from "@/components/problems/problem-list";
import { updateProblem } from "@/lib/problems/actions";
import { getProblem } from "@/lib/problems/queries";
import { formatCompletedDate } from "@/lib/problems/validation";

export default async function ProblemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { problem, error } = await getProblem(id);

  if (error) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-rail uppercase">
          Problem
        </h1>
        <ErrorState description={error} />
      </div>
    );
  }

  if (!problem) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-4">
        <Link
          href="/problems"
          className="w-fit font-display text-xs font-bold tracking-[0.16em] text-track-mist uppercase underline-offset-4 hover:text-rail hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lane/60"
        >
          Back to problems
        </Link>
        <div className="flex flex-col gap-3">
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-rail uppercase">
            {problem.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <DifficultyChip difficulty={problem.difficulty} />
            {problem.patterns.map((tag) => (
              <PatternChip key={tag} label={tag} />
            ))}
          </div>
          <p className="text-sm text-track-mist">
            Completed {formatCompletedDate(problem.date_completed)}
          </p>
        </div>
        <a
          href={problem.leetcode_url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-fit items-center gap-2 border border-steel-seam px-4 py-2.5 font-display text-sm font-bold tracking-[0.12em] text-rail uppercase transition-colors hover:bg-lane-pit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lane/60"
        >
          Open on LeetCode
          <ExternalLink className="size-4" aria-hidden />
        </a>
      </header>

      <div className="w-full max-w-xl border border-steel-seam bg-rail p-6 text-asphalt sm:p-8">
        <h2 className="font-display mb-6 text-xl font-extrabold tracking-tight text-asphalt uppercase">
          Edit problem
        </h2>
        <ProblemForm
          problem={problem}
          action={updateProblem}
          submitLabel="Save changes"
          pendingLabel="Saving..."
        />
      </div>

      <DeleteProblemButton problemId={problem.id} title={problem.title} />
    </div>
  );
}
