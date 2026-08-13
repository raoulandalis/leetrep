"use client";

import { useActionState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import type { Journal } from "@/lib/journals/types";
import { JOURNAL_FIELDS } from "@/lib/journals/validation";
import type { ActionResult } from "@/lib/problems/types";

const inputClass =
  "h-11 w-full rounded-none border border-asphalt/20 bg-white px-3 text-sm text-asphalt outline-none transition-[border-color,box-shadow] placeholder:text-asphalt/35 focus-visible:border-asphalt focus-visible:ring-2 focus-visible:ring-lane/60";

const textareaClass =
  "min-h-28 w-full resize-y rounded-none border border-asphalt/20 bg-white px-3 py-2.5 text-sm leading-relaxed text-asphalt outline-none transition-[border-color,box-shadow] placeholder:text-asphalt/35 focus-visible:border-asphalt focus-visible:ring-2 focus-visible:ring-lane/60";

const labelClass =
  "font-display text-xs font-bold tracking-[0.16em] text-asphalt/55 uppercase";

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
    <form action={formAction} className="flex flex-col gap-6">
      <input type="hidden" name="problem_id" value={problemId} />

      {JOURNAL_FIELDS.map((field) => {
        const defaultValue = journal?.[field.name] ?? "";
        return (
          <Field key={field.name} id={field.name} label={field.label}>
            {field.kind === "textarea" ? (
              <textarea
                id={field.name}
                name={field.name}
                defaultValue={defaultValue}
                className={textareaClass}
              />
            ) : (
              <input
                id={field.name}
                name={field.name}
                type="text"
                defaultValue={defaultValue}
                className={inputClass}
              />
            )}
          </Field>
        );
      })}

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
        {pending ? "Saving..." : "Save Journal"}
      </Button>
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
