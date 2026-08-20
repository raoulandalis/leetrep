import {
  BookOpen,
  Brain,
  CalendarClock,
  ListChecks,
  RotateCcw,
} from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";

const SCHEDULE_DAYS = [0, 1, 3, 7, 14, 30] as const;

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

const SECTIONS = [
  {
    id: "capture",
    title: "Log the problem. Journal in your words.",
    body: "Paste the LeetCode link, then write approach, insight, and complexity — not a copied solution.",
  },
  {
    id: "reps",
    title: "Recall or re-solve — both count.",
    body: "Two rep types keep you honest: explain the approach before notes unlock, or open LeetCode and solve from scratch.",
  },
  {
    id: "schedule",
    title: "Returns on Day 1, 3, 7, 14, and 30.",
    body: "Fixed intervals, no AI guesswork — you know exactly when each problem comes back.",
  },
  {
    id: "today",
    title: "Your queue for today, not a solved list.",
    body: "Open the app, do what's due, mark it done — the next review schedules automatically.",
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

function PreviewCaption({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-display mb-2 text-xs font-bold tracking-[0.14em] text-rail/50 uppercase">
      {children}
    </p>
  );
}

function PreviewGlow({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-8 -z-10 bg-lane/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-4 -z-10 bg-rail/10 blur-2xl"
      />
      {children}
    </div>
  );
}

function PreviewChrome({
  url,
  children,
  ariaLabel,
}: {
  url: string;
  children: React.ReactNode;
  ariaLabel: string;
}) {
  return (
    <div
      className="relative overflow-hidden border border-rail/20 bg-[#0b1017] shadow-[0_16px_40px_rgb(15_23_32_/_45%)]"
      aria-label={ariaLabel}
    >
      <div
        className="flex items-center gap-2 border-b border-rail/10 bg-[#151b24] px-3 py-2"
        aria-hidden
      >
        <span className="size-2.5 rounded-full bg-signal/80" />
        <span className="size-2.5 rounded-full bg-lane/70" />
        <span className="size-2.5 rounded-full bg-cobalt/80" />
        <div className="ml-2 flex min-w-0 flex-1 items-center bg-asphalt/80 px-2 py-1">
          <span className="truncate text-xs text-rail/45">{url}</span>
        </div>
      </div>
      <div className="bg-[#121a24]">{children}</div>
    </div>
  );
}

function CapturePreview() {
  return (
    <PreviewGlow>
      <PreviewChrome
        url="leetrep.app/problems/new"
        ariaLabel="Add problem preview, synthetic"
      >
        <div className="space-y-3 p-4">
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="border border-rail/10 bg-asphalt/40 px-3 py-2">
              <p className="font-display text-xs font-bold tracking-[0.14em] text-rail/45 uppercase">
                LeetCode URL
              </p>
              <p className="mt-1 truncate text-sm text-rail/80">
                leetcode.com/problems/two-sum
              </p>
            </div>
            <div className="border border-rail/10 bg-asphalt/40 px-3 py-2">
              <p className="font-display text-xs font-bold tracking-[0.14em] text-rail/45 uppercase">
                Title
              </p>
              <p className="mt-1 text-sm text-rail/80">Two Sum</p>
            </div>
          </div>
          <div className="space-y-2 border-t border-rail/10 pt-3">
            <div className="border border-rail/10 bg-asphalt/30 px-3 py-2.5">
              <p className="font-display text-xs font-bold tracking-[0.14em] text-lane uppercase">
                My Approach
              </p>
              <p className="mt-1 text-sm leading-snug text-rail/65">
                Hash map stores complements as I scan the array once…
              </p>
            </div>
            <div className="border border-rail/10 bg-asphalt/30 px-3 py-2.5">
              <p className="font-display text-xs font-bold tracking-[0.14em] text-signal uppercase">
                Key Insight
              </p>
              <p className="mt-1 text-sm leading-snug text-rail/65">
                Each number tells you exactly what partner you still need.
              </p>
            </div>
          </div>
        </div>
      </PreviewChrome>
    </PreviewGlow>
  );
}

function RepTypesPreview() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="border border-rail/15 bg-lane-pit/80 p-4">
        <div className="mb-3 flex items-center gap-2">
          <span className="flex size-9 items-center justify-center bg-lane text-asphalt">
            <Brain className="size-4" strokeWidth={2.25} aria-hidden />
          </span>
          <span className="font-display bg-lane/15 px-2 py-0.5 text-xs font-bold tracking-wider text-lane uppercase">
            Recall
          </span>
        </div>
        <p className="font-display text-base font-bold tracking-wide text-rail uppercase">
          Explain first
        </p>
        <p className="mt-1.5 text-sm leading-snug text-rail/65">
          Answer each journal prompt from memory. That section unlocks after.
        </p>
      </div>
      <div className="border border-rail/15 bg-lane-pit/80 p-4">
        <div className="mb-3 flex items-center gap-2">
          <span className="flex size-9 items-center justify-center bg-signal text-white">
            <RotateCcw className="size-4" strokeWidth={2.25} aria-hidden />
          </span>
          <span className="font-display bg-signal/15 px-2 py-0.5 text-xs font-bold tracking-wider text-signal uppercase">
            Re-solve
          </span>
        </div>
        <p className="font-display text-base font-bold tracking-wide text-rail uppercase">
          Solve again
        </p>
        <p className="mt-1.5 text-sm leading-snug text-rail/65">
          Open the original LeetCode link and code it from scratch.
        </p>
      </div>
    </div>
  );
}

