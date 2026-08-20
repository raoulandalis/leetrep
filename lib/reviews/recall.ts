import { isComplexity } from "../journals/types.ts";
import { fieldHasContent, type JournalNotes } from "./rep.ts";

export { fieldHasContent };

export type RecallTextField = "approach" | "key_insight" | "why_it_works";
export type RecallComplexityField = "time_complexity" | "space_complexity";
export type RecallCodaField =
  | "solution_code"
  | "struggles"
  | "additional_notes";

export type RecallPromptStep =
  | { kind: "text"; field: RecallTextField; prompt: string }
  | {
      kind: "complexity";
      fields: RecallComplexityField[];
      prompt: string;
    };

const TEXT_PROMPTS: Record<RecallTextField, string> = {
  approach: "Walk through how you would solve this.",
  key_insight: "What idea made it click?",
  why_it_works: "Why is this correct?",
};

const TEXT_FIELDS: RecallTextField[] = [
  "approach",
  "key_insight",
  "why_it_works",
];

const COMPLEXITY_FIELDS: RecallComplexityField[] = [
  "time_complexity",
  "space_complexity",
];

const CODA_FIELDS: RecallCodaField[] = [
  "solution_code",
  "struggles",
  "additional_notes",
];

function complexityPrompt(fields: RecallComplexityField[]): string {
  const hasTime = fields.includes("time_complexity");
  const hasSpace = fields.includes("space_complexity");

  if (hasTime && hasSpace) {
    return "What are the time and space bounds?";
  }

  if (hasTime) {
    return "What is the time complexity?";
  }

  return "What is the space complexity?";
}

export function recallPromptSteps(journal: JournalNotes): RecallPromptStep[] {
  const steps: RecallPromptStep[] = [];

  for (const field of TEXT_FIELDS) {
    if (!fieldHasContent(journal[field])) {
      continue;
    }

    steps.push({
      kind: "text",
      field,
      prompt: TEXT_PROMPTS[field],
    });
  }

  const complexityFields = COMPLEXITY_FIELDS.filter((field) =>
    fieldHasContent(journal[field])
  );

  if (complexityFields.length > 0) {
    steps.push({
      kind: "complexity",
      fields: complexityFields,
      prompt: complexityPrompt(complexityFields),
    });
  }

  return steps;
}

export function recallCodaFields(journal: JournalNotes): RecallCodaField[] {
  return CODA_FIELDS.filter((field) => fieldHasContent(journal[field]));
}

export function canCommitComplexity(
  fields: RecallComplexityField[],
  values: Partial<Record<RecallComplexityField, string>>
): boolean {
  return fields.every((field) => isComplexity(values[field] ?? ""));
}
