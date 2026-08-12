import { EmptyState } from "@/components/app/page-states";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-rail uppercase">
        Dashboard
      </h1>
      <EmptyState
        title="No reps yet"
        description="Today's Reps will land here once you log problems and schedule reviews."
      />
    </div>
  );
}
