import type { Journal } from "@/lib/journals/types";

export const REVIEW_TYPES = ["Recall", "Re-solve"] as const;

export type ReviewType = (typeof REVIEW_TYPES)[number];

export const REVIEW_STATUSES = [
  "upcoming",
  "due",
  "overdue",
  "done",
] as const;

export type ReviewStatus = (typeof REVIEW_STATUSES)[number];

export type ScheduleRow = {
  review_type: ReviewType;
  scheduled_for: string;
};

export type ReviewTask = {
  id: string;
  user_id: string;
  problem_id: string;
  review_type: ReviewType;
  scheduled_for: string;
  completed_at: string | null;
  created_at: string;
};

export type ReviewProblem = {
  title: string;
  difficulty: string;
  patterns: string[];
  leetcode_url: string;
};

export type DueReviewTask = ReviewTask & {
  problems: ReviewProblem | null;
};

export type ReviewRep = ReviewTask & {
  problems: ReviewProblem | null;
  journal: Journal | null;
};
