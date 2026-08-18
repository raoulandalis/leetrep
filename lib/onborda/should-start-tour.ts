export function shouldStartTour(
  completedAt: string | null,
  pathname: string
): boolean {
  return completedAt == null && pathname === "/dashboard";
}
