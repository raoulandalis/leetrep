import type {
  DayBucket,
  DifficultyCounts,
  NamedCount,
  ProgressHistory,
  WeekBucket,
} from "./types";

const DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;

function isDifficulty(value: string): value is keyof DifficultyCounts {
  return (DIFFICULTIES as readonly string[]).includes(value);
}

function addCalendarDays(ymd: string, days: number): string {
  const [year, month, day] = ymd.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));
  return date.toISOString().slice(0, 10);
}

function startOfWeekMonday(ymd: string): string {
  const [year, month, day] = ymd.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  const daysFromMonday = (date.getUTCDay() + 6) % 7;
  return addCalendarDays(ymd, -daysFromMonday);
}

export function countByDifficulty(
  problems: { difficulty: string }[]
): DifficultyCounts {
  const counts: DifficultyCounts = { Easy: 0, Medium: 0, Hard: 0 };
  for (const problem of problems) {
    if (isDifficulty(problem.difficulty)) {
      counts[problem.difficulty] += 1;
    }
  }
  return counts;
}

export function countByPattern(
  problems: { patterns: string[] }[]
): NamedCount[] {
  const counts = new Map<string, number>();
  for (const problem of problems) {
    for (const raw of problem.patterns) {
      const name = raw.trim();
      if (!name) {
        continue;
      }
      counts.set(name, (counts.get(name) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function repsByWeek(
  completionYmds: string[],
  today: string,
  weekCount = 12
): WeekBucket[] {
  const currentStart = startOfWeekMonday(today);
  const oldestStart = addCalendarDays(currentStart, -(weekCount - 1) * 7);
  const buckets: WeekBucket[] = [];

  for (let index = 0; index < weekCount; index += 1) {
    buckets.push({
      weekStart: addCalendarDays(oldestStart, index * 7),
      count: 0,
    });
  }

  const indexByStart = new Map(
    buckets.map((bucket, index) => [bucket.weekStart, index])
  );

  for (const ymd of completionYmds) {
    const index = indexByStart.get(startOfWeekMonday(ymd));
    if (index === undefined) {
      continue;
    }
    buckets[index].count += 1;
  }

  return buckets;
}

export function repsByDay(
  completionYmds: string[],
  today: string
): DayBucket[] {
  const monday = startOfWeekMonday(today);
  const buckets: DayBucket[] = [];

  for (let index = 0; index < 7; index += 1) {
    buckets.push({
      day: addCalendarDays(monday, index),
      count: 0,
    });
  }

  const indexByDay = new Map(
    buckets.map((bucket, index) => [bucket.day, index])
  );

  for (const ymd of completionYmds) {
    const index = indexByDay.get(ymd);
    if (index === undefined) {
      continue;
    }
    buckets[index].count += 1;
  }

  return buckets;
}

export const MONTH_WEEK_COUNT = 5;
export const QUARTER_WEEK_COUNT = 12;

export function buildRepHistory(
  completionYmds: string[],
  today: string
): ProgressHistory {
  return {
    week: repsByDay(completionYmds, today),
    month: repsByWeek(completionYmds, today, MONTH_WEEK_COUNT),
    quarter: repsByWeek(completionYmds, today, QUARTER_WEEK_COUNT),
  };
}
