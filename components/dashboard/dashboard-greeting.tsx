"use client";

import { firstName, greetingPeriod } from "@/lib/reviews/greeting";

export function DashboardGreeting({
  displayName,
  dueCount,
}: {
  displayName: string;
  dueCount: number;
}) {
  const period = greetingPeriod(new Date().getHours());
  const name = firstName(displayName);

  return (
    <header className="flex flex-col gap-2">
      <p
        className="font-display text-3xl font-extrabold tracking-tight text-rail uppercase"
        suppressHydrationWarning
      >
        Good {period}, {name}.
      </p>
      {dueCount > 0 ? (
        <p className="max-w-xl text-base leading-relaxed text-track-mist">
          You have {dueCount} {dueCount === 1 ? "rep" : "reps"} today.
        </p>
      ) : null}
    </header>
  );
}
