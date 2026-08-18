import { getJournal } from "@/lib/journals/queries";
import { parseStoredConfidence } from "@/lib/problems/validation";
import { createClient } from "@/lib/supabase/server";
import { todayYmd } from "@/lib/reviews/schedule";
import { dayStreak } from "@/lib/reviews/streak";
import type {
  DashboardStats,
  DueReviewTask,
  ReviewProblem,
  ReviewRep,
  ReviewTask,
} from "@/lib/reviews/types";

const EMPTY_DASHBOARD_STATS: DashboardStats = {
  problems: 0,
  repsCompleted: 0,
  dayStreak: 0,
};

const REVIEW_COLUMNS =
  "id, user_id, problem_id, review_type, scheduled_for, completed_at, created_at";

const DUE_REVIEW_COLUMNS = `${REVIEW_COLUMNS}, problems(title, difficulty, patterns, leetcode_url, confidence)`;

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
  const tasks: DueReviewTask[] = rows.map((row) => ({
    id: row.id,
    user_id: row.user_id,
    problem_id: row.problem_id,
    review_type: row.review_type,
    scheduled_for: row.scheduled_for,
    completed_at: row.completed_at,
    created_at: row.created_at,
    problems: unwrapProblem(row.problems),
  }));

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

export async function getDashboardStats(): Promise<{
  stats: DashboardStats;
  error: string | null;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      stats: EMPTY_DASHBOARD_STATS,
      error: "You need to sign in to view today's reps.",
    };
  }

  const [problemsResult, completionsResult] = await Promise.all([
    supabase
      .from("problems")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),
    supabase
      .from("review_tasks")
      .select("completed_at")
      .eq("user_id", user.id)
      .not("completed_at", "is", null),
  ]);

  const problemsNoRows =
    !problemsResult.error ||
    problemsResult.error.code === "PGRST116" ||
    problemsResult.error.code === "PGRST103" ||
    /0 rows|no rows|cannot coerce/i.test(
      `${problemsResult.error.message ?? ""} ${problemsResult.error.details ?? ""}`
    );

  if (!problemsNoRows) {
    return {
      stats: EMPTY_DASHBOARD_STATS,
      error: "Couldn't load today's stats. Try again in a moment.",
    };
  }

  const completionRows = Array.isArray(completionsResult.data)
    ? completionsResult.data
    : [];

  if (completionRows.length === 0) {
    const completionsNoRows =
      !completionsResult.error ||
      completionsResult.error.code === "PGRST116" ||
      completionsResult.error.code === "PGRST103" ||
      /0 rows|no rows|cannot coerce/i.test(
        `${completionsResult.error.message ?? ""} ${completionsResult.error.details ?? ""}`
      );

    if (!completionsNoRows) {
      return {
        stats: EMPTY_DASHBOARD_STATS,
        error: "Couldn't load today's stats. Try again in a moment.",
      };
    }
  }

  const completionYmds = completionRows
    .map((row) => row.completed_at)
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.slice(0, 10));

  return {
    stats: {
      problems: problemsResult.count ?? 0,
      repsCompleted: completionRows.length,
      dayStreak: dayStreak(completionYmds, todayYmd()),
    },
    error: null,
  };
}

function unwrapProblem(related: unknown): ReviewProblem | null {
  if (!related) {
    return null;
  }

  const problem = Array.isArray(related) ? (related[0] ?? null) : related;
  if (!problem || typeof problem !== "object") {
    return null;
  }

  const row = problem as {
    title?: unknown;
    difficulty?: unknown;
    patterns?: unknown;
    leetcode_url?: unknown;
    confidence?: unknown;
  };

  return {
    title: typeof row.title === "string" ? row.title : "",
    difficulty: typeof row.difficulty === "string" ? row.difficulty : "",
    patterns: Array.isArray(row.patterns)
      ? row.patterns.filter((tag): tag is string => typeof tag === "string")
      : [],
    leetcode_url:
      typeof row.leetcode_url === "string" ? row.leetcode_url : "",
    confidence: parseStoredConfidence(row.confidence),
  };
}

export async function getReviewRep(id: string): Promise<{
  rep: ReviewRep | null;
  error: string | null;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { rep: null, error: "You need to sign in to start this rep." };
  }

  const trimmed = id.trim();
  if (!trimmed) {
    return { rep: null, error: null };
  }

  const { data, error } = await supabase
    .from("review_tasks")
    .select(DUE_REVIEW_COLUMNS)
    .eq("id", trimmed)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    return {
      rep: null,
      error: "Couldn't load this rep. Try again in a moment.",
    };
  }

  if (!data) {
    return { rep: null, error: null };
  }

  const { journal, error: journalError } = await getJournal(data.problem_id);
  if (journalError) {
    return { rep: null, error: journalError };
  }

  const { count: incompleteCount, error: incompleteError } = await supabase
    .from("review_tasks")
    .select("id", { count: "exact", head: true })
    .eq("problem_id", data.problem_id)
    .eq("user_id", user.id)
    .is("completed_at", null);

  if (incompleteError) {
    return {
      rep: null,
      error: "Couldn't load this rep. Try again in a moment.",
    };
  }

  return {
    rep: {
      id: data.id,
      user_id: data.user_id,
      problem_id: data.problem_id,
      review_type: data.review_type,
      scheduled_for: data.scheduled_for,
      completed_at: data.completed_at,
      created_at: data.created_at,
      problems: unwrapProblem(data.problems),
      journal,
      cycleComplete: (incompleteCount ?? 0) === 0,
    },
    error: null,
  };
}
