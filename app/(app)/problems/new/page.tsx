import Link from "next/link";
import { ProblemForm } from "@/components/problems/problem-form";
import { createProblem } from "@/lib/problems/actions";

export default function NewProblemPage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <Link
          href="/problems"
          className="w-fit font-display text-xs font-bold tracking-[0.16em] text-track-mist uppercase underline-offset-4 hover:text-rail hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lane/60"
        >
          Back to problems
        </Link>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-rail uppercase">
          Add Problem
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-track-mist">
          Log a problem you already solved. Enter the details yourself — LeetRep
          does not pull them from LeetCode.
        </p>
      </header>

      <div className="w-full max-w-xl border border-steel-seam bg-rail p-6 text-asphalt sm:p-8">
        <ProblemForm
          action={createProblem}
          submitLabel="Save problem"
          pendingLabel="Saving..."
        />
      </div>
    </div>
  );
}
