"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CompleteRepForm } from "@/components/reviews/complete-rep-form";
import { JournalReveal } from "@/components/reviews/journal-reveal";
import {
  COMPLEXITY_OPTIONS,
  type Journal,
} from "@/lib/journals/types";
import { JOURNAL_FIELDS } from "@/lib/journals/validation";
import type { Confidence } from "@/lib/problems/types";
import {
  canCommitComplexity,
  recallCodaFields,
  recallPromptSteps,
  type RecallComplexityField,
  type RecallPromptStep,
  type RecallTextField,
} from "@/lib/reviews/recall";
import { canRevealRecall, journalHasContent } from "@/lib/reviews/rep";
import { cn } from "@/lib/utils";

const textareaClass =
  "min-h-40 w-full resize-y rounded-none border border-steel-seam bg-lane-pit px-3 py-3 text-sm leading-relaxed text-rail outline-none transition-[border-color,box-shadow] placeholder:text-track-mist focus-visible:border-rail focus-visible:ring-2 focus-visible:ring-lane/60";

const selectClass =
  "h-11 w-full appearance-none rounded-none border border-steel-seam bg-lane-pit px-3 pr-10 text-sm text-rail outline-none transition-[border-color,box-shadow] focus-visible:border-rail focus-visible:ring-2 focus-visible:ring-lane/60";

const revealCtaClass =
  "h-12 w-fit min-w-44 rounded-none border border-steel-seam bg-transparent px-8 font-display text-base font-extrabold tracking-[0.12em] text-rail uppercase transition-colors hover:bg-lane-pit disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lane/60";

type RecallAnswers = Partial<
  Record<RecallTextField | RecallComplexityField, string>
>;

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
  if (!journal || !journalHasContent(journal)) {
    return (
      <div className="flex flex-col gap-8">
        <p className="max-w-xl text-base leading-relaxed text-rail/85">
          Can you remember how you solved this?
        </p>
        <JournalReveal journal={journal} problemId={problemId} />
      </div>
    );
  }

  return (
    <RecallQuiz
      taskId={taskId}
      problemId={problemId}
      journal={journal}
      currentConfidence={currentConfidence}
    />
  );
}

