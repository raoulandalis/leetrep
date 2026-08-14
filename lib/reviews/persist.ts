import { createClient } from "@/lib/supabase/server";
import { buildReviewSchedule, todayYmd } from "@/lib/reviews/schedule";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

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
    return {
      error:
        "Couldn't save this problem's review schedule. Try again in a moment.",
    };
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

  const { count, error: countError } = await supabase
    .from("review_tasks")
    .select("id", { count: "exact", head: true })
    .eq("problem_id", problemId)
    .eq("user_id", user.id);

  if (countError) {
    return {
      error:
        "Couldn't load this problem's review schedule. Try again in a moment.",
    };
  }

  if ((count ?? 0) > 0) {
    return { error: null };
  }

  const { data: problem, error: problemError } = await supabase
    .from("problems")
    .select("id")
    .eq("id", problemId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (problemError) {
    return {
      error:
        "Couldn't load this problem's review schedule. Try again in a moment.",
    };
  }

  if (!problem) {
    return { error: "Problem not found." };
  }

  return insertReviewSchedule({
    supabase,
    userId: user.id,
    problemId,
    day0: todayYmd(),
  });
}
