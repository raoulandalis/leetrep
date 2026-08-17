export type DifficultyCounts = {
  Easy: number;
  Medium: number;
  Hard: number;
};

export type NamedCount = {
  name: string;
  count: number;
};

export type WeekBucket = {
  weekStart: string;
  count: number;
};

export type DayBucket = {
  day: string;
  count: number;
};

export type ProgressHistory = {
  week: DayBucket[];
  month: WeekBucket[];
  quarter: WeekBucket[];
};

export type HistoryRange = "week" | "month" | "quarter";

export type ProgressSnapshot = {
  problemsLogged: number;
  repsCompleted: number;
  currentStreak: number;
  totalReviews: number;
  difficulty: DifficultyCounts;
  patterns: NamedCount[];
  history: ProgressHistory;
};
