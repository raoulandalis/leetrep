import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronDown, ExternalLink } from "lucide-react";
import { ErrorState } from "@/components/app/page-states";
import { JournalForm } from "@/components/journals/journal-form";
import { DeleteProblemButton } from "@/components/problems/delete-problem-button";
import { ProblemForm } from "@/components/problems/problem-form";
import {
  ConfidenceChip,
  DifficultyChip,
  PatternChip,
} from "@/components/problems/problem-list";
import { ReviewSchedule } from "@/components/reviews/review-schedule";
import { saveJournal } from "@/lib/journals/actions";
import { getJournal } from "@/lib/journals/queries";
import { updateProblem } from "@/lib/problems/actions";
import { getProblem } from "@/lib/problems/queries";
import { ensureReviewTasks } from "@/lib/reviews/persist";
import { listReviewTasksForProblem } from "@/lib/reviews/queries";
import { formatCompletedDate } from "@/lib/problems/validation";

export default async function ProblemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [{ problem, error }, { journal, error: journalError }] =
    await Promise.all([getProblem(id), getJournal(id)]);

  if (error || journalError) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-rail uppercase">
          Problem
        </h1>
        <ErrorState
          description={error ?? journalError ?? "Couldn't load this page."}
        />
      </div>
    );
  }

  if (!problem) {
    notFound();
  }

  const { error: ensureError } = await ensureReviewTasks(id);
  const { tasks, error: reviewError } = ensureError
    ? { tasks: [], error: ensureError }
    : await listReviewTasksForProblem(id);

  return (
    <div className="flex flex-col gap-8">
      <Link
        href="/problems"
        className="w-fit font-display text-xs font-bold tracking-[0.16em] text-track-mist uppercase underline-offset-4 hover:text-rail hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lane/60"
      >
        Back to problems
      </Link>

      <aside className="flex flex-col border border-steel-seam bg-rail p-6 text-asphalt sm:p-8">
        <div className="flex flex-col gap-4">
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-asphalt uppercase">
            {problem.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <DifficultyChip difficulty={problem.difficulty} />
            {problem.confidence ? (
              <ConfidenceChip confidence={problem.confidence} onRail />
            ) : null}
            {problem.patterns.map((tag) => (
              <PatternChip key={tag} label={tag} onRail />
            ))}
          </div>
          <p className="text-sm text-asphalt/60">
            Completed {formatCompletedDate(problem.date_completed)}
          </p>
          <a
            href={problem.leetcode_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-fit items-center gap-2 border border-asphalt/20 px-4 py-2.5 font-display text-sm font-bold tracking-[0.12em] text-asphalt uppercase transition-colors hover:bg-asphalt/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lane/60"
          >
            Open on LeetCode
            <ExternalLink className="size-4" aria-hidden />
          </a>
        </div>

        <details className="group mt-6 border-t border-asphalt/10 pt-4">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-display text-sm font-bold tracking-[0.12em] text-asphalt/55 uppercase outline-none hover:text-asphalt focus-visible:ring-2 focus-visible:ring-lane/60 [&::-webkit-details-marker]:hidden">
            Edit problem
            <ChevronDown
              className="size-4 shrink-0 transition-transform group-open:rotate-180"
              aria-hidden
            />
          </summary>
          <div className="pt-6">
            <ProblemForm
              problem={problem}
              action={updateProblem}
              submitLabel="Save changes"
              pendingLabel="Saving..."
            />
          </div>
        </details>
      </aside>

      <section className="min-w-0 border border-steel-seam bg-lane-board p-6 sm:p-8">
        <h2 className="font-display text-xl font-extrabold tracking-tight text-rail uppercase">
          Journal
        </h2>
        <p className="mt-2 mb-8 max-w-xl text-sm leading-relaxed text-track-mist">
          Write this in your own words — this is what you will recall later.
        </p>
        <JournalForm
          problemId={problem.id}
          journal={journal}
          action={saveJournal}
        />
      </section>

      {reviewError ? (
        <ErrorState
          title="Couldn't load reviews"
          description={reviewError}
        />
      ) : (
        <ReviewSchedule tasks={tasks} confidence={problem.confidence} />
      )}

      <DeleteProblemButton problemId={problem.id} title={problem.title} />
    </div>
  );
}
