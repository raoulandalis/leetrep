import type { Confidence } from "@/lib/problems/types";
import { parseStoredConfidence } from "@/lib/problems/validation";
import { nextQueueAction } from "@/lib/reviews/queue";
import { buildReviewSchedule, todayYmd } from "@/lib/reviews/schedule";
import { createClient } from "@/lib/supabase/server";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

const SCHEDULE_SAVE_ERROR =
  "Couldn't save this problem's review schedule. Try again in a moment.";
const SCHEDULE_LOAD_ERROR =
  "Couldn't load this problem's review schedule. Try again in a moment.";
const SCHEDULE_UPDATE_ERROR =
  "Couldn't update this problem's review schedule. Try again in a moment.";

export async function insertReviewSchedule({
  supabase,
  userId,
  problemId,
  day0,
}: {
  supabase: SupabaseClient;
  userId: string;
  problemId: string;
  day0: string;
}): Promise<{ error: string | null }> {
  const rows = buildReviewSchedule(day0).map((row) => ({
    user_id: userId,
    problem_id: problemId,
    review_type: row.review_type,
    scheduled_for: row.scheduled_for,
  }));

  const { error } = await supabase.from("review_tasks").insert(rows);

  if (error) {
    return { error: SCHEDULE_SAVE_ERROR };
  }

  return { error: null };
}

export async function syncReviewQueue({
  supabase,
  userId,
  problemId,
  previous,
  next,
  restartCycle,
  errorMessage = SCHEDULE_SAVE_ERROR,
}: {
  supabase: SupabaseClient;
  userId: string;
  problemId: string;
  previous: Confidence | null;
  next: Confidence | null;
  restartCycle: boolean;
  errorMessage?: string;
}): Promise<{ error: string | null }> {
  const { count: totalCount, error: totalError } = await supabase
    .from("review_tasks")
    .select("id", { count: "exact", head: true })
    .eq("problem_id", problemId)
    .eq("user_id", userId);

  if (totalError) {
    return { error: errorMessage };
  }

  const { count: incompleteCount, error: incompleteError } = await supabase
    .from("review_tasks")
    .select("id", { count: "exact", head: true })
    .eq("problem_id", problemId)
    .eq("user_id", userId)
    .is("completed_at", null);

  if (incompleteError) {
    return { error: errorMessage };
  }

  const action = nextQueueAction({
    previous,
    next,
    incompleteCount: incompleteCount ?? 0,
    totalCount: totalCount ?? 0,
    restartCycle,
  });

  if (action === "enqueue") {
    const inserted = await insertReviewSchedule({
      supabase,
      userId,
      problemId,
      day0: todayYmd(),
    });

    if (inserted.error) {
      return { error: errorMessage };
    }

    return { error: null };
  }

  if (action === "dequeue") {
    const { error } = await supabase
      .from("review_tasks")
      .delete()
      .eq("problem_id", problemId)
      .eq("user_id", userId)
      .is("completed_at", null);

    if (error) {
      return { error: errorMessage };
    }
  }

  return { error: null };
}

export async function ensureReviewTasks(problemId: string): Promise<{
  error: string | null;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to sign in to view this problem." };
  }

  const { data: problem, error: problemError } = await supabase
    .from("problems")
    .select("id, confidence")
    .eq("id", problemId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (problemError) {
    return { error: SCHEDULE_LOAD_ERROR };
  }

  if (!problem) {
    return { error: "Problem not found." };
  }

  const confidence = parseStoredConfidence(problem.confidence);

  return syncReviewQueue({
    supabase,
    userId: user.id,
    problemId,
    previous: confidence,
    next: confidence,
    restartCycle: false,
  });
}

export async function countIncompleteReviewTasks({
  supabase,
  userId,
  problemId,
}: {
  supabase: SupabaseClient;
  userId: string;
  problemId: string;
}): Promise<{ count: number; error: string | null }> {
  const { count, error } = await supabase
    .from("review_tasks")
    .select("id", { count: "exact", head: true })
    .eq("problem_id", problemId)
    .eq("user_id", userId)
    .is("completed_at", null);

  if (error) {
    return { count: 0, error: SCHEDULE_LOAD_ERROR };
  }

  return { count: count ?? 0, error: null };
}

export { SCHEDULE_UPDATE_ERROR };
