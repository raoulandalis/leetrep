"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Mode = "signin" | "signup" | "confirm";

const fieldClass =
  "h-11 w-full border border-asphalt/20 bg-white text-sm text-asphalt outline-none transition-[border-color,box-shadow,transform] placeholder:text-asphalt/35 focus-visible:border-asphalt focus-visible:ring-2 focus-visible:ring-lane/60";

export function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function goToDashboard() {
    router.push("/dashboard");
    router.refresh();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    const supabase = createClient();

    if (mode === "confirm") {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: otp.trim(),
        type: "signup",
      });

      if (verifyError) {
        setError(verifyError.message);
        setLoading(false);
        return;
      }

      goToDashboard();
      return;
    }

    if (mode === "signin") {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      goToDashboard();
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      goToDashboard();
      return;
    }

    setMode("confirm");
    setOtp("");
    setMessage(`Enter the 6-digit code we sent to ${email}.`);
    setLoading(false);
  }

  async function handleResendCode() {
    setError(null);
    setMessage(null);
    setLoading(true);

    const supabase = createClient();
    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email,
    });

    if (resendError) {
      setError(resendError.message);
      setLoading(false);
      return;
    }

    setMessage(`A new code was sent to ${email}.`);
    setLoading(false);
  }

  if (mode === "confirm") {
    return (
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex w-full max-w-sm flex-col gap-6"
      >
        <div className="flex flex-col gap-2">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-asphalt uppercase">
            Check your email
          </h2>
          <p className="text-sm leading-relaxed text-asphalt/65">
            We sent a 6-digit code to{" "}
            <span className="font-medium text-asphalt">{email}</span>. Stay on
            this page and enter it below.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="otp"
            className="font-display text-xs font-bold tracking-[0.16em] text-asphalt/55 uppercase"
          >
            Confirmation code
          </label>
          <input
            id="otp"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            required
            pattern="[0-9]{6}"
            maxLength={6}
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            className={cn(fieldClass, "text-center tracking-[0.35em]")}
            placeholder="000000"
          />
        </div>

        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}

        {message ? (
          <p className="text-sm text-asphalt/60" role="status">
            {message}
          </p>
        ) : null}

        <Button
          type="submit"
          disabled={loading || otp.length !== 6}
          className="h-12 w-full rounded-none bg-lane font-display text-base font-extrabold tracking-[0.12em] text-asphalt uppercase shadow-[0_10px_24px_rgb(15_23_32_/_28%)] transition-[transform,box-shadow,background-color] hover:bg-lane/90 active:translate-y-px"
          size="lg"
        >
          {loading ? "Verifying..." : "Verify and continue"}
        </Button>

        <div className="flex flex-col items-start gap-2 text-sm text-asphalt/60">
          <button
            type="button"
            className="font-medium text-asphalt underline-offset-4 hover:underline disabled:opacity-50"
            disabled={loading}
            onClick={handleResendCode}
          >
            Resend code
          </button>
          <button
            type="button"
            className="font-medium text-asphalt underline-offset-4 hover:underline"
            onClick={() => {
              setMode("signup");
              setOtp("");
              setError(null);
              setMessage(null);
            }}
          >
            Back
          </button>
        </div>
      </form>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-sm flex-col gap-6"
    >
      <div
        role="tablist"
        aria-label="Account mode"
        className="grid grid-cols-2 gap-1 border border-asphalt/15 bg-asphalt/5 p-1"
      >
        <button
          type="button"
          role="tab"
          aria-selected={mode === "signin"}
          className={cn(
            "font-display h-10 text-sm font-bold tracking-[0.08em] uppercase transition-colors",
            mode === "signin"
              ? "bg-asphalt text-rail"
              : "text-asphalt/55 hover:text-asphalt",
          )}
          onClick={() => {
            setMode("signin");
            setError(null);
            setMessage(null);
          }}
        >
          Log in
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "signup"}
          className={cn(
            "font-display h-10 text-sm font-bold tracking-[0.08em] uppercase transition-colors",
            mode === "signup"
              ? "bg-asphalt text-rail"
              : "text-asphalt/55 hover:text-asphalt",
          )}
          onClick={() => {
            setMode("signup");
            setError(null);
            setMessage(null);
          }}
        >
          Sign up
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="font-display text-3xl font-extrabold tracking-tight text-asphalt uppercase">
          {mode === "signin" ? "Welcome back" : "Start your reps"}
        </h2>
        <p className="text-sm text-asphalt/65">
          {mode === "signin"
            ? "Pick up today's review queue."
            : "Create an account to log problems and schedule recalls."}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="email"
          className="font-display text-xs font-bold tracking-[0.16em] text-asphalt/55 uppercase"
        >
          Email
        </label>
        <div className="relative">
          <Mail
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-asphalt/40"
            aria-hidden
          />
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={cn(fieldClass, "pr-3 pl-10")}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="password"
          className="font-display text-xs font-bold tracking-[0.16em] text-asphalt/55 uppercase"
        >
          Password
        </label>
        <div className="relative">
          <Lock
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-asphalt/40"
            aria-hidden
          />
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete={
              mode === "signin" ? "current-password" : "new-password"
            }
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={cn(fieldClass, "pr-11 pl-10")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            className="absolute top-1/2 right-2 flex size-8 -translate-y-1/2 items-center justify-center text-asphalt/45 hover:text-asphalt"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
      </div>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      {message ? (
        <p className="text-sm text-asphalt/60" role="status">
          {message}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={loading}
        className="h-12 w-full rounded-none bg-lane font-display text-base font-extrabold tracking-[0.12em] text-asphalt uppercase shadow-[0_10px_24px_rgb(15_23_32_/_28%)] transition-[transform,box-shadow,background-color] hover:bg-lane/90 active:translate-y-px"
        size="lg"
      >
        {loading
          ? "Please wait..."
          : mode === "signin"
            ? "Log in →"
            : "Create account →"}
      </Button>
    </form>
  );
}
