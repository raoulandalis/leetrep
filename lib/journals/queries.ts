import { createClient } from "@/lib/supabase/server";
import type { Journal } from "@/lib/journals/types";

const JOURNAL_COLUMNS =
  "id, problem_id, user_id, approach, key_insight, why_it_works, time_complexity, space_complexity, struggles, additional_notes, created_at, updated_at";

export async function getJournal(problemId: string): Promise<{
  journal: Journal | null;
  error: string | null;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { journal: null, error: "You need to sign in to view this journal." };
  }

  const { data, error } = await supabase
    .from("journals")
    .select(JOURNAL_COLUMNS)
    .eq("problem_id", problemId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    return {
      journal: null,
      error: "Couldn't load this journal. Try again in a moment.",
    };
  }

  return { journal: (data as Journal | null) ?? null, error: null };
}
