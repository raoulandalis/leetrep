"use client";

import { useEffect, useRef } from "react";
import { ProfileForm } from "@/components/profiles/profile-form";
import type { Profile } from "@/lib/profiles/types";

export function NameOnboardingDialog({ profile }: { profile: Profile }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const node = dialogRef.current;
    if (!node || node.open) {
      return;
    }
    node.showModal();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="name-onboarding-title"
      className="fixed inset-0 z-50 m-auto h-fit max-h-[calc(100vh-2rem)] w-[min(28rem,calc(100vw-2rem))] overflow-y-auto border-0 bg-transparent p-0 text-asphalt backdrop:bg-asphalt/55"
    >
      <div className="border border-asphalt/10 bg-rail p-6 sm:p-8">
        <h2
          id="name-onboarding-title"
          className="font-display text-3xl font-extrabold tracking-tight text-asphalt uppercase"
        >
          What should we call you?
        </h2>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-asphalt/70">
          Your first name shows up on the dashboard. You can change this later
          in Settings.
        </p>
        <div className="mt-6">
          <ProfileForm
            profile={profile}
            submitLabel="Save name"
            pendingLabel="Saving..."
          />
        </div>
        <button
          type="button"
          onClick={() => dialogRef.current?.close()}
          className="font-display mt-4 w-full py-2 text-xs font-bold tracking-[0.12em] text-asphalt/55 uppercase underline-offset-4 hover:text-asphalt hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lane/60"
        >
          Not now
        </button>
      </div>
    </dialog>
  );
}
