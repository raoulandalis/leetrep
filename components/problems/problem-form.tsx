"use client";

import { useActionState, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ActionResult, Difficulty, Problem } from "@/lib/problems/types";
import { DIFFICULTIES } from "@/lib/problems/types";
import { patternsToInput } from "@/lib/problems/validation";

const fieldClass =
  "h-11 w-full border border-asphalt/20 bg-white px-3 text-sm text-asphalt outline-none transition-[border-color,box-shadow] placeholder:text-asphalt/35 focus-visible:border-asphalt focus-visible:ring-2 focus-visible:ring-lane/60";

const labelClass =
  "font-display text-xs font-bold tracking-[0.16em] text-asphalt/55 uppercase";

type ProblemFormProps = {
  problem?: Problem;
  action: (
    prev: ActionResult | null,
    formData: FormData
  ) => Promise<ActionResult>;
  submitLabel: string;
  pendingLabel: string;
};

export function ProblemForm({
  problem,
  action,
  submitLabel,
  pendingLabel,
}: ProblemFormProps) {
  const [state, formAction, pending] = useActionState(action, null);
  const [difficulty, setDifficulty] = useState<Difficulty>(
    problem?.difficulty ?? "Easy"
  );

  const fieldErrors = state && !state.ok ? state.fieldErrors : undefined;

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {problem ? <input type="hidden" name="id" value={problem.id} /> : null}
      <input type="hidden" name="difficulty" value={difficulty} />

      <Field
        id="leetcode_url"
        label="Problem URL"
        error={fieldErrors?.leetcode_url}
      >
        <input
          id="leetcode_url"
          name="leetcode_url"
          type="url"
          required
          defaultValue={problem?.leetcode_url ?? ""}
          placeholder="https://leetcode.com/problems/two-sum/"
          aria-invalid={fieldErrors?.leetcode_url ? true : undefined}
          aria-describedby={
            fieldErrors?.leetcode_url ? "leetcode_url-error" : undefined
          }
          className={fieldClass}
        />
      </Field>

      <Field id="title" label="Problem Title" error={fieldErrors?.title}>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={problem?.title ?? ""}
          placeholder="Two Sum"
          aria-invalid={fieldErrors?.title ? true : undefined}
          aria-describedby={fieldErrors?.title ? "title-error" : undefined}
          className={fieldClass}
        />
      </Field>

      <div className="flex flex-col gap-2">
        <p id="difficulty-label" className={labelClass}>
          Difficulty
        </p>
        <div
          role="radiogroup"
          aria-labelledby="difficulty-label"
          className="grid grid-cols-3 gap-1 border border-asphalt/15 bg-asphalt/5 p-1"
        >
          {DIFFICULTIES.map((option) => {
            const selected = difficulty === option;
            return (
              <button
                key={option}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setDifficulty(option)}
                className={cn(
                  "font-display h-10 text-sm font-bold tracking-[0.08em] uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lane/60",
                  selected
                    ? "bg-asphalt text-rail"
                    : "text-asphalt/55 hover:text-asphalt"
                )}
              >
                {option}
              </button>
            );
          })}
        </div>
        {fieldErrors?.difficulty ? (
          <p id="difficulty-error" className="text-sm text-destructive" role="alert">
            {fieldErrors.difficulty}
          </p>
        ) : null}
      </div>

      <Field
        id="patterns"
        label="Patterns"
        hint="Comma-separated, like Hash Map, Two Pointers"
        error={fieldErrors?.patterns}
      >
        <input
          id="patterns"
          name="patterns"
          type="text"
          defaultValue={problem ? patternsToInput(problem.patterns) : ""}
          placeholder="Hash Map"
          aria-invalid={fieldErrors?.patterns ? true : undefined}
          aria-describedby={
            fieldErrors?.patterns ? "patterns-error" : "patterns-hint"
          }
          className={fieldClass}
        />
      </Field>

      <Field
        id="date_completed"
        label="Date Completed"
        error={fieldErrors?.date_completed}
      >
        <input
          id="date_completed"
          name="date_completed"
          type="date"
          defaultValue={problem?.date_completed ?? ""}
          aria-invalid={fieldErrors?.date_completed ? true : undefined}
          aria-describedby={
            fieldErrors?.date_completed ? "date_completed-error" : undefined
          }
          className={fieldClass}
        />
      </Field>

      {state && !state.ok ? (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}

      {state && state.ok ? (
        <p className="text-sm text-asphalt/60" role="status">
          Saved.
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={pending}
        className="h-12 w-full rounded-none bg-lane font-display text-base font-extrabold tracking-[0.12em] text-asphalt uppercase shadow-[0_10px_24px_rgb(15_23_32_/_28%)] transition-[transform,box-shadow,background-color] hover:bg-lane/90 active:translate-y-px"
        size="lg"
      >
        {pending ? pendingLabel : submitLabel}
      </Button>
    </form>
  );
}

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      {children}
      {hint && !error ? (
        <p id={`${id}-hint`} className="text-sm text-asphalt/55">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
