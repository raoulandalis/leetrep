/** Chart-only fills. Do not use these as UI status colors. */
export const PATTERN_SLICE_COLORS = [
  "#36d9a0",
  "#ff5a1f",
  "#3d7eff",
  "#e4c36a",
  "#7ee0c0",
  "#ff8f66",
  "#8fb0ff",
  "#9aa3ad",
] as const;

export const CHART_LANE = "#36d9a0";
export const CHART_SIGNAL = "#ff5a1f";
export const CHART_COBALT = "#3d7eff";
export const CHART_RAIL = "#f4f1ec";
export const CHART_MIST = "#9aa3ad";
export const CHART_SEAM = "#2a3544";
export const CHART_PIT = "#1a2330";
export const CHART_BOARD = "#121a24";

export function sliceColor(index: number): string {
  return PATTERN_SLICE_COLORS[index % PATTERN_SLICE_COLORS.length];
}
