import type { DifficultyCounts, NamedCount } from "@/lib/progress/types";
import { DIFFICULTIES } from "@/lib/problems/types";

export function ProgressBreakdowns({
  difficulty,
  patterns,
}: {
  difficulty: DifficultyCounts;
  patterns: NamedCount[];
}) {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
      <section className="flex flex-col gap-4">
        <h2 className="font-display text-xl font-extrabold tracking-tight text-rail uppercase">
          Difficulty
        </h2>
        <dl className="border border-steel-seam bg-lane-board">
          {DIFFICULTIES.map((name) => (
            <div
              key={name}
              className="flex items-baseline justify-between gap-4 border-b border-steel-seam px-4 py-3 last:border-b-0"
            >
              <dt className="font-display text-sm font-bold tracking-[0.12em] text-track-mist uppercase">
                {name}
              </dt>
              <dd className="font-display text-2xl font-extrabold tracking-tight text-rail">
                {difficulty[name]}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-xl font-extrabold tracking-tight text-rail uppercase">
          Patterns
        </h2>
        {patterns.length === 0 ? (
          <p className="max-w-md text-sm leading-relaxed text-track-mist">
            No patterns tagged yet.
          </p>
        ) : (
          <ul className="border border-steel-seam bg-lane-board">
            {patterns.map((item) => (
              <li
                key={item.name}
                className="flex items-baseline justify-between gap-4 border-b border-steel-seam px-4 py-3 last:border-b-0"
              >
                <span className="text-sm leading-relaxed text-rail">
                  {item.name}
                </span>
                <span className="font-display text-2xl font-extrabold tracking-tight text-rail">
                  {item.count}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
