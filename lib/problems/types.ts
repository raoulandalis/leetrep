export const DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;

export type Difficulty = (typeof DIFFICULTIES)[number];

export const CONFIDENCE_LEVELS = [
  "Needs work",
  "Keep practicing",
  "Confident",
] as const;

export type Confidence = (typeof CONFIDENCE_LEVELS)[number];

export type Problem = {
  id: string;
  user_id: string;
  leetcode_url: string;
  title: string;
  difficulty: Difficulty;
  patterns: string[];
  date_completed: string | null;
  confidence: Confidence | null;
  created_at: string;
  updated_at: string;
};

export type ProblemInput = {
  leetcode_url: string;
  title: string;
  difficulty: Difficulty;
  patterns: string[];
  date_completed: string | null;
  confidence: Confidence;
};

export type FieldErrors = Partial<
  Record<keyof ProblemInput | "form", string>
>;

export type ActionResult =
  | { ok: true; cycleComplete?: boolean }
  | { ok: false; error: string; fieldErrors?: FieldErrors };
