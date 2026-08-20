"use client";

import { useActionState, type ReactNode } from "react";
import Link from "next/link";
import { ConfidenceHelp } from "@/components/problems/confidence-help";
import { confidenceTone } from "@/components/problems/problem-list";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ActionResult, Confidence } from "@/lib/problems/types";
import { CONFIDENCE_LEVELS } from "@/lib/problems/types";
import {
  completeRepAction,
  updateProblemConfidenceAction,
} from "@/lib/reviews/actions";

const primaryCtaClass =
  "h-12 w-full max-w-md rounded-none bg-lane font-display text-base font-extrabold tracking-[0.12em] text-asphalt uppercase shadow-[0_10px_24px_rgb(15_23_32_/_28%)] transition-[transform,box-shadow,background-color] hover:bg-lane/90 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lane focus-visible:ring-offset-2 focus-visible:ring-offset-asphalt";

export function CompleteRepForm({
  taskId,
  problemId,
  currentConfidence,
  leading,
}: {
  taskId: string;
  problemId: string;
  currentConfidence: Confidence | null;
  leading?: ReactNode;
}) {
  const [state, formAction, pending] = useActionState(
    completeRepAction,
    null as ActionResult | null
  );

  if (state?.ok) {
    return (
      <RepCompleteNotice
        problemId={problemId}
        taskId={taskId}
        currentConfidence={currentConfidence}
        cycleComplete={Boolean(state.cycleComplete)}
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {state && !state.ok ? (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}
      <div
        className={
          leading ? "flex w-full flex-row gap-3" : undefined
        }
      >
        {leading ? <div className="min-w-0 flex-1">{leading}</div> : null}
        <form
          action={formAction}
          className={leading ? "min-w-0 flex-1" : undefined}
        >
          <input type="hidden" name="id" value={taskId} />
          <Button
            type="submit"
            disabled={pending}
            className={cn(primaryCtaClass, leading && "max-w-none")}
          >
            {pending ? "Completing..." : "Complete Rep"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export function RepCompleteNotice({
  completedAt,
  problemId,
  taskId,
  currentConfidence,
  cycleComplete = false,
}: {
  completedAt?: string | null;
  problemId?: string;
  taskId?: string;
  currentConfidence?: Confidence | null;
  cycleComplete?: boolean;
}) {
  return (
    <div className="flex flex-col gap-4 border border-steel-seam bg-lane-board p-6 sm:p-8">
      <h2 className="font-display text-xl font-extrabold tracking-tight text-rail uppercase">
        Rep complete
      </h2>
      {completedAt ? (
        <p className="text-sm leading-relaxed text-track-mist">
          Finished {formatCompletedAt(completedAt)}.
        </p>
      ) : (
        <p className="text-sm leading-relaxed text-track-mist">
          This rep is done. Come back when the next one is due.
        </p>
      )}
      {cycleComplete && problemId && taskId ? (
        <CycleConfidenceForm
          problemId={problemId}
          taskId={taskId}
          currentConfidence={currentConfidence ?? null}
        />
      ) : null}
      <DashboardLink />
    </div>
  );
}

function CycleConfidenceForm({
  problemId,
  taskId,
  currentConfidence,
}: {
  problemId: string;
  taskId: string;
  currentConfidence: Confidence | null;
}) {
  const [state, formAction, pending] = useActionState(
    updateProblemConfidenceAction,
    null as ActionResult | null
  );

  if (state?.ok) {
    return (
      <p className="text-sm leading-relaxed text-track-mist" role="status">
        Saved.
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="problem_id" value={problemId} />
      <input type="hidden" name="review_id" value={taskId} />
      <div className="flex items-center gap-2">
        <p
          id="cycle-confidence-label"
          className="font-display text-xs font-bold tracking-[0.16em] text-track-mist uppercase"
        >
          How does this feel now?
        </p>
        <ConfidenceHelp onRail={false} />
      </div>
      <p className="text-sm leading-relaxed text-track-mist">
        Needs work or Keep practicing starts another 5-rep cycle. Confident
        leaves this off the queue. You can skip.
      </p>
      <div
        role="group"
        aria-labelledby="cycle-confidence-label"
        className="grid grid-cols-1 gap-1 border border-steel-seam bg-lane-pit p-1 sm:grid-cols-3"
      >
        {CONFIDENCE_LEVELS.map((option) => {
          const selected = currentConfidence === option;
          return (
            <button
              key={option}
              type="submit"
              name="confidence"
              value={option}
              disabled={pending}
              className={cn(
                "font-display h-10 px-2 text-xs font-bold tracking-[0.06em] uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lane/60 sm:text-sm sm:tracking-[0.08em]",
                selected
                  ? confidenceTone(option)
                  : "text-track-mist hover:text-rail"
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
      {state && !state.ok ? (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}

export function DashboardLink({ label = "Back to dashboard" }: { label?: string }) {
  return (
    <Link
      href="/dashboard"
      className="w-fit font-display text-sm font-bold tracking-[0.12em] text-rail uppercase underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lane/60"
    >
      {label}
    </Link>
  );
}

function formatCompletedAt(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }

  return date.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
