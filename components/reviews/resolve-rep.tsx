import { ExternalLink } from "lucide-react";
import { CompleteRepForm } from "@/components/reviews/complete-rep-form";
import type { Confidence } from "@/lib/problems/types";

export function ResolveRep({
  taskId,
  problemId,
  leetcodeUrl,
  currentConfidence,
}: {
  taskId: string;
  problemId: string;
  leetcodeUrl: string | null;
  currentConfidence: Confidence | null;
}) {
  return (
    <div className="flex flex-col gap-8">
      <p className="max-w-xl text-base leading-relaxed text-rail/85">
        It&apos;s time to solve this problem again.
      </p>

      {leetcodeUrl ? (
        <a
          href={leetcodeUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-fit items-center gap-2 border border-steel-seam px-4 py-2.5 font-display text-sm font-bold tracking-[0.12em] text-rail uppercase transition-colors hover:bg-lane-pit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lane/60"
        >
          Open on LeetCode
          <ExternalLink className="size-4" aria-hidden />
        </a>
      ) : (
        <p className="text-sm leading-relaxed text-track-mist">
          This problem doesn&apos;t have a LeetCode URL.
        </p>
      )}

      <div className="flex flex-col gap-3">
        <p className="font-display text-xs font-bold tracking-[0.16em] text-track-mist uppercase">
          When you&apos;re finished
        </p>
        <CompleteRepForm
          taskId={taskId}
          problemId={problemId}
          currentConfidence={currentConfidence}
        />
      </div>
    </div>
  );
}
