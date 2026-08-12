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
      <section className="journal-field relative flex flex-col px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12">
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-px bg-rail/15 lg:block" />

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

          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(14rem,0.85fr)] lg:gap-10">
            <ol className="relative min-w-0">
              {LOOP.map((step, index) => (
                <li
                  key={step.n}
                  className="landing-stagger relative flex gap-4 border-b border-rail/10 py-3.5 last:border-b-0"
                  style={{ animationDelay: `${120 + index * 70}ms` }}
                >
                  <span
                    className={`relative z-10 flex size-10 shrink-0 items-center justify-center ${step.accent}`}
                    aria-hidden
                  >
                    <step.Icon className="size-4" strokeWidth={2.25} />
                  </span>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-xs font-bold tracking-[0.14em] text-rail/40">
                        {step.n}
                      </span>
                      <p className="font-display text-lg font-bold tracking-wide text-rail uppercase">
                        {step.title}
                      </p>
                    </div>
                    <p className="mt-0.5 text-sm leading-snug text-rail/70">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <aside
              className="landing-rise lg:sticky lg:top-10"
              style={{ animationDelay: "280ms" }}
              aria-label="Dashboard preview, synthetic"
            >
              <p className="font-display mb-2 text-xs font-bold tracking-[0.14em] text-rail/50 uppercase">
                Dashboard preview · synthetic
              </p>
              <div className="relative">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -inset-8 -z-10 bg-lane/20 blur-3xl"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-4 -z-10 bg-rail/10 blur-2xl"
                />
                <div className="relative overflow-hidden border border-rail/20 bg-[#0b1017] shadow-[0_16px_40px_rgb(15_23_32_/_45%)] lg:origin-top lg:rotate-1">
                  <div
                    className="flex items-center gap-2 border-b border-rail/10 bg-[#151b24] px-3 py-2"
                    aria-hidden
                  >
                    <span className="size-2.5 rounded-full bg-signal/80" />
                    <span className="size-2.5 rounded-full bg-lane/70" />
                    <span className="size-2.5 rounded-full bg-cobalt/80" />
                    <div className="ml-2 flex min-w-0 flex-1 items-center bg-asphalt/80 px-2 py-1">
                      <span className="truncate text-xs text-rail/45">
                        leetrep.app/dashboard
                      </span>
                    </div>
                  </div>
                  <div className="bg-[#121a24] p-4">
                    <div className="mb-3 flex items-baseline justify-between gap-3 border-b border-rail/10 pb-3">
                      <p className="font-display text-sm font-bold tracking-[0.14em] text-rail uppercase">
                        Today&apos;s Reps:{" "}
                        <span className="text-lane">{DEMO_REPS.length}</span>
                      </p>
                      <p className="text-xs tracking-wide text-rail/40 uppercase">
                        Demo data
                      </p>
                    </div>
                    <ul>
                      {DEMO_REPS.map((rep) => (
                        <li
                          key={rep.title}
                          className="flex items-center justify-between gap-3 border-b border-rail/10 py-2.5 last:border-b-0"
                        >
                          <span className="min-w-0 truncate text-sm font-medium text-rail">
                            {rep.title}
                          </span>
                          <span
                            className={`font-display shrink-0 px-2 py-0.5 text-xs font-bold tracking-wider uppercase ${rep.tone}`}
                          >
                            {rep.kind}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="relative flex items-stretch border-t border-asphalt/10 bg-rail text-asphalt lg:min-h-screen lg:border-t-0 lg:border-l lg:border-asphalt/10">
        <div className="flex w-full flex-col justify-center px-6 py-10 sm:px-10 lg:px-12">
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
