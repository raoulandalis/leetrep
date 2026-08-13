import type { JournalInput } from "@/lib/journals/types";
import type { ActionResult } from "@/lib/problems/types";

export const JOURNAL_FIELDS = [
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
    kind: "input",
    placeholder: "O(n)",
  },
  {
    name: "space_complexity",
    label: "Space Complexity",
    kind: "input",
    placeholder: "O(1)",
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

export function parseJournalForm(
  formData: FormData
):
  | { ok: true; problemId: string; value: JournalInput }
  | Extract<ActionResult, { ok: false }> {
  const problemId = String(formData.get("problem_id") ?? "").trim();
  if (!problemId) {
    return { ok: false, error: "Missing problem id." };
  }

  const value: JournalInput = {
    approach: emptyToNull(String(formData.get("approach") ?? "")),
    key_insight: emptyToNull(String(formData.get("key_insight") ?? "")),
    why_it_works: emptyToNull(String(formData.get("why_it_works") ?? "")),
    time_complexity: emptyToNull(String(formData.get("time_complexity") ?? "")),
    space_complexity: emptyToNull(
      String(formData.get("space_complexity") ?? "")
    ),
    struggles: emptyToNull(String(formData.get("struggles") ?? "")),
    additional_notes: emptyToNull(
      String(formData.get("additional_notes") ?? "")
    ),
  };

  return { ok: true, problemId, value };
}
