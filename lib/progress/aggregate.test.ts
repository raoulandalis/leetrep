import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  countByDifficulty,
  countByPattern,
  repsByWeek,
} from "./aggregate.ts";

describe("countByDifficulty", () => {
  it("returns zeros for Easy, Medium, and Hard when there are no problems", () => {
    assert.deepEqual(countByDifficulty([]), {
      Easy: 0,
      Medium: 0,
      Hard: 0,
    });
  });

  it("counts each difficulty and ignores unknown values", () => {
    assert.deepEqual(
      countByDifficulty([
        { difficulty: "Easy" },
        { difficulty: "Medium" },
        { difficulty: "Easy" },
        { difficulty: "Hard" },
        { difficulty: "Nightmare" },
      ]),
      { Easy: 2, Medium: 1, Hard: 1 }
    );
  });
});

describe("countByPattern", () => {
  it("returns an empty list when nothing is tagged", () => {
    assert.deepEqual(
      countByPattern([{ patterns: [] }, { patterns: [""] }]),
      []
    );
  });

  it("flattens tags, skips blanks, and sorts by count then name", () => {
    assert.deepEqual(
      countByPattern([
        { patterns: ["Hash Map", "Arrays"] },
        { patterns: ["Arrays"] },
        { patterns: ["Stack", "Arrays"] },
        { patterns: ["  "] },
      ]),
      [
        { name: "Arrays", count: 3 },
        { name: "Hash Map", count: 1 },
        { name: "Stack", count: 1 },
      ]
    );
  });
});

describe("repsByWeek", () => {
  it("returns 12 Monday-start weeks ending with the current week", () => {
    const weeks = repsByWeek([], "2026-08-17");
    assert.equal(weeks.length, 12);
    assert.equal(weeks[0]?.weekStart, "2026-06-01");
    assert.equal(weeks[11]?.weekStart, "2026-08-17");
    assert.ok(weeks.every((week) => week.count === 0));
  });

  it("buckets completions onto Monday UTC week starts", () => {
    const weeks = repsByWeek(
      ["2026-08-16", "2026-08-17", "2026-08-18"],
      "2026-08-18"
    );
    assert.equal(weeks[10]?.weekStart, "2026-08-10");
    assert.equal(weeks[10]?.count, 1);
    assert.equal(weeks[11]?.weekStart, "2026-08-17");
    assert.equal(weeks[11]?.count, 2);
  });

  it("counts duplicate completions on the same day as separate reps", () => {
    const weeks = repsByWeek(
      ["2026-08-17", "2026-08-17", "2026-08-17"],
      "2026-08-17"
    );
    assert.equal(weeks[11]?.count, 3);
  });

  it("ignores completions outside the 12-week window", () => {
    const weeks = repsByWeek(["2026-05-24"], "2026-08-17");
    assert.ok(weeks.every((week) => week.count === 0));
  });
});
