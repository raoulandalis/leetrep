import type { DifficultyCounts, NamedCount } from "@/lib/progress/types";
import { PatternHelp } from "@/components/progress/pattern-help";
import { PatternPieChart } from "@/components/progress/pattern-pie-chart";
import { DifficultyBarChart } from "@/components/progress/difficulty-bar-chart";

export function ProgressBreakdowns({
  difficulty,
  patterns,
}: {
  difficulty: DifficultyCounts;
  patterns: NamedCount[];
}) {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-stretch md:gap-10">
      <section className="flex h-full min-h-0 flex-col gap-4">
        <h2 className="flex min-h-8 items-center font-display text-xl font-extrabold tracking-tight text-rail uppercase">
          Difficulty
        </h2>
        <DifficultyBarChart difficulty={difficulty} />
      </section>

      <section className="flex h-full min-h-0 flex-col gap-4">
        <div className="flex min-h-8 items-center gap-2">
          <h2 className="font-display text-xl font-extrabold tracking-tight text-rail uppercase">
            Patterns
          </h2>
          <PatternHelp />
        </div>
        {patterns.length === 0 ? (
          <p className="max-w-md text-sm leading-relaxed text-track-mist">
            No patterns tagged yet.
          </p>
        ) : (
          <PatternPieChart patterns={patterns} />
        )}
      </section>
    </div>
  );
}
