"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CompleteRepForm } from "@/components/reviews/complete-rep-form";
import { JournalReveal } from "@/components/reviews/journal-reveal";
import type { Journal } from "@/lib/journals/types";
import type { Confidence } from "@/lib/problems/types";
import { canRevealRecall } from "@/lib/reviews/rep";

const textareaClass =
  "min-h-40 w-full resize-y rounded-none border border-steel-seam bg-lane-pit px-3 py-3 text-sm leading-relaxed text-rail outline-none transition-[border-color,box-shadow] placeholder:text-track-mist focus-visible:border-rail focus-visible:ring-2 focus-visible:ring-lane/60";

const revealCtaClass =
  "h-12 w-fit min-w-44 rounded-none border border-steel-seam bg-transparent px-8 font-display text-base font-extrabold tracking-[0.12em] text-rail uppercase transition-colors hover:bg-lane-pit disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lane/60";

export function RecallRep({
  taskId,
  problemId,
  journal,
  currentConfidence,
}: {
  taskId: string;
  problemId: string;
  journal: Journal | null;
  currentConfidence: Confidence | null;
}) {
  const [recall, setRecall] = useState("");
  const [revealed, setRevealed] = useState(false);
  const canReveal = canRevealRecall(recall);

  return (
    <div className="flex flex-col gap-8">
      <p className="max-w-xl text-base leading-relaxed text-rail/85">
        Can you remember how you solved this?
      </p>

      {!revealed ? (
        <div className="flex flex-col gap-4">
          <label htmlFor="recall-approach" className="sr-only">
            Your recall
          </label>
          <textarea
            id="recall-approach"
            value={recall}
            onChange={(event) => setRecall(event.target.value)}
            placeholder="I would use a hash map to store…"
            className={textareaClass}
          />
          <Button
            type="button"
            disabled={!canReveal}
            className={revealCtaClass}
            onClick={() => setRevealed(true)}
          >
            Reveal My Notes
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          <div className="grid gap-6 md:grid-cols-2 md:gap-8">
            <section className="flex min-w-0 flex-col gap-3 border border-steel-seam bg-lane-pit p-5 sm:p-6">
              <h2 className="font-display text-lg font-extrabold tracking-tight text-rail uppercase">
                Your Recall
              </h2>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-rail">
                {recall.trim()}
              </p>
            </section>
            <section className="flex min-w-0 flex-col gap-3 border border-steel-seam bg-lane-board p-5 sm:p-6">
              <h2 className="font-display text-lg font-extrabold tracking-tight text-rail uppercase">
                Your Original Notes
              </h2>
              <JournalReveal journal={journal} problemId={problemId} />
            </section>
          </div>
          <CompleteRepForm
            taskId={taskId}
            problemId={problemId}
            currentConfidence={currentConfidence}
          />
        </div>
      )}
    </div>
  );
}
