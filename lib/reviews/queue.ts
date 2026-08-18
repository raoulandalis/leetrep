import type { Confidence } from "../problems/types";

export type QueueAction = "enqueue" | "dequeue" | "noop";

export function wantsReviewQueue(confidence: Confidence | null): boolean {
  return confidence !== "Confident";
}

export function nextQueueAction({
  previous,
  next,
  incompleteCount,
  totalCount,
  restartCycle,
}: {
  previous: Confidence | null;
  next: Confidence | null;
  incompleteCount: number;
  totalCount: number;
  restartCycle: boolean;
}): QueueAction {
  if (!wantsReviewQueue(next)) {
    return incompleteCount > 0 ? "dequeue" : "noop";
  }

  if (incompleteCount > 0) {
    return "noop";
  }

  if (restartCycle || previous === "Confident" || totalCount === 0) {
    return "enqueue";
  }

  return "noop";
}
