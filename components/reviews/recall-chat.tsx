"use client";

import { useEffect, useRef, useState } from "react";
import { CompleteRepForm } from "@/components/reviews/complete-rep-form";
import { JournalReveal } from "@/components/reviews/journal-reveal";
import type { Journal } from "@/lib/journals/types";
import type { Confidence } from "@/lib/problems/types";
import {
  openingRecallLine,
  recallCodaFields,
  recallPromptSteps,
  type RecallPromptStep,
} from "@/lib/reviews/recall";

const composerClass =
  "min-h-24 w-full resize-y rounded-none border border-steel-seam bg-lane-pit px-3 py-3 text-sm leading-relaxed text-rail outline-none transition-[border-color,box-shadow] placeholder:text-track-mist focus-visible:border-rail focus-visible:ring-2 focus-visible:ring-lane/60";

const sendClass =
  "h-12 rounded-none border border-steel-seam bg-transparent px-6 font-display text-sm font-extrabold tracking-[0.12em] text-rail uppercase transition-colors hover:bg-lane-pit disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lane/60";

type ChatText = {
  kind: "text";
  role: "coach" | "user";
  content: string;
};

type ChatComparison = {
  kind: "comparison";
  step: RecallPromptStep;
  answer: string;
};

type ChatLine = ChatText | ChatComparison;

type RecallResponse = {
  message: string;
  advance: boolean;
  stepIndex: number;
  done: boolean;
};

export function RecallChat({
  taskId,
  problemId,
  journal,
  problemTitle,
  currentConfidence,
}: {
  taskId: string;
  problemId: string;
  journal: Journal;
  problemTitle: string;
  currentConfidence: Confidence | null;
}) {
  const steps = recallPromptSteps(journal);
  const codaFields = recallCodaFields(journal);
  const [lines, setLines] = useState<ChatLine[]>([
    {
      kind: "text",
      role: "coach",
      content: openingRecallLine(problemTitle, steps[0]?.prompt ?? ""),
    },
  ]);
  const [stepIndex, setStepIndex] = useState(0);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const threadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const thread = threadRef.current;
    if (!thread) {
      return;
    }

    thread.scrollTop = thread.scrollHeight;
  }, [lines, pending]);

  async function send() {
    const text = draft.trim();
    if (!text || pending || done) {
      return;
    }

    const history = lines.flatMap((line) =>
      line.kind === "text"
        ? [
            {
              role: line.role === "coach" ? "assistant" : "user",
              content: line.content,
            },
          ]
        : []
    );
    const answeredStep = steps[stepIndex];

    setDraft("");
    setError(null);
    setPending(true);
    setLines((current) => [
      ...current,
      { kind: "text", role: "user", content: text },
    ]);

    try {
      const response = await fetch("/api/dev/ollama/recall", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          problemId,
          message: text,
          stepIndex,
          history,
        }),
      });
      const body = (await response.json()) as RecallResponse & { error?: string };
      if (!response.ok) {
        setError(body.error ?? "The coach could not reply.");
        return;
      }

      setStepIndex(body.stepIndex);
      setDone(body.done);
      setLines((current) => {
        const next: ChatLine[] = [...current];
        if (body.message.trim()) {
          next.push({ kind: "text", role: "coach", content: body.message });
        }
        if (body.advance && answeredStep) {
          next.push({ kind: "comparison", step: answeredStep, answer: text });
          const following = steps[body.stepIndex];
          if (!body.done && following) {
            next.push({ kind: "text", role: "coach", content: following.prompt });
          }
        }
        return next;
      });
    } catch {
      setError("The coach could not reply.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex h-[min(36rem,calc(100dvh-8rem))] flex-col border border-steel-seam bg-lane-board">
        <p className="shrink-0 border-b border-steel-seam px-4 py-3 font-display text-xs font-bold tracking-[0.16em] text-track-mist uppercase">
          {Math.min(stepIndex + 1, steps.length)} of {steps.length}
        </p>
        <div
          ref={threadRef}
          tabIndex={0}
          aria-label="Recall conversation"
          className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4 sm:p-5"
        >
          {lines.map((line, index) =>
            line.kind === "comparison" ? (
              <div
                key={`comparison-${index}`}
                className="grid gap-6 md:grid-cols-2 md:gap-8"
              >
                <section className="flex min-w-0 flex-col gap-3 border border-steel-seam bg-lane-pit p-5 sm:p-6">
                  <h2 className="font-display text-lg font-extrabold tracking-tight text-rail uppercase">
                    Your Recall
                  </h2>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap text-rail">
                    {line.answer}
                  </p>
                </section>
                <section className="flex min-w-0 flex-col gap-3 border border-steel-seam bg-lane-pit p-5 sm:p-6">
                  <h2 className="font-display text-lg font-extrabold tracking-tight text-rail uppercase">
                    Your Original Notes
                  </h2>
                  <JournalReveal
                    journal={journal}
                    problemId={problemId}
                    fields={
                      line.step.kind === "text" ? [line.step.field] : line.step.fields
                    }
                  />
                </section>
              </div>
            ) : (
              <p
                key={`${line.role}-${index}`}
                className={
                  line.role === "user"
                    ? "max-w-xl self-end border border-steel-seam bg-lane-pit px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap text-rail"
                    : "max-w-xl border border-steel-seam bg-lane-pit px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap text-rail"
                }
              >
                {line.content}
              </p>
            )
          )}
          {pending ? (
            <p
              className="flex w-fit items-center border border-steel-seam bg-lane-pit px-4 py-3"
              role="status"
              aria-label="The coach is replying"
            >
              <span className="coach-ellipsis text-base" aria-hidden="true">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </span>
            </p>
          ) : null}
        </div>

        {error ? (
          <p className="shrink-0 px-4 pb-4 text-sm text-destructive sm:px-5" role="alert">
            {error}
          </p>
        ) : null}

        {done ? null : (
          <form
            className="flex shrink-0 flex-col gap-4 border-t border-steel-seam p-4 sm:p-5"
            onSubmit={(event) => {
              event.preventDefault();
              void send();
            }}
          >
            <label className="flex flex-col gap-2">
              <span className="sr-only">Message the coach</span>
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    void send();
                  }
                }}
                placeholder="Answer, or ask about the problem."
                className={composerClass}
                disabled={pending}
              />
            </label>
            <button type="submit" className={sendClass} disabled={pending || draft.trim() === ""}>
              Send
            </button>
          </form>
        )}
      </div>

      {done ? (
        <div className="flex flex-col gap-8">
          {codaFields.length > 0 ? (
            <section className="flex min-w-0 flex-col gap-3 border border-steel-seam bg-lane-board p-5 sm:p-6">
              <h2 className="font-display text-lg font-extrabold tracking-tight text-rail uppercase">
                Also in your journal
              </h2>
              <JournalReveal
                journal={journal}
                problemId={problemId}
                fields={codaFields}
              />
            </section>
          ) : null}
          <CompleteRepForm
            taskId={taskId}
            problemId={problemId}
            currentConfidence={currentConfidence}
          />
        </div>
      ) : null}
    </div>
  );
}
