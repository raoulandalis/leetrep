import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/app/app-sidebar";
import { MobileNav } from "@/components/app/mobile-nav";
import { OnbordaShell } from "@/components/onborda/onborda-shell";
import { getProfile } from "@/lib/profiles/queries";
import { createClient } from "@/lib/supabase/server";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { profile } = await getProfile();
  const email = user.email;
  const fullName = [profile?.first_name, profile?.last_name]
    .map((part) => part?.trim())
    .filter((part): part is string => Boolean(part))
    .join(" ");

  return (
    <OnbordaShell
      shouldStartTour={
        profile != null && profile.onboarding_completed_at == null
      }
    >
      <div className="flex min-h-svh bg-asphalt text-rail">
        <AppSidebar email={email} fullName={fullName} />
        <div className="flex min-w-0 flex-1 flex-col">
          <MobileNav email={email} fullName={fullName} />
          <main className="journal-field flex-1 px-5 py-7 sm:px-8 lg:px-10 lg:py-9">
            <div className="mx-auto w-full max-w-5xl">{children}</div>
          </main>
        </div>
      </div>
    </OnbordaShell>
  );
}
