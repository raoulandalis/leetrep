import { createClient } from "@/lib/supabase/server";
import type { DueReviewTask, ReviewTask } from "@/lib/reviews/types";

const REVIEW_COLUMNS =
  "id, user_id, problem_id, review_type, scheduled_for, completed_at, created_at";

const DUE_REVIEW_COLUMNS = `${REVIEW_COLUMNS}, problems(title, difficulty, patterns, leetcode_url)`;

export async function listReviewTasksForProblem(problemId: string): Promise<{
  tasks: ReviewTask[];
  error: string | null;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { tasks: [], error: "You need to sign in to view this problem." };
  }

  const { data, error } = await supabase
    .from("review_tasks")
    .select(REVIEW_COLUMNS)
    .eq("problem_id", problemId)
    .eq("user_id", user.id)
    .order("scheduled_for", { ascending: true });

  const tasks = Array.isArray(data) ? (data as ReviewTask[]) : [];

  if (tasks.length === 0) {
    const noRows =
      !error ||
      error.code === "PGRST116" ||
      error.code === "PGRST103" ||
      /0 rows|no rows|cannot coerce/i.test(
        `${error.message ?? ""} ${error.details ?? ""}`
      );

    if (noRows) {
      return { tasks: [], error: null };
    }

    return {
      tasks: [],
      error:
        "Couldn't load this problem's review schedule. Try again in a moment.",
    };
  }

  return { tasks, error: null };
}

export async function listDueReviewTasks(today: string): Promise<{
  tasks: DueReviewTask[];
  error: string | null;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { tasks: [], error: "You need to sign in to view today's reps." };
  }

  const { data, error } = await supabase
    .from("review_tasks")
    .select(DUE_REVIEW_COLUMNS)
    .eq("user_id", user.id)
    .lte("scheduled_for", today)
    .is("completed_at", null)
    .order("scheduled_for", { ascending: true });

  const rows = Array.isArray(data) ? data : [];
  const tasks: DueReviewTask[] = rows.map((row) => {
    const related = row.problems;
    const problem = Array.isArray(related) ? (related[0] ?? null) : related;

    return {
      id: row.id,
      user_id: row.user_id,
      problem_id: row.problem_id,
      review_type: row.review_type,
      scheduled_for: row.scheduled_for,
      completed_at: row.completed_at,
      created_at: row.created_at,
      problems: problem,
    } as DueReviewTask;
  });

  if (tasks.length === 0) {
    const noRows =
      !error ||
      error.code === "PGRST116" ||
      error.code === "PGRST103" ||
      /0 rows|no rows|cannot coerce/i.test(
        `${error.message ?? ""} ${error.details ?? ""}`
      );

    if (noRows) {
      return { tasks: [], error: null };
    }

    return {
      tasks: [],
      error: "Couldn't load today's reps. Try again in a moment.",
    };
  }

  return { tasks, error: null };
}
