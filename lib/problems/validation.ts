import type {
  Confidence,
  Difficulty,
  FieldErrors,
  Problem,
  ProblemInput,
} from "./types";

export function isDifficulty(value: string): value is Difficulty {
  return value === "Easy" || value === "Medium" || value === "Hard";
}

export function isConfidence(value: string): value is Confidence {
  return (
    value === "Needs work" ||
    value === "Keep practicing" ||
    value === "Confident"
  );
}

export function parseStoredConfidence(value: unknown): Confidence | null {
  return typeof value === "string" && isConfidence(value) ? value : null;
}

export function parsePatterns(raw: string): string[] {
  return raw
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

export function patternsToInput(patterns: string[]): string {
  return patterns.join(", ");
}

export function uniquePatterns(problems: Problem[]): string[] {
  return [...new Set(problems.flatMap((problem) => problem.patterns))].sort(
    (a, b) => a.localeCompare(b)
  );
}

export function formatCompletedDate(iso: string | null): string {
  if (!iso) {
    return "Not set";
  }

  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day) {
    return iso;
  }

  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function parseProblemForm(
  formData: FormData
):
  | { ok: true; value: ProblemInput }
  | { ok: false; error: string; fieldErrors: FieldErrors } {
  const title = String(formData.get("title") ?? "").trim();
  const leetcode_url = String(formData.get("leetcode_url") ?? "").trim();
  const difficultyRaw = String(formData.get("difficulty") ?? "").trim();
  const confidenceRaw = String(formData.get("confidence") ?? "").trim();
  const patternsRaw = String(formData.get("patterns") ?? "");
  const dateRaw = String(formData.get("date_completed") ?? "").trim();

  const fieldErrors: FieldErrors = {};

  if (!title) {
    fieldErrors.title = "Enter a problem title.";
  }

  if (!leetcode_url) {
    fieldErrors.leetcode_url = "Enter the LeetCode problem URL.";
  } else {
    try {
      const parsed = new URL(leetcode_url);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        fieldErrors.leetcode_url = "URL must start with http:// or https://.";
      }
    } catch {
      fieldErrors.leetcode_url =
        "Enter a valid URL, like https://leetcode.com/problems/two-sum/.";
    }
  }

  if (!isDifficulty(difficultyRaw)) {
    fieldErrors.difficulty = "Choose Easy, Medium, or Hard.";
  }

  if (!isConfidence(confidenceRaw)) {
    fieldErrors.confidence = "Choose how this problem feels.";
  }

  let date_completed: string | null = null;
  if (dateRaw) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateRaw)) {
      fieldErrors.date_completed = "Choose a valid date.";
    } else {
      date_completed = dateRaw;
    }
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      ok: false,
      error: "Fix the highlighted fields and try again.",
      fieldErrors,
    };
  }

  return {
    ok: true,
    value: {
      title,
      leetcode_url,
      difficulty: difficultyRaw as Difficulty,
      patterns: parsePatterns(patternsRaw),
      date_completed,
      confidence: confidenceRaw as Confidence,
    },
  };
}
