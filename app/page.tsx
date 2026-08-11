import Image from "next/image";
import {
  BookOpen,
  Brain,
  CalendarClock,
  Plus,
  RotateCcw,
} from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";

const LOOP = [
  {
    n: "01",
    title: "Add",
    body: "Log the problem you just solved.",
    accent: "bg-lane text-asphalt",
    Icon: Plus,
  },
  {
    n: "02",
    title: "Journal",
    body: "Write why the solution works — in your words.",
    accent: "bg-signal text-white",
    Icon: BookOpen,
  },
  {
    n: "03",
    title: "Recall",
    body: "Explain the approach before you reopen notes.",
    accent: "bg-cobalt text-white",
    Icon: Brain,
  },
  {
    n: "04",
    title: "Re-solve",
    body: "Open LeetCode and solve it again from scratch.",
    accent: "bg-lane text-asphalt",
    Icon: RotateCcw,
  },
  {
    n: "05",
    title: "Schedule",
    body: "Return on Day 1, 3, 7, 14, and 30.",
    accent: "bg-signal text-white",
    Icon: CalendarClock,
  },
] as const;

const DEMO_REPS = [
  { title: "Two Sum", kind: "Recall", tone: "bg-lane/15 text-lane" },
  {
    title: "Valid Parentheses",
    kind: "Re-solve",
    tone: "bg-signal/15 text-signal",
  },
  {
    title: "Maximum Subarray",
    kind: "Recall",
    tone: "bg-cobalt/15 text-cobalt",
  },
] as const;

function Wordmark() {
  return (
    <p className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
      <span className="text-rail not-italic">Leet</span>
      <span className="text-lane italic">Rep</span>
    </p>
  );
}

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden lg:grid lg:grid-cols-[minmax(0,1.15fr)_minmax(22rem,0.85fr)]">
      <section className="relative flex flex-col justify-between gap-10 px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12">
        <Image
          src="/landing/asphalt-field.png"
          alt=""
          fill
          priority
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="pointer-events-none object-cover"
        />
        <Image
          src="/landing/lane-diagonal.png"
          alt=""
          fill
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="pointer-events-none object-cover opacity-90 mix-blend-screen"
        />
        <div className="pointer-events-none absolute inset-0 bg-asphalt/35" />

        <Image
          src="/landing/steel-edge.png"
          alt=""
          width={48}
          height={1200}
          className="pointer-events-none absolute top-0 right-0 h-full w-2.5 object-cover sm:w-3"
        />

        <div className="relative z-10 flex flex-col gap-10">
          <Wordmark />

          <div className="landing-rise max-w-xl">
            <h1 className="font-display text-[clamp(2.5rem,7vw,4.75rem)] leading-[0.92] font-extrabold tracking-tight uppercase">
              <span className="text-rail">Solving a problem once is</span>{" "}
              <span className="text-lane">not learning it.</span>
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-rail/80 sm:text-lg">
              Log the problem, journal why your solution works, then let a
              spaced schedule bring it back — recall or re-solve — before you
              forget it.
            </p>
          </div>

          <ol className="relative max-w-lg space-y-0">
            <div
              aria-hidden
              className="absolute top-4 bottom-4 left-[1.35rem] w-px bg-lane/50"
            />
            {LOOP.map((step, index) => (
              <li
                key={step.n}
                className="landing-stagger relative flex gap-4 py-3 pl-1"
                style={{ animationDelay: `${120 + index * 70}ms` }}
              >
                <span
                  className={`relative z-10 flex size-11 shrink-0 flex-col items-center justify-center gap-0.5 shadow-[0_4px_12px_rgb(0_0_0_/_35%)] ${step.accent}`}
                >
                  <step.Icon className="size-3.5" strokeWidth={2.5} aria-hidden />
                  <span className="font-display text-[0.55rem] leading-none font-bold">
                    {step.n}
                  </span>
                </span>
                <div className="min-w-0 pt-1">
                  <p className="font-display text-lg font-bold tracking-wide text-rail uppercase">
                    {step.title}
                  </p>
                  <p className="mt-0.5 text-sm leading-snug text-rail/70">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <aside
          className="landing-rise relative z-10 max-w-md border border-rail/20 bg-asphalt/75 p-4 shadow-[0_12px_40px_rgb(0_0_0_/_35%)]"
          style={{ animationDelay: "420ms" }}
          aria-label="Example of Today's Reps"
        >
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <p className="font-display text-sm font-bold tracking-[0.14em] text-rail uppercase">
              Today&apos;s Reps:{" "}
              <span className="text-lane">{DEMO_REPS.length}</span>
            </p>
            <p className="text-[0.65rem] tracking-wide text-rail/45 uppercase">
              Synthetic preview
            </p>
          </div>
          <ul className="space-y-2">
            {DEMO_REPS.map((rep, i) => (
              <li
                key={rep.title}
                className="grid grid-cols-[2rem_1fr_auto] items-center gap-3 border border-rail/10 bg-[#121a24] px-3 py-2.5"
              >
                <span className="font-display text-xs font-bold text-lane">
                  L{i + 1}
                </span>
                <span className="min-w-0 truncate text-sm font-medium text-rail">
                  {rep.title}
                </span>
                <span
                  className={`font-display px-2 py-0.5 text-[0.65rem] font-bold tracking-wider uppercase ${rep.tone}`}
                >
                  {rep.kind}
                </span>
              </li>
            ))}
          </ul>
        </aside>
      </section>

      <section className="relative flex items-stretch bg-rail text-asphalt shadow-[-16px_0_40px_rgb(0_0_0_/_25%)] lg:min-h-screen">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-2 bg-[linear-gradient(90deg,#2a3038_0%,#8a9098_35%,#1a1f26_100%)]"
        />
        <div className="flex w-full flex-col justify-center px-6 py-10 sm:px-10 lg:px-12">
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
