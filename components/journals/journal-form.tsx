"use client";

import { useActionState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import type { Journal } from "@/lib/journals/types";
import { JOURNAL_FIELDS } from "@/lib/journals/validation";
import type { ActionResult } from "@/lib/problems/types";

const inputClass =
  "h-11 w-full rounded-none border border-steel-seam bg-lane-pit px-3 text-sm text-rail outline-none transition-[border-color,box-shadow] placeholder:text-track-mist focus-visible:border-rail focus-visible:ring-2 focus-visible:ring-lane/60";

const textareaClass =
  "min-h-36 w-full resize-y rounded-none border border-steel-seam bg-lane-pit px-3 py-3 text-sm leading-relaxed text-rail outline-none transition-[border-color,box-shadow] placeholder:text-track-mist focus-visible:border-rail focus-visible:ring-2 focus-visible:ring-lane/60";

const labelClass =
  "font-display text-xs font-bold tracking-[0.16em] text-rail uppercase";

const explanationBefore = JOURNAL_FIELDS.filter(
  (field) =>
    field.kind === "textarea" &&
    field.name !== "struggles" &&
    field.name !== "additional_notes"
);
const complexityFields = JOURNAL_FIELDS.filter(
  (field) => field.kind === "input"
);
const explanationAfter = JOURNAL_FIELDS.filter(
  (field) => field.name === "struggles" || field.name === "additional_notes"
);

type JournalFormProps = {
  problemId: string;
  journal: Journal | null;
  action: (
    prev: ActionResult | null,
    formData: FormData
  ) => Promise<ActionResult>;
};

export function JournalForm({ problemId, journal, action }: JournalFormProps) {
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction} className="flex flex-col gap-7">
      <input type="hidden" name="problem_id" value={problemId} />

      {explanationBefore.map((field) => (
        <Field key={field.name} id={field.name} label={field.label}>
          <textarea
            id={field.name}
            name={field.name}
            defaultValue={journal?.[field.name] ?? ""}
            placeholder={field.placeholder}
            className={textareaClass}
          />
        </Field>
      ))}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-4">
        {complexityFields.map((field) => (
          <Field key={field.name} id={field.name} label={field.label}>
            <input
              id={field.name}
              name={field.name}
              type="text"
              defaultValue={journal?.[field.name] ?? ""}
              placeholder={field.placeholder}
              className={inputClass}
            />
          </Field>
        ))}
      </div>

      {explanationAfter.map((field) => (
        <Field key={field.name} id={field.name} label={field.label}>
          <textarea
            id={field.name}
            name={field.name}
            defaultValue={journal?.[field.name] ?? ""}
            placeholder={field.placeholder}
            className={textareaClass}
          />
        </Field>
      ))}

      {state && !state.ok ? (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}

      {state && state.ok ? (
        <p className="text-sm text-track-mist" role="status">
          Saved.
        </p>
      ) : null}

      <div className="flex justify-end border-t border-steel-seam pt-6">
        <Button
          type="submit"
          disabled={pending}
          className="h-12 w-fit min-w-44 rounded-none bg-lane px-8 font-display text-base font-extrabold tracking-[0.12em] text-asphalt uppercase transition-[transform,background-color] hover:bg-lane/90 active:translate-y-px"
          size="lg"
        >
          {pending ? "Saving..." : "Save Journal"}
        </Button>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      {children}
    </div>
  );
}
