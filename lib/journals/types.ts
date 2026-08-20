export type Journal = {
  id: string;
  problem_id: string;
  user_id: string;
  approach: string | null;
  key_insight: string | null;
  why_it_works: string | null;
  time_complexity: string | null;
  space_complexity: string | null;
  struggles: string | null;
  additional_notes: string | null;
  solution_code: string | null;
  created_at: string;
  updated_at: string;
};

export type JournalInput = {
  approach: string | null;
  key_insight: string | null;
  why_it_works: string | null;
  time_complexity: string | null;
  space_complexity: string | null;
  struggles: string | null;
  additional_notes: string | null;
  solution_code: string | null;
};

export const COMPLEXITY_OPTIONS = [
  "O(1)",
  "O(log n)",
  "O(√n)",
  "O(n)",
  "O(n log n)",
  "O(n²)",
  "O(n³)",
  "O(2^n)",
  "O(n!)",
] as const;

export type Complexity = (typeof COMPLEXITY_OPTIONS)[number];

export function isComplexity(value: string): value is Complexity {
  return (COMPLEXITY_OPTIONS as readonly string[]).includes(value);
}
