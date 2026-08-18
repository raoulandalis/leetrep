"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { syncReviewQueue, SCHEDULE_UPDATE_ERROR } from "@/lib/reviews/persist";
import type { ActionResult } from "@/lib/problems/types";
import {
  parseProblemForm,
  parseStoredConfidence,
} from "@/lib/problems/validation";

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

export async function createProblem(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const parsed = parseProblemForm(formData);
  if (!parsed.ok) {
    return parsed;
  }

  const { supabase, user } = await requireUser();
  if (!user) {
    return { ok: false, error: "You need to sign in to add a problem." };
  }

  const { data: problem, error } = await supabase
    .from("problems")
    .insert({
      user_id: user.id,
      leetcode_url: parsed.value.leetcode_url,
      title: parsed.value.title,
      difficulty: parsed.value.difficulty,
      patterns: parsed.value.patterns,
      date_completed: parsed.value.date_completed,
      confidence: parsed.value.confidence,
    })
    .select("id")
    .single();

  if (error || !problem) {
    return {
      ok: false,
      error: "Couldn't save this problem. Try again in a moment.",
    };
  }

  const { error: scheduleError } = await syncReviewQueue({
    supabase,
    userId: user.id,
    problemId: problem.id,
    previous: null,
    next: parsed.value.confidence,
    restartCycle: false,
  });

  if (scheduleError) {
    await supabase
      .from("problems")
      .delete()
      .eq("id", problem.id)
      .eq("user_id", user.id);

    return {
      ok: false,
      error: "Couldn't save this problem. Try again in a moment.",
    };
  }

  revalidatePath("/problems");
  revalidatePath(`/problems/${problem.id}`);
  revalidatePath("/dashboard");
  revalidatePath("/progress");
  redirect("/problems");
}

export async function updateProblem(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    return { ok: false, error: "Missing problem id." };
  }

  const parsed = parseProblemForm(formData);
  if (!parsed.ok) {
    return parsed;
  }

  const { supabase, user } = await requireUser();
  if (!user) {
    return { ok: false, error: "You need to sign in to update a problem." };
  }

  const { data: existing, error: existingError } = await supabase
    .from("problems")
    .select("id, confidence")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existingError) {
    return {
      ok: false,
      error: "Couldn't update this problem. Try again in a moment.",
    };
  }

  if (!existing) {
    return { ok: false, error: "Problem not found." };
  }

  const { data, error } = await supabase
    .from("problems")
    .update({
      leetcode_url: parsed.value.leetcode_url,
      title: parsed.value.title,
      difficulty: parsed.value.difficulty,
      patterns: parsed.value.patterns,
      date_completed: parsed.value.date_completed,
      confidence: parsed.value.confidence,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .select("id");

  if (error) {
    return {
      ok: false,
      error: "Couldn't update this problem. Try again in a moment.",
    };
  }

  if (!data?.length) {
    return { ok: false, error: "Problem not found." };
  }

  const { error: scheduleError } = await syncReviewQueue({
    supabase,
    userId: user.id,
    problemId: id,
    previous: parseStoredConfidence(existing.confidence),
    next: parsed.value.confidence,
    restartCycle: false,
    errorMessage: SCHEDULE_UPDATE_ERROR,
  });

  if (scheduleError) {
    return { ok: false, error: scheduleError };
  }

  revalidatePath("/problems");
  revalidatePath(`/problems/${id}`);
  revalidatePath("/dashboard");
  revalidatePath("/progress");
  return { ok: true };
}

export async function deleteProblem(id: string): Promise<ActionResult> {
  const trimmed = id.trim();
  if (!trimmed) {
    return { ok: false, error: "Missing problem id." };
  }

  const { supabase, user } = await requireUser();
  if (!user) {
    return { ok: false, error: "You need to sign in to delete a problem." };
  }

  const { data, error } = await supabase
    .from("problems")
    .delete()
    .eq("id", trimmed)
    .eq("user_id", user.id)
    .select("id");

  if (error) {
    return {
      ok: false,
      error: "Couldn't delete this problem. Try again in a moment.",
    };
  }

  if (!data?.length) {
    return { ok: false, error: "Problem not found." };
  }

  revalidatePath("/problems");
  revalidatePath(`/problems/${trimmed}`);
  revalidatePath("/dashboard");
  revalidatePath("/progress");
  redirect("/problems");
}
