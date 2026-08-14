"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/problems/types";
import { taskStatus, todayYmd } from "@/lib/reviews/schedule";

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

export async function completeReviewTask(id: string): Promise<ActionResult> {
  const trimmed = id.trim();
  if (!trimmed) {
    return { ok: false, error: "Missing review task id." };
  }

  const { supabase, user } = await requireUser();
  if (!user) {
    return { ok: false, error: "You need to sign in to complete a rep." };
  }

  const { data: existing, error: existingError } = await supabase
    .from("review_tasks")
    .select("id, problem_id, scheduled_for, completed_at")
    .eq("id", trimmed)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existingError) {
    return {
      ok: false,
      error: "Couldn't complete this rep. Try again in a moment.",
    };
  }

  if (!existing) {
    return { ok: false, error: "Review task not found." };
  }

  if (
    taskStatus(existing.scheduled_for, existing.completed_at, todayYmd()) ===
    "upcoming"
  ) {
    return { ok: false, error: "This rep isn't due yet." };
  }

  if (!existing.completed_at) {
    const { data, error } = await supabase
      .from("review_tasks")
      .update({ completed_at: new Date().toISOString() })
      .eq("id", trimmed)
      .eq("user_id", user.id)
      .is("completed_at", null)
      .select("id");

    if (error) {
      return {
        ok: false,
        error: "Couldn't complete this rep. Try again in a moment.",
      };
    }

    if (!data?.length) {
      return { ok: false, error: "Review task not found." };
    }
  }

  revalidatePath("/problems");
  revalidatePath(`/problems/${existing.problem_id}`);
  revalidatePath("/dashboard");
  revalidatePath(`/reviews/${trimmed}`);
  return { ok: true };
}

export async function completeRepAction(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  return completeReviewTask(String(formData.get("id") ?? ""));
}
