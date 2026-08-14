function addCalendarDays(ymd: string, days: number): string {
  const [year, month, day] = ymd.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));
  return date.toISOString().slice(0, 10);
}

export function dayStreak(completionYmds: string[], today: string): number {
  const days = new Set(completionYmds);
  if (days.size === 0) {
    return 0;
  }

  let cursor = days.has(today) ? today : addCalendarDays(today, -1);
  if (!days.has(cursor)) {
    return 0;
  }

  let streak = 0;
  while (days.has(cursor)) {
    streak += 1;
    cursor = addCalendarDays(cursor, -1);
  }

  return streak;
}
