import type { NamedCount } from "./types";

export const PATTERN_PIE_LIMIT = 7;

export type PatternPieSlice = {
  name: string;
  count: number;
  start: number;
  end: number;
};

export function patternPieSlices(
  patterns: NamedCount[],
  limit = PATTERN_PIE_LIMIT
): { total: number; slices: PatternPieSlice[] } {
  const total = patterns.reduce((sum, item) => sum + item.count, 0);
  if (total === 0) {
    return { total: 0, slices: [] };
  }

  const visible =
    patterns.length <= limit
      ? patterns
      : [
          ...patterns.slice(0, limit),
          {
            name: "Other",
            count: patterns
              .slice(limit)
              .reduce((sum, item) => sum + item.count, 0),
          },
        ];

  const slices: PatternPieSlice[] = [];
  let start = 0;

  for (let index = 0; index < visible.length; index += 1) {
    const item = visible[index];
    const end = index === visible.length - 1 ? 1 : start + item.count / total;
    slices.push({
      name: item.name,
      count: item.count,
      start,
      end,
    });
    start = end;
  }

  return { total, slices };
}
