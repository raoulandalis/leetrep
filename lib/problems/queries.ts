import { createClient } from "@/lib/supabase/server";
import type { Problem } from "@/lib/problems/types";

const PROBLEM_COLUMNS =
  "id, user_id, leetcode_url, title, difficulty, patterns, date_completed, created_at, updated_at";

export async function listProblems(): Promise<{
  problems: Problem[];
  error: string | null;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { problems: [], error: "You need to sign in to view problems." };
  }

  const { data, error } = await supabase
    .from("problems")
    .select(PROBLEM_COLUMNS)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const problems = Array.isArray(data) ? (data as Problem[]) : [];

  // An empty library is a valid 0-row result, including PostgREST
  // "no rows" codes. Only fail when the request actually errored and
  // returned no array payload.
  if (problems.length === 0) {
    const noRows =
      !error ||
      error.code === "PGRST116" ||
      error.code === "PGRST103" ||
      /0 rows|no rows|cannot coerce/i.test(
        `${error.message ?? ""} ${error.details ?? ""}`
      );

    if (noRows) {
      return { problems: [], error: null };
    }

    return {
      problems: [],
      error: "Couldn't load your problems. Try again in a moment.",
    };
  }

  return { problems, error: null };
}

export async function getProblem(id: string): Promise<{
  problem: Problem | null;
  error: string | null;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { problem: null, error: "You need to sign in to view this problem." };
  }

  const { data, error } = await supabase
    .from("problems")
    .select(PROBLEM_COLUMNS)
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    return {
      problem: null,
      error: "Couldn't load this problem. Try again in a moment.",
    };
  }

  return { problem: (data as Problem | null) ?? null, error: null };
}
