"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ProfileActionResult } from "@/lib/profiles/types";
import { parseProfileForm } from "@/lib/profiles/validation";

export async function updateProfile(
  _prev: ProfileActionResult | null,
  formData: FormData
): Promise<ProfileActionResult> {
  const parsed = parseProfileForm(formData);
  if (!parsed.ok) {
    return parsed;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "You need to sign in to update your profile." };
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({
      first_name: parsed.value.first_name,
      last_name: parsed.value.last_name,
    })
    .eq("user_id", user.id)
    .select("id");

  if (error) {
    return {
      ok: false,
      error: "Couldn't save your profile. Try again in a moment.",
    };
  }

  if (!data?.length) {
    const { error: insertError } = await supabase.from("profiles").insert({
      user_id: user.id,
      first_name: parsed.value.first_name,
      last_name: parsed.value.last_name,
    });

    if (insertError) {
      return {
        ok: false,
        error: "Couldn't save your profile. Try again in a moment.",
      };
    }
  }

  revalidatePath("/dashboard");
  revalidatePath("/settings");
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function completeOnboardingTour(): Promise<ProfileActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "You need to sign in to update your profile." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      onboarding_completed_at: new Date().toISOString(),
    })
    .eq("user_id", user.id)
    .is("onboarding_completed_at", null);

  if (error) {
    return {
      ok: false,
      error: "Couldn't save your profile. Try again in a moment.",
    };
  }

  revalidatePath("/", "layout");
  return { ok: true };
}
