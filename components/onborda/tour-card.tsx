"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { completeOnboardingTour } from "@/lib/profiles/actions";
import { Button } from "@/components/ui/button";
import { useOnborda } from "onborda";
import type { CardComponentProps } from "onborda";

const TourPersistContext = createContext<{
  error: string | null;
  reportError: (message: string) => void;
  clearError: () => void;
}>({
  error: null,
  reportError: () => {},
  clearError: () => {},
});

export function TourPersistProvider({ children }: { children: ReactNode }) {
  const [error, setError] = useState<string | null>(null);

  return (
    <TourPersistContext.Provider
      value={{
        error,
        reportError: setError,
        clearError: () => setError(null),
      }}
    >
      {children}
    </TourPersistContext.Provider>
  );
}

export function TourPersistBanner() {
  const { error, clearError } = useContext(TourPersistContext);

  if (!error) return null;

  return (
    <p
      role="alert"
      className="fixed bottom-4 left-1/2 z-[1000] w-[min(24rem,calc(100%-2rem))] -translate-x-1/2 border border-asphalt/10 bg-rail px-4 py-3 text-sm leading-relaxed text-asphalt shadow-[0_10px_24px_rgb(15_23_32_/_28%)]"
    >
      {error}{" "}
      <button
        type="button"
        className="font-display text-xs font-bold tracking-[0.14em] uppercase underline-offset-2 hover:underline"
        onClick={clearError}
      >
        Dismiss
      </button>
    </p>
  );
}

const primaryClass =
  "h-11 rounded-none bg-lane px-5 font-display text-sm font-extrabold tracking-[0.12em] text-asphalt uppercase transition-[transform,background-color] hover:bg-lane/90 active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lane focus-visible:ring-offset-2 focus-visible:ring-offset-rail";

const ghostClass =
  "h-11 rounded-none bg-transparent px-4 font-display text-sm font-bold tracking-[0.12em] text-asphalt/70 uppercase hover:bg-asphalt/5 hover:text-asphalt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lane focus-visible:ring-offset-2 focus-visible:ring-offset-rail";

export function TourCard({
  step,
  currentStep,
  totalSteps,
  nextStep,
  prevStep,
  arrow,
}: CardComponentProps) {
  const { closeOnborda } = useOnborda();
  const { reportError } = useContext(TourPersistContext);
  const [pending, setPending] = useState(false);
  const titleId = "onborda-tour-title";
  const isLast = currentStep + 1 === totalSteps;

  async function persistAndClose() {
    if (pending) return;
    setPending(true);
    const result = await completeOnboardingTour();
    closeOnborda();
    if (!result.ok) {
      reportError(result.error);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="relative w-[min(22rem,calc(100vw-2rem))] border border-asphalt/10 bg-rail p-5 text-asphalt shadow-[0_10px_24px_rgb(15_23_32_/_28%)]"
    >
      <p className="font-display text-xs font-bold tracking-[0.16em] text-asphalt/55 uppercase">
        {currentStep + 1} of {totalSteps}
      </p>
      <h2
        id={titleId}
        className="mt-3 font-display text-xl font-extrabold tracking-tight uppercase"
      >
        {step.title}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-asphalt/80">{step.content}</p>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
        <Button
          type="button"
          variant="ghost"
          className={ghostClass}
          disabled={pending}
          onClick={persistAndClose}
        >
          Skip
        </Button>
        <div className="flex items-center gap-1">
          {currentStep > 0 ? (
            <Button
              type="button"
              variant="ghost"
              className={ghostClass}
              disabled={pending}
              onClick={prevStep}
            >
              Back
            </Button>
          ) : null}
          {isLast ? (
            <Button
              type="button"
              className={primaryClass}
              disabled={pending}
              onClick={persistAndClose}
            >
              Finish
            </Button>
          ) : (
            <Button
              type="button"
              className={primaryClass}
              disabled={pending}
              onClick={nextStep}
            >
              Next
            </Button>
          )}
        </div>
      </div>
      <span className="text-asphalt">{arrow}</span>
    </div>
  );
}
