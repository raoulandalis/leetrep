"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { completeRepAction } from "@/lib/reviews/actions";
import type { ActionResult } from "@/lib/problems/types";

const primaryCtaClass =
  "h-12 w-full max-w-md rounded-none bg-lane font-display text-base font-extrabold tracking-[0.12em] text-asphalt uppercase shadow-[0_10px_24px_rgb(15_23_32_/_28%)] transition-[transform,box-shadow,background-color] hover:bg-lane/90 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lane focus-visible:ring-offset-2 focus-visible:ring-offset-asphalt";

export function CompleteRepForm({ taskId }: { taskId: string }) {
  const [state, formAction, pending] = useActionState(
    completeRepAction,
    null as ActionResult | null
  );

  if (state?.ok) {
    return <RepCompleteNotice />;
  }

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="id" value={taskId} />
      {state && !state.ok ? (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}
      <Button type="submit" disabled={pending} className={primaryCtaClass}>
        {pending ? "Completing..." : "Complete Rep"}
      </Button>
    </form>
  );
}

export function RepCompleteNotice({
  completedAt,
}: {
  completedAt?: string | null;
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
      <DashboardLink />
    </div>
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