function RecallQuiz({
  taskId,
  problemId,
  journal,
  currentConfidence,
}: {
  taskId: string;
  problemId: string;
  journal: Journal;
  currentConfidence: Confidence | null;
}) {
  const steps = recallPromptSteps(journal);
  const codaFields = recallCodaFields(journal);
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<RecallAnswers>({});
  const [textDraft, setTextDraft] = useState("");
  const [complexityDraft, setComplexityDraft] = useState<
    Partial<Record<RecallComplexityField, string>>
  >({});
  const promptRef = useRef<HTMLTextAreaElement | HTMLSelectElement | null>(
    null
  );
  const formId = useId();
  const promptId = `${formId}-prompt`;

  const activeStep = steps[stepIndex];
  const quizDone = stepIndex >= steps.length;
  const committedSteps = steps.slice(0, stepIndex);

  useEffect(() => {
    promptRef.current?.focus();
  }, [stepIndex]);

  const canCommit = activeStep
    ? activeStep.kind === "text"
      ? canRevealRecall(textDraft)
      : canCommitComplexity(activeStep.fields, complexityDraft)
    : false;

  function commit() {
    if (!activeStep || !canCommit) {
      return;
    }

    if (activeStep.kind === "text") {
      setAnswers((current) => ({
        ...current,
        [activeStep.field]: textDraft.trim(),
      }));
      setTextDraft("");
    } else {
      const next: RecallAnswers = {};
      for (const field of activeStep.fields) {
        const value = complexityDraft[field];
        if (value) {
          next[field] = value;
        }
      }
      setAnswers((current) => ({ ...current, ...next }));
      setComplexityDraft({});
    }

    setStepIndex((current) => current + 1);
  }

  return (
    <div className="flex flex-col gap-8">
      <p className="max-w-xl text-base leading-relaxed text-rail/85">
        Can you remember how you solved this?
      </p>

      {committedSteps.length > 0 ? (
        <div className="flex flex-col gap-6">
          {committedSteps.map((step, index) => (
            <ComparisonPair
              key={stepKey(step)}
              step={step}
              answers={answers}
              journal={journal}
              problemId={problemId}
              animate={index === committedSteps.length - 1}
            />
          ))}
        </div>
      ) : null}

      {activeStep ? (
        <form
          className="flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            commit();
          }}
        >
          <div className="flex flex-col gap-2">
            <p className="font-display text-xs font-bold tracking-[0.16em] text-track-mist uppercase">
              {stepIndex + 1} of {steps.length}
            </p>
            {activeStep.kind === "text" ? (
              <label
                htmlFor={promptId}
                className="font-display text-lg font-extrabold tracking-tight text-rail uppercase"
              >
                {activeStep.prompt}
              </label>
            ) : (
              <p
                id={promptId}
                className="font-display text-lg font-extrabold tracking-tight text-rail uppercase"
              >
                {activeStep.prompt}
              </p>
            )}
          </div>

          {activeStep.kind === "text" ? (
            <textarea
              id={promptId}
              ref={(node) => {
                promptRef.current = node;
                return () => {
                  promptRef.current = null;
                };
              }}
              value={textDraft}
              onChange={(event) => setTextDraft(event.target.value)}
              onKeyDown={(event) => {
                if (
                  (event.metaKey || event.ctrlKey) &&
                  event.key === "Enter"
                ) {
                  event.preventDefault();
                  commit();
                }
              }}
              placeholder={textPlaceholder(activeStep.field)}
              className={textareaClass}
            />
          ) : (
            <div
              role="group"
              aria-labelledby={promptId}
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-4"
            >
              {activeStep.fields.map((field, index) => (
                <div key={field} className="flex flex-col gap-2">
                  <label
                    htmlFor={`${promptId}-${field}`}
                    className="font-display text-xs font-bold tracking-[0.16em] text-rail uppercase"
                  >
                    {fieldLabel(field)}
                  </label>
                  <div className="relative">
                    <select
                      id={`${promptId}-${field}`}
                      ref={
                        index === 0
                          ? (node) => {
                              promptRef.current = node;
                              return () => {
                                promptRef.current = null;
                              };
                            }
                          : undefined
                      }
                      value={complexityDraft[field] ?? ""}
                      onChange={(event) =>
                        setComplexityDraft((current) => ({
                          ...current,
                          [field]: event.target.value,
                        }))
                      }
                      className={selectClass}
                    >
                      <option value="">Select</option>
                      {COMPLEXITY_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-rail"
                      aria-hidden
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <Button
            type="submit"
            disabled={!canCommit}
            className={revealCtaClass}
          >
            Compare with my notes
          </Button>
        </form>
      ) : null}

      {quizDone ? (
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

function ComparisonPair({
  step,
  answers,
  journal,
  problemId,
  animate,
}: {
  step: RecallPromptStep;
  answers: RecallAnswers;
  journal: Journal;
  problemId: string;
  animate: boolean;
}) {
  return (
    <div
      className={cn(
        "grid gap-6 md:grid-cols-2 md:gap-8",
        animate && "recall-unlock"
      )}
    >
      <section className="flex min-w-0 flex-col gap-3 border border-steel-seam bg-lane-pit p-5 sm:p-6">
        <h2 className="font-display text-lg font-extrabold tracking-tight text-rail uppercase">
          Your Recall
        </h2>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-rail">
          {recallSummary(step, answers)}
        </p>
      </section>
      <section className="flex min-w-0 flex-col gap-3 border border-steel-seam bg-lane-board p-5 sm:p-6">
        <h2 className="font-display text-lg font-extrabold tracking-tight text-rail uppercase">
          Your Original Notes
        </h2>
        <JournalReveal
          journal={journal}
          problemId={problemId}
          fields={stepFields(step)}
        />
      </section>
    </div>
  );
}

function stepKey(step: RecallPromptStep) {
  return step.kind === "text" ? step.field : step.fields.join("-");
}

function stepFields(step: RecallPromptStep) {
  return step.kind === "text" ? [step.field] : step.fields;
}

function fieldLabel(name: RecallTextField | RecallComplexityField) {
  const field = JOURNAL_FIELDS.find((entry) => entry.name === name);
  return field?.label ?? name;
}

function textPlaceholder(name: RecallTextField) {
  const field = JOURNAL_FIELDS.find((entry) => entry.name === name);
  return field && "placeholder" in field ? field.placeholder : undefined;
}

function recallSummary(step: RecallPromptStep, answers: RecallAnswers) {
  if (step.kind === "text") {
    return answers[step.field]?.trim() ?? "";
  }

  return step.fields
    .map((field) => {
      const value = answers[field];
      if (!value) {
        return null;
      }
      return `${fieldLabel(field)}: ${value}`;
    })
    .filter((line): line is string => Boolean(line))
    .join("\n");
}
