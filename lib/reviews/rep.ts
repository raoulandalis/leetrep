import type { Journal } from "../journals/types";
import type { ReviewStatus } from "./types";

const JOURNAL_NOTE_KEYS = [
  "approach",
  "key_insight",
  "why_it_works",
  "time_complexity",
  "space_complexity",
  "struggles",
  "additional_notes",
] as const;

export type JournalNotes = Pick<Journal, (typeof JOURNAL_NOTE_KEYS)[number]>;

export function canStartRep(status: ReviewStatus): boolean {
  return status === "due" || status === "overdue";
}

export function canRevealRecall(text: string): boolean {
  return text.trim().length > 0;
}

export function journalHasContent(journal: JournalNotes | null): boolean {
  if (!journal) {
    return false;
  }

  return JOURNAL_NOTE_KEYS.some((key) => {
    const value = journal[key];
    return typeof value === "string" && value.trim().length > 0;
  });
}
