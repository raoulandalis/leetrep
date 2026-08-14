import { ProfileForm } from "@/components/profiles/profile-form";
import { ErrorState } from "@/components/app/page-states";
import { getProfile } from "@/lib/profiles/queries";
import { createClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { profile, error } = await getProfile();

  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-rail uppercase">
        Settings
      </h1>

      {error || !profile ? (
        <ErrorState description={error ?? "Couldn't load your profile."} />
      ) : (
        <section className="w-full max-w-xl border border-steel-seam bg-rail p-6 text-asphalt sm:p-8">
          <h2 className="font-display mb-6 text-xl font-extrabold tracking-tight text-asphalt uppercase">
            Profile
          </h2>
          <ProfileForm
            profile={profile}
            email={user?.email}
            submitLabel="Save profile"
            pendingLabel="Saving..."
          />
        </section>
      )}
    </div>
  );
}
