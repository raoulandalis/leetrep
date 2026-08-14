export type GreetingPeriod = "morning" | "afternoon" | "evening";

export function greetingPeriod(hour: number): GreetingPeriod {
  if (hour < 12) {
    return "morning";
  }
  if (hour < 17) {
    return "afternoon";
  }
  return "evening";
}
