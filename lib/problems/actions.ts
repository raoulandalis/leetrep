"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/problems/types";
import { parseProblemForm } from "@/lib/problems/validation";

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

  const { error } = await supabase.from("problems").insert({
    user_id: user.id,
    leetcode_url: parsed.value.leetcode_url,
    title: parsed.value.title,
    difficulty: parsed.value.difficulty,
    patterns: parsed.value.patterns,
    date_completed: parsed.value.date_completed,
  });

  if (error) {
    return {
      ok: false,
      error: "Couldn't save this problem. Try again in a moment.",
    };
  }

  revalidatePath("/problems");
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

  const { data, error } = await supabase
    .from("problems")
    .update({
      leetcode_url: parsed.value.leetcode_url,
      title: parsed.value.title,
      difficulty: parsed.value.difficulty,
      patterns: parsed.value.patterns,
      date_completed: parsed.value.date_completed,
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

  revalidatePath("/problems");
  revalidatePath(`/problems/${id}`);
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
  redirect("/problems");
}
