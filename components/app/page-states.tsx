import { cn } from "@/lib/utils";

type StateProps = {
  title: string;
  description: string;
  className?: string;
};

export function EmptyState({ title, description, className }: StateProps) {
  return (
    <div
      className={cn(
        "flex max-w-md flex-col gap-3 border border-dashed border-steel-seam px-6 py-8",
        className
      )}
    >
      <h2 className="font-display text-xl font-extrabold tracking-tight text-rail uppercase">
        {title}
      </h2>
      <p className="text-sm leading-relaxed text-track-mist">{description}</p>
    </div>
  );
}

export function LoadingState({
  title = "Loading",
  description = "Pulling your workspace together.",
  className,
}: Partial<StateProps>) {
  return (
    <div
      className={cn(
        "flex max-w-md flex-col gap-3 border border-steel-seam px-6 py-8",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <h2 className="font-display text-xl font-extrabold tracking-tight text-rail uppercase">
        {title}
      </h2>
      <p className="text-sm leading-relaxed text-track-mist">{description}</p>
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  description = "Try again in a moment.",
  className,
}: Partial<StateProps>) {
  return (
    <div
      className={cn(
        "flex max-w-md flex-col gap-3 border border-destructive/40 px-6 py-8",
        className
      )}
      role="alert"
    >
      <h2 className="font-display text-xl font-extrabold tracking-tight text-rail uppercase">
        {title}
      </h2>
      <p className="text-sm leading-relaxed text-track-mist">{description}</p>
    </div>
  );
}
