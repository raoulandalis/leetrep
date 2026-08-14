import type { ReviewStatus, ScheduleRow } from "./types";

const REVIEW_PLAN: ReadonlyArray<{ offset: number; review_type: ScheduleRow["review_type"] }> =
  [
    { offset: 1, review_type: "Recall" },
    { offset: 3, review_type: "Re-solve" },
    { offset: 7, review_type: "Recall" },
    { offset: 14, review_type: "Re-solve" },
    { offset: 30, review_type: "Recall" },
  ];

function addCalendarDays(ymd: string, days: number): string {
  const [year, month, day] = ymd.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));
  return date.toISOString().slice(0, 10);
}

export function buildReviewSchedule(day0: string): ScheduleRow[] {
  return REVIEW_PLAN.map(({ offset, review_type }) => ({
    review_type,
    scheduled_for: addCalendarDays(day0, offset),
  }));
}

export function todayYmd(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10);
}

export function taskStatus(
  scheduledFor: string,
  completedAt: string | null,
  today: string
): ReviewStatus {
  if (completedAt) {
    return "done";
  }

  if (scheduledFor === today) {
    return "due";
  }

  if (scheduledFor < today) {
    return "overdue";
  }

  return "upcoming";
}
