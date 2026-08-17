import { createClient } from "@/lib/supabase/server";
import {
  buildRepHistory,
  countByDifficulty,
  countByPattern,
} from "@/lib/progress/aggregate";
import type { ProgressSnapshot } from "@/lib/progress/types";
import { todayYmd } from "@/lib/reviews/schedule";
import { dayStreak } from "@/lib/reviews/streak";

function emptySnapshot(today: string): ProgressSnapshot {
  return {
    problemsLogged: 0,
    repsCompleted: 0,
    currentStreak: 0,
    totalReviews: 0,
    difficulty: { Easy: 0, Medium: 0, Hard: 0 },
    patterns: [],
    history: buildRepHistory([], today),
  };
}

function isNoRows(error: { code?: string; message?: string; details?: string } | null) {
  return (
    !error ||
    error.code === "PGRST116" ||
    error.code === "PGRST103" ||
    /0 rows|no rows|cannot coerce/i.test(
      `${error.message ?? ""} ${error.details ?? ""}`
    )
  );
}

type ProblemRow = {
  difficulty: string;
  patterns: string[] | null;
};

type ReviewRow = {
  completed_at: string | null;
};

export async function getProgressSnapshot(): Promise<{
  snapshot: ProgressSnapshot;
  error: string | null;
}> {
  const today = todayYmd();
  const empty = emptySnapshot(today);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      snapshot: empty,
      error: "You need to sign in to view progress.",
    };
  }

  const [problemsResult, reviewsResult] = await Promise.all([
    supabase
      .from("problems")
      .select("difficulty, patterns")
      .eq("user_id", user.id),
    supabase
      .from("review_tasks")
      .select("completed_at")
      .eq("user_id", user.id),
  ]);

  const problemRows: ProblemRow[] = Array.isArray(problemsResult.data)
    ? (problemsResult.data as ProblemRow[])
    : [];
  const reviewRows: ReviewRow[] = Array.isArray(reviewsResult.data)
    ? (reviewsResult.data as ReviewRow[])
    : [];

  if (problemRows.length === 0 && !isNoRows(problemsResult.error)) {
    return {
      snapshot: empty,
      error: "Couldn't load your progress. Try again in a moment.",
    };
  }

  if (reviewRows.length === 0 && !isNoRows(reviewsResult.error)) {
    return {
      snapshot: empty,
      error: "Couldn't load your progress. Try again in a moment.",
    };
  }

  const problems = problemRows.map((row) => ({
    difficulty: row.difficulty,
    patterns: Array.isArray(row.patterns) ? row.patterns : [],
  }));
  const completionYmds = reviewRows
    .map((row) => row.completed_at)
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.slice(0, 10));

  return {
    snapshot: {
      problemsLogged: problemRows.length,
      repsCompleted: completionYmds.length,
      currentStreak: dayStreak(completionYmds, today),
      totalReviews: reviewRows.length,
      difficulty: countByDifficulty(problems),
      patterns: countByPattern(problems),
      history: buildRepHistory(completionYmds, today),
    },
    error: null,
  };
}
