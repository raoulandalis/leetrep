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

export type ProgressSnapshot = {
  problemsLogged: number;
  repsCompleted: number;
  currentStreak: number;
  totalReviews: number;
  difficulty: DifficultyCounts;
  patterns: NamedCount[];
  history: WeekBucket[];
};
