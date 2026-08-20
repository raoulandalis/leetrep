"use client";

import Link from "next/link";
import type { Journal } from "@/lib/journals/types";
import { JOURNAL_FIELDS } from "@/lib/journals/validation";
import { journalHasContent } from "@/lib/reviews/rep";

type JournalFieldName = (typeof JOURNAL_FIELDS)[number]["name"];

export function JournalReveal({
  journal,
  problemId,
  fields,
}: {
  journal: Journal | null;
  problemId: string;
  fields?: readonly JournalFieldName[];
}) {
  if (!fields && !journalHasContent(journal)) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-sm leading-relaxed text-track-mist">
          You haven&apos;t written notes for this problem yet.
        </p>
        <Link
          href={`/problems/${problemId}`}
          className="w-fit font-display text-sm font-bold tracking-[0.12em] text-rail uppercase underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lane/60"
        >
          Write journal
        </Link>
      </div>
    );
  }

  const visibleFields = fields
    ? JOURNAL_FIELDS.filter((field) => fields.includes(field.name))
    : JOURNAL_FIELDS;

  return (
    <dl className="flex flex-col gap-5">
      {visibleFields.map((field) => {
        const value = journal?.[field.name]?.trim();
        if (!value) {
          return null;
        }

        return (
          <div key={field.name} className="flex flex-col gap-1.5">
            <dt className="font-display text-xs font-bold tracking-[0.16em] text-track-mist uppercase">
              {field.label}
            </dt>
            <dd className="whitespace-pre-wrap text-sm leading-relaxed text-rail">
              {value}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
