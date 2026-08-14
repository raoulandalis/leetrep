import { cn } from "@/lib/utils";
import type { ReviewType } from "@/lib/reviews/types";

export function ReviewTypeChip({
  type,
  bordered = false,
}: {
  type: ReviewType;
  bordered?: boolean;
}) {
  const tone =
    type === "Recall"
      ? bordered
        ? "border-lane/40 text-lane"
        : "bg-lane/15 text-lane"
      : bordered
        ? "border-signal/40 text-signal"
        : "bg-signal/15 text-signal";

  return (
    <span
      className={cn(
        "w-fit font-display px-2 py-0.5 text-xs font-bold tracking-[0.16em] uppercase",
        bordered ? "border" : null,
        tone
      )}
    >
      {type}
    </span>
  );
}
