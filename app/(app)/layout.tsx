import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/app/app-sidebar";
import { MobileNav } from "@/components/app/mobile-nav";
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

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("user_id", user.id)
    .maybeSingle();

  const email = user.email;
  const displayName =
    profile?.display_name?.trim() ||
    (email ? email.split("@")[0] : "Athlete");

  return (
    <div className="flex min-h-svh bg-asphalt text-rail">
      <AppSidebar email={email} displayName={displayName} />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileNav email={email} displayName={displayName} />
        <main className="journal-field flex-1 px-5 py-7 sm:px-8 lg:px-10 lg:py-9">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
