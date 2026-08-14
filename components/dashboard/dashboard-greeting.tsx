"use client";

import { greetingPeriod } from "@/lib/reviews/greeting";

export function DashboardGreeting({
  firstName,
  dueCount,
}: {
  firstName: string | null;
  dueCount: number;
}) {
  const period = greetingPeriod(new Date().getHours());
  const hello = firstName ? `Good ${period}, ${firstName}.` : `Good ${period}.`;

  return (
    <header className="flex flex-col gap-2">
      <p
        className="font-display text-3xl font-extrabold tracking-tight text-rail uppercase"
        suppressHydrationWarning
      >
        {hello}
      </p>
      {dueCount > 0 ? (
        <p className="max-w-xl text-base leading-relaxed text-track-mist">
          You have {dueCount} {dueCount === 1 ? "rep" : "reps"} today.
        </p>
      ) : null}
    </header>
  );
}
