import { notFound } from "next/navigation";
import { ErrorState } from "@/components/app/page-states";
import {
  DashboardLink,
  RepCompleteNotice,
} from "@/components/reviews/complete-rep-form";
import { RecallRep } from "@/components/reviews/recall-rep";
import { ResolveRep } from "@/components/reviews/resolve-rep";
import { ReviewTypeChip } from "@/components/reviews/review-type-chip";
import { formatCompletedDate } from "@/lib/problems/validation";
import { getReviewRep } from "@/lib/reviews/queries";
import { canStartRep } from "@/lib/reviews/rep";
import { taskStatus, todayYmd } from "@/lib/reviews/schedule";
import type { ReviewProblem } from "@/lib/reviews/types";

export default async function ReviewRepPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { rep, error } = await getReviewRep(id);

  if (error) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-rail uppercase">
          Rep
        </h1>
        <ErrorState description={error} />
      </div>
    );
  }

  if (!rep) {
    notFound();
  }

  const status = taskStatus(
    rep.scheduled_for,
    rep.completed_at,
    todayYmd()
  );
  const title = rep.problems?.title ?? "This problem";

  if (status === "upcoming") {
    return (
      <RepShell
        title={title}
        problem={rep.problems}
        reviewType={rep.review_type}
      >
        <div className="flex flex-col gap-4 border border-steel-seam bg-lane-pit p-6 sm:p-8">
          <h2 className="font-display text-xl font-extrabold tracking-tight text-rail uppercase">
            This rep isn&apos;t due yet
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-track-mist">
            Scheduled for {formatCompletedDate(rep.scheduled_for)}. Come back
            on that day.
          </p>
          <DashboardLink />
        </div>
      </RepShell>
    );
  }

  if (status === "done") {
    return (
      <RepShell
        title={title}
        problem={rep.problems}
        reviewType={rep.review_type}
      >
        <RepCompleteNotice
          completedAt={rep.completed_at}
          problemId={rep.problem_id}
          taskId={rep.id}
          currentConfidence={rep.problems?.confidence ?? null}
          cycleComplete={rep.cycleComplete}
        />
      </RepShell>
    );
  }

  if (!canStartRep(status)) {
    notFound();
  }

  return (
    <RepShell
      title={title}
      problem={rep.problems}
      reviewType={rep.review_type}
    >
      {rep.review_type === "Recall" ? (
        <RecallRep
          taskId={rep.id}
          problemId={rep.problem_id}
          journal={rep.journal}
          currentConfidence={rep.problems?.confidence ?? null}
        />
      ) : (
        <ResolveRep
          taskId={rep.id}
          problemId={rep.problem_id}
          leetcodeUrl={rep.problems?.leetcode_url ?? null}
          currentConfidence={rep.problems?.confidence ?? null}
        />
      )}
    </RepShell>
  );
}

function RepShell({
  title,
  problem,
  reviewType,
  children,
}: {
  title: string;
  problem: ReviewProblem | null;
  reviewType: "Recall" | "Re-solve";
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-8">
      <DashboardLink label="Back to today's reps" />
      <header className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <ReviewTypeChip type={reviewType} />
        </div>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-rail uppercase">
          {title}
        </h1>
        {problem ? (
          <p className="font-display text-sm font-bold tracking-[0.12em] text-track-mist uppercase">
            {problemMetaLine(problem)}
          </p>
        ) : null}
      </header>
      {children}
    </div>
  );
}

function problemMetaLine(problem: ReviewProblem) {
  const pattern = problem.patterns[0];
  return pattern
    ? `${problem.difficulty} · ${pattern}`
    : problem.difficulty;
}
