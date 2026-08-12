import { EmptyState } from "@/components/app/page-states";

export default function ProgressPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-rail uppercase">
        Progress
      </h1>
      <EmptyState
        title="No progress yet"
        description="Counts and streaks by difficulty and pattern will appear once you have reps under your belt."
      />
    </div>
  );
}
