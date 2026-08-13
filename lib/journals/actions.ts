"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { parseJournalForm } from "@/lib/journals/validation";
import type { ActionResult } from "@/lib/problems/types";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { supabase, user: null as null };
  }

  return { supabase, user };
}

export async function saveJournal(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const parsed = parseJournalForm(formData);
  if (!parsed.ok) {
    return parsed;
  }

  const { supabase, user } = await requireUser();
  if (!user) {
    return { ok: false, error: "You need to sign in to save a journal." };
  }

  const { data: problem, error: problemError } = await supabase
    .from("problems")
    .select("id")
    .eq("id", parsed.problemId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (problemError) {
    return {
      ok: false,
      error: "Couldn't save this journal. Try again in a moment.",
    };
  }

  if (!problem) {
    return { ok: false, error: "Problem not found." };
  }

  const { data, error } = await supabase
    .from("journals")
    .upsert(
      {
        problem_id: parsed.problemId,
        user_id: user.id,
        approach: parsed.value.approach,
        key_insight: parsed.value.key_insight,
        why_it_works: parsed.value.why_it_works,
        time_complexity: parsed.value.time_complexity,
        space_complexity: parsed.value.space_complexity,
        struggles: parsed.value.struggles,
        additional_notes: parsed.value.additional_notes,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "problem_id" }
    )
    .select("id");

  if (error) {
    return {
      ok: false,
      error: "Couldn't save this journal. Try again in a moment.",
    };
  }

  if (!data?.length) {
    return { ok: false, error: "Problem not found." };
  }

  revalidatePath(`/problems/${parsed.problemId}`);
  return { ok: true };
}
