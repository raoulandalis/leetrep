import { EmptyState } from "@/components/app/page-states";

export default function ProblemsPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-rail uppercase">
        Problems
      </h1>
      <EmptyState
        title="No problems logged"
        description="Your solved LeetCode problems will show up here when you start adding them."
      />
    </div>
  );
}
