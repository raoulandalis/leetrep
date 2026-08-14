"use client";

import { useActionState, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { updateProfile } from "@/lib/profiles/actions";
import type { Profile } from "@/lib/profiles/types";

const fieldClass =
  "h-11 w-full border border-asphalt/20 bg-white px-3 text-sm text-asphalt outline-none transition-[border-color,box-shadow] placeholder:text-asphalt/35 focus-visible:border-asphalt focus-visible:ring-2 focus-visible:ring-lane/60";

const labelClass =
  "font-display text-xs font-bold tracking-[0.16em] text-asphalt/55 uppercase";

const readOnlyClass =
  "h-11 w-full border border-asphalt/15 bg-asphalt/5 px-3 text-sm text-asphalt/80";

export function ProfileForm({
  profile,
  email,
  submitLabel,
  pendingLabel,
}: {
  profile: Profile;
  email?: string;
  submitLabel: string;
  pendingLabel: string;
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(updateProfile, null);

  useEffect(() => {
    if (state?.ok) {
      router.refresh();
    }
  }, [state, router]);

  const fieldErrors = state && !state.ok ? state.fieldErrors : undefined;

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {email ? (
        <Field id="email" label="Email">
          <input
            id="email"
            type="email"
            value={email}
            readOnly
            className={readOnlyClass}
          />
        </Field>
      ) : null}

      <Field id="first_name" label="First name" error={fieldErrors?.first_name}>
        <input
          id="first_name"
          name="first_name"
          type="text"
          required
          maxLength={80}
          autoComplete="given-name"
          defaultValue={profile.first_name ?? ""}
          aria-invalid={fieldErrors?.first_name ? true : undefined}
          aria-describedby={
            fieldErrors?.first_name ? "first_name-error" : undefined
          }
          className={fieldClass}
        />
      </Field>

      <Field id="last_name" label="Last name" error={fieldErrors?.last_name}>
        <input
          id="last_name"
          name="last_name"
          type="text"
          required
          maxLength={80}
          autoComplete="family-name"
          defaultValue={profile.last_name ?? ""}
          aria-invalid={fieldErrors?.last_name ? true : undefined}
          aria-describedby={
            fieldErrors?.last_name ? "last_name-error" : undefined
          }
          className={fieldClass}
        />
      </Field>

      {state && !state.ok && state.error ? (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}

      {state?.ok ? (
        <p className="text-sm text-asphalt/60" role="status">
          Saved.
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={pending}
        className="h-12 w-full rounded-none bg-lane font-display text-base font-extrabold tracking-[0.12em] text-asphalt uppercase shadow-[0_10px_24px_rgb(15_23_32_/_28%)] transition-[transform,box-shadow,background-color] hover:bg-lane/90 active:translate-y-px"
        size="lg"
      >
        {pending ? pendingLabel : submitLabel}
      </Button>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