function SchedulePreview() {
  return (
    <div
      className="border border-rail/15 bg-lane-pit/60 p-4 sm:p-5"
      aria-label="Review schedule preview, synthetic"
    >
      <div className="flex items-start justify-between gap-2 overflow-x-auto pb-1">
        {SCHEDULE_DAYS.map((day, index) => (
          <div
            key={day}
            className="flex min-w-[3.25rem] flex-1 flex-col items-center gap-2"
          >
            <span
              className={`flex size-8 items-center justify-center font-display text-xs font-bold ${
                day === 0
                  ? "bg-asphalt text-rail"
                  : index % 3 === 1
                    ? "bg-signal text-white"
                    : index % 3 === 2
                      ? "bg-cobalt text-white"
                      : "bg-lane text-asphalt"
              }`}
            >
              {day === 0 ? "0" : `+${day}`}
            </span>
            <span className="font-display text-xs font-bold tracking-[0.12em] text-rail/50 uppercase">
              {day === 0 ? "Log" : `Day ${day}`}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-4 border-t border-rail/10 pt-3 text-xs leading-relaxed text-rail/50">
        Demo schedule · each completed rep picks the next interval automatically
      </p>
    </div>
  );
}

function TodayPreview() {
  return (
    <PreviewGlow>
      <PreviewChrome
        url="leetrep.app/dashboard"
        ariaLabel="Dashboard preview, synthetic"
      >
        <div className="p-4">
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
      </PreviewChrome>
    </PreviewGlow>
  );
}

function SectionPreview({ id }: { id: (typeof SECTIONS)[number]["id"] }) {
  switch (id) {
    case "capture":
      return <CapturePreview />;
    case "reps":
      return <RepTypesPreview />;
    case "schedule":
      return <SchedulePreview />;
    case "today":
      return <TodayPreview />;
  }
}

function SectionIcon({ id }: { id: (typeof SECTIONS)[number]["id"] }) {
  switch (id) {
    case "capture":
      return <BookOpen className="size-4" strokeWidth={2.25} />;
    case "reps":
      return <Brain className="size-4" strokeWidth={2.25} />;
    case "schedule":
      return <CalendarClock className="size-4" strokeWidth={2.25} />;
    case "today":
      return <ListChecks className="size-4" strokeWidth={2.25} />;
  }
}

function LandingSection({
  section,
  index,
}: {
  section: (typeof SECTIONS)[number];
  index: number;
}) {
  const caption =
    section.id === "capture"
      ? "Add problem preview · synthetic"
      : section.id === "today"
        ? "Dashboard preview · synthetic"
        : null;

  return (
    <section
      id={section.id}
      className={`landing-rise border-t border-rail/10 py-16 sm:py-20 lg:py-24 ${
        index % 2 === 1 ? "bg-asphalt/[0.12]" : ""
      } -mx-6 px-6 sm:-mx-10 sm:px-10 lg:-mx-14 lg:px-14`}
      style={{ animationDelay: `${180 + index * 90}ms` }}
    >
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-10">
        <div className="max-w-md">
          <span
            className="mb-3 flex size-8 items-center justify-center bg-rail/10 text-rail/70"
            aria-hidden
          >
            <SectionIcon id={section.id} />
          </span>
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-rail uppercase sm:text-3xl">
            {section.title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-rail/75 sm:text-base">
            {section.body}
          </p>
        </div>

        <div className="min-w-0">
          {caption ? <PreviewCaption>{caption}</PreviewCaption> : null}
          <SectionPreview id={section.id} />
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="relative min-h-screen lg:grid lg:grid-cols-[minmax(0,1.15fr)_minmax(22rem,0.85fr)]">
      <section className="journal-field relative flex flex-col px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12">
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-px bg-rail/15 lg:block" />

        <div className="relative z-10 flex flex-col gap-10 lg:gap-12">
          <Wordmark />

          <div className="landing-rise max-w-xl">
            <h1 className="font-display text-[clamp(2.5rem,7vw,4.75rem)] leading-[0.92] font-extrabold tracking-tight uppercase">
              <span className="text-rail">Solving a problem once is</span>{" "}
              <span className="text-lane">not learning it.</span>
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-rail/80 sm:text-lg">
              Log what you learned, then come back on a schedule — before you
              forget it.
            </p>
          </div>

          <div className="mt-4 flex flex-col sm:mt-8">
            {SECTIONS.map((section, index) => (
              <LandingSection
                key={section.id}
                section={section}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="relative flex items-stretch border-t border-asphalt/10 bg-rail text-asphalt lg:sticky lg:top-0 lg:max-h-screen lg:min-h-screen lg:self-start lg:border-t-0 lg:border-l lg:border-asphalt/10">
        <div className="flex w-full flex-col justify-center px-6 py-10 sm:px-10 lg:max-h-screen lg:overflow-y-auto lg:px-12 lg:py-12">
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
