"use client";

import { useState, useTransition } from "react";
import { deleteProblem } from "@/lib/problems/actions";

export function DeleteProblemButton({
  problemId,
  title,
}: {
  problemId: string;
  title: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => {
          setError(null);
          setConfirming(true);
        }}
        className="font-display text-sm font-bold tracking-[0.12em] text-track-mist uppercase underline-offset-4 hover:text-rail hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lane/60"
      >
        Delete problem
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-3 border border-destructive/40 px-5 py-4">
      <p className="text-sm leading-relaxed text-rail">
        Delete <span className="font-medium">{title}</span>? This cannot be
        undone.
      </p>
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={pending}
          onClick={() => setConfirming(false)}
          className="font-display h-10 border border-steel-seam px-4 text-sm font-bold tracking-[0.12em] text-rail uppercase hover:bg-lane-pit disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lane/60"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => {
            setError(null);
            startTransition(async () => {
              const result = await deleteProblem(problemId);
              if (result && !result.ok) {
                setError(result.error);
              }
            });
          }}
          className="font-display h-10 bg-destructive/15 px-4 text-sm font-bold tracking-[0.12em] text-destructive uppercase hover:bg-destructive/25 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lane/60"
        >
          {pending ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
}
