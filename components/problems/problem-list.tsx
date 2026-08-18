"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Confidence, Difficulty, Problem } from "@/lib/problems/types";
import { DIFFICULTIES } from "@/lib/problems/types";
import {
  formatCompletedDate,
  uniquePatterns,
} from "@/lib/problems/validation";

const searchFieldClass =
  "h-11 w-full border border-steel-seam bg-white px-3 text-sm text-asphalt outline-none transition-[border-color,box-shadow] placeholder:text-asphalt/35 focus-visible:border-rail focus-visible:ring-2 focus-visible:ring-lane/60";

export function ProblemList({ problems }: { problems: Problem[] }) {
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState<"All" | Difficulty>("All");
  const [pattern, setPattern] = useState("All");

  const patternOptions = useMemo(() => uniquePatterns(problems), [problems]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return problems.filter((problem) => {
      if (difficulty !== "All" && problem.difficulty !== difficulty) {
        return false;
      }
      if (pattern !== "All" && !problem.patterns.includes(pattern)) {
        return false;
      }
      if (!needle) {
        return true;
      }
      const haystack = [
        problem.title,
        problem.leetcode_url,
        ...problem.patterns,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [problems, query, difficulty, pattern]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="problem-search"
            className="font-display text-xs font-bold tracking-[0.16em] text-track-mist uppercase"
          >
            Search
          </label>
          <input
            id="problem-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Title, URL, or pattern"
            className={searchFieldClass}
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <p
              id="difficulty-filter-label"
              className="font-display text-xs font-bold tracking-[0.16em] text-track-mist uppercase"
            >
              Difficulty
            </p>
            <div
              role="group"
              aria-labelledby="difficulty-filter-label"
              className="grid grid-cols-4 gap-1 border border-steel-seam bg-lane-pit p-1"
            >
              {(["All", ...DIFFICULTIES] as const).map((option) => {
                const selected = difficulty === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setDifficulty(option)}
                    aria-pressed={selected}
                    className={cn(
                      "font-display h-10 text-sm font-bold tracking-[0.08em] uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lane/60",
                      selected
                        ? "bg-rail text-asphalt"
                        : "text-track-mist hover:text-rail"
                    )}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex w-full flex-col gap-2 sm:max-w-56">
            <label
              htmlFor="pattern-filter"
              className="font-display text-xs font-bold tracking-[0.16em] text-track-mist uppercase"
            >
              Pattern
            </label>
            <select
              id="pattern-filter"
              value={pattern}
              onChange={(event) => setPattern(event.target.value)}
              className="h-11 border border-steel-seam bg-lane-pit px-3 text-sm text-rail outline-none focus-visible:border-rail focus-visible:ring-2 focus-visible:ring-lane/60"
            >
              <option value="All">All</option>
              {patternOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-track-mist">
          No problems match those filters.
        </p>
      ) : (
        <ul className="flex flex-col border-t border-steel-seam">
          {filtered.map((problem) => (
            <li key={problem.id} className="border-b border-steel-seam">
              <Link
                href={`/problems/${problem.id}`}
                className="flex flex-col gap-3 px-1 py-4 transition-colors hover:bg-lane-pit/70 focus-visible:bg-lane-pit/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lane/60"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h2 className="font-display text-xl font-extrabold tracking-tight text-rail uppercase">
                    {problem.title}
                  </h2>
                  <p className="text-sm text-track-mist">
                    {formatCompletedDate(problem.date_completed)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <DifficultyChip difficulty={problem.difficulty} />
                  {problem.confidence ? (
                    <ConfidenceChip confidence={problem.confidence} />
                  ) : null}
                  {problem.patterns.map((tag) => (
                    <PatternChip key={tag} label={tag} />
                  ))}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function DifficultyChip({ difficulty }: { difficulty: Difficulty }) {
  const tone =
    difficulty === "Easy"
      ? "bg-lane/15 text-lane"
      : difficulty === "Medium"
        ? "bg-cobalt/15 text-cobalt"
        : "bg-signal/15 text-signal";

  return (
    <span
      className={cn(
        "font-display px-2 py-0.5 text-xs font-bold tracking-[0.16em] uppercase",
        tone
      )}
    >
      {difficulty}
    </span>
  );
}

export function confidenceTone(confidence: Confidence) {
  return confidence === "Confident"
    ? "bg-lane/15 text-lane"
    : confidence === "Keep practicing"
      ? "bg-cobalt/15 text-cobalt"
      : "bg-signal/15 text-signal";
}

export function ConfidenceChip({
  confidence,
  onRail = false,
}: {
  confidence: Confidence;
  onRail?: boolean;
}) {
  const tone = onRail
    ? "border border-asphalt/20 text-asphalt/60"
    : confidenceTone(confidence);

  return (
    <span
      className={cn(
        "font-display px-2 py-0.5 text-xs font-bold tracking-[0.16em] uppercase",
        tone
      )}
    >
      {confidence}
    </span>
  );
}

export function PatternChip({
  label,
  onRail = false,
}: {
  label: string;
  onRail?: boolean;
}) {
  return (
    <span
      className={cn(
        "font-display px-2 py-0.5 text-xs font-bold tracking-[0.16em] uppercase",
        onRail
          ? "border border-asphalt/20 text-asphalt/60"
          : "border border-steel-seam text-track-mist"
      )}
    >
      {label}
    </span>
  );
}
