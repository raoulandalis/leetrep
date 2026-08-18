"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/problems/types";
import { isConfidence, parseStoredConfidence } from "@/lib/problems/validation";
import {
  SCHEDULE_UPDATE_ERROR,
  countIncompleteReviewTasks,
  syncReviewQueue,
} from "@/lib/reviews/persist";
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
  revalidatePath("/progress");
  revalidatePath(`/reviews/${trimmed}`);

  const { count, error: countError } = await countIncompleteReviewTasks({
    supabase,
    userId: user.id,
    problemId: existing.problem_id,
  });

  if (countError) {
    return { ok: true, cycleComplete: false };
  }

  return { ok: true, cycleComplete: count === 0 };
}

export async function completeRepAction(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  return completeReviewTask(String(formData.get("id") ?? ""));
}

export async function updateProblemConfidenceAction(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const problemId = String(formData.get("problem_id") ?? "").trim();
  const reviewId = String(formData.get("review_id") ?? "").trim();
  const confidenceRaw = String(formData.get("confidence") ?? "").trim();

  if (!problemId) {
    return { ok: false, error: "Missing problem id." };
  }

  if (!isConfidence(confidenceRaw)) {
    return {
      ok: false,
      error: "Choose how this problem feels.",
      fieldErrors: { confidence: "Choose how this problem feels." },
    };
  }

  const { supabase, user } = await requireUser();
  if (!user) {
    return { ok: false, error: "You need to sign in to update a problem." };
  }

  const { data: existing, error: existingError } = await supabase
    .from("problems")
    .select("id, confidence")
    .eq("id", problemId)
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
      confidence: confidenceRaw,
      updated_at: new Date().toISOString(),
    })
    .eq("id", problemId)
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
    problemId,
    previous: parseStoredConfidence(existing.confidence),
    next: confidenceRaw,
    restartCycle: true,
    errorMessage: SCHEDULE_UPDATE_ERROR,
  });

  if (scheduleError) {
    return { ok: false, error: scheduleError };
  }

  revalidatePath("/problems");
  revalidatePath(`/problems/${problemId}`);
  revalidatePath("/dashboard");
  revalidatePath("/progress");
  if (reviewId) {
    revalidatePath(`/reviews/${reviewId}`);
  }

  return { ok: true };
}
