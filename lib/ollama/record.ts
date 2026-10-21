import type { Journal } from "../journals/types.ts";
import type { Problem } from "../problems/types.ts";
import { taskStatus } from "../reviews/schedule.ts";
import type { ReviewTask } from "../reviews/types.ts";

export type SavedProblemRecord = {
  title: string;
  leetcode_url: string;
  difficulty: Problem["difficulty"];
  patterns: string[];
  confidence: Problem["confidence"];
  date_completed: string | null;
  reviews: Array<{
    review_type: ReviewTask["review_type"];
    scheduled_for: string;
    status: ReturnType<typeof taskStatus>;
  }>;
  journal: {
    approach: string | null;
    key_insight: string | null;
    why_it_works: string | null;
    time_complexity: string | null;
    space_complexity: string | null;
    struggles: string | null;
    additional_notes: string | null;
    solution_code: string | null;
  } | null;
};

export function shapeProblemRecord(input: {
  problem: Problem;
  journal: Journal | null;
  tasks: ReviewTask[];
  today: string;
}): SavedProblemRecord {
  const { problem, journal, tasks, today } = input;

  return {
    title: problem.title,
    leetcode_url: problem.leetcode_url,
    difficulty: problem.difficulty,
    patterns: problem.patterns,
    confidence: problem.confidence,
    date_completed: problem.date_completed,
    reviews: tasks.map((task) => ({
      review_type: task.review_type,
      scheduled_for: task.scheduled_for,
      status: taskStatus(task.scheduled_for, task.completed_at, today),
    })),
    journal: journal
      ? {
          approach: journal.approach,
          key_insight: journal.key_insight,
          why_it_works: journal.why_it_works,
          time_complexity: journal.time_complexity,
          space_complexity: journal.space_complexity,
          struggles: journal.struggles,
          additional_notes: journal.additional_notes,
          solution_code: journal.solution_code,
        }
      : null,
  };
}
