import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/profiles/types";

export async function getProfile(): Promise<{
  profile: Profile | null;
  error: string | null;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { profile: null, error: "You need to sign in to view your profile." };
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("first_name, last_name")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    return {
      profile: null,
      error: "Couldn't load your profile. Try again in a moment.",
    };
  }

  return {
    profile: data
      ? {
          first_name: data.first_name,
          last_name: data.last_name,
        }
      : { first_name: null, last_name: null },
    error: null,
  };
}
