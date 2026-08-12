import { EmptyState } from "@/components/app/page-states";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-rail uppercase">
        Settings
      </h1>
      <EmptyState
        title="Nothing to configure yet"
        description="Profile and preference controls will live here in a later pass."
      />
    </div>
  );
}
