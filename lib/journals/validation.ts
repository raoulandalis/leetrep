import type { ActionResult } from "../problems/types.ts";
import type { JournalInput } from "./types.ts";
import { isComplexity } from "./types.ts";

export const SOLUTION_CODE_MAX_LENGTH = 32_000;

export const JOURNAL_FIELDS = [
  {
    name: "solution_code",
    label: "My Solution",
    kind: "code",
    placeholder: "Paste the code you submitted.",
  },
  {
    name: "approach",
    label: "My Approach",
    kind: "textarea",
    placeholder: "Walk through the steps you actually took, in your own words.",
  },
  {
    name: "key_insight",
    label: "Key Insight",
    kind: "textarea",
    placeholder: "The one idea that made the solution click.",
  },
  {
    name: "why_it_works",
    label: "Why It Works",
    kind: "textarea",
    placeholder: "Why this is correct — not just that it passed.",
  },
  {
    name: "time_complexity",
    label: "Time Complexity",
    kind: "select",
  },
  {
    name: "space_complexity",
    label: "Space Complexity",
    kind: "select",
  },
  {
    name: "struggles",
    label: "What I Struggled With",
    kind: "textarea",
    placeholder: "Where you got stuck, and what you tried first.",
  },
  {
    name: "additional_notes",
    label: "Additional Notes",
    kind: "textarea",
    placeholder: "Edge cases, follow-ups, or anything else worth remembering.",
  },
] as const;

function emptyToNull(raw: string): string | null {
  const trimmed = raw.trim();
  return trimmed === "" ? null : trimmed;
}

function parseComplexity(raw: string): string | null | false {
  const trimmed = raw.trim();
  if (!trimmed) {
    return null;
  }
  return isComplexity(trimmed) ? trimmed : false;
}

function emptyCodeToNull(raw: string): string | null {
  return raw.trim() === "" ? null : raw;
}

export function parseJournalForm(
  formData: FormData
):
  | { ok: true; problemId: string; value: JournalInput }
  | Extract<ActionResult, { ok: false }> {
  const problemId = String(formData.get("problem_id") ?? "").trim();
  if (!problemId) {
    return { ok: false, error: "Missing problem id." };
  }

  const time_complexity = parseComplexity(
    String(formData.get("time_complexity") ?? "")
  );
  const space_complexity = parseComplexity(
    String(formData.get("space_complexity") ?? "")
  );

  if (time_complexity === false || space_complexity === false) {
    return {
      ok: false,
      error: "Choose a time and space complexity from the list.",
    };
  }

  const solution_code_raw = String(formData.get("solution_code") ?? "");
  if (solution_code_raw.length > SOLUTION_CODE_MAX_LENGTH) {
    return {
      ok: false,
      error: "Solution code is too long. Keep it under 32,000 characters.",
    };
  }

  const value: JournalInput = {
    approach: emptyToNull(String(formData.get("approach") ?? "")),
    key_insight: emptyToNull(String(formData.get("key_insight") ?? "")),
    why_it_works: emptyToNull(String(formData.get("why_it_works") ?? "")),
    time_complexity,
    space_complexity,
    struggles: emptyToNull(String(formData.get("struggles") ?? "")),
    additional_notes: emptyToNull(
      String(formData.get("additional_notes") ?? "")
    ),
    solution_code: emptyCodeToNull(solution_code_raw),
  };

  return { ok: true, problemId, value };
}
