import { EmptyState, ErrorState } from "@/components/app/page-states";
import { DashboardGreeting } from "@/components/dashboard/dashboard-greeting";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { AddProblemLink } from "@/components/problems/add-problem-link";
import { DueRepList } from "@/components/reviews/due-rep-list";
import {
  getDashboardStats,
  listDueReviewTasks,
} from "@/lib/reviews/queries";
import { todayYmd } from "@/lib/reviews/schedule";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const [{ tasks, error: tasksError }, { stats, error: statsError }, displayName] =
    await Promise.all([
      listDueReviewTasks(todayYmd()),
      getDashboardStats(),
      loadDisplayName(),
    ]);

  const error = tasksError ?? statsError;
  const empty =
    stats.problems === 0
      ? {
          title: "No reps yet",
          description:
            "Today's Reps will land here once you log problems and schedule reviews.",
        }
      : {
          title: "You're all caught up",
          description: "Add more problems to keep building your reps.",
        };

  return (
    <div className="flex flex-col gap-8">
      <DashboardGreeting displayName={displayName} dueCount={tasks.length} />
      <DashboardStats stats={stats} />

      <section className="flex flex-col gap-6">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-rail uppercase">
          Today&apos;s Reps
        </h1>

        {error ? (
          <ErrorState description={error} />
        ) : tasks.length === 0 ? (
          <EmptyState
            title={empty.title}
            description={empty.description}
            action={<AddProblemLink className="w-fit" />}
          />
        ) : (
          <DueRepList tasks={tasks} />
        )}
      </section>
    </div>
  );
}

async function loadDisplayName(): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return "Athlete";
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("user_id", user.id)
    .maybeSingle();

  return (
    profile?.display_name?.trim() ||
    (user.email ? user.email.split("@")[0] : "Athlete")
  );
}
