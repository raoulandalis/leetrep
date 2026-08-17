import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  countByDifficulty,
  countByPattern,
  repsByDay,
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

  it("can return a 5-week month window ending with the current week", () => {
    const weeks = repsByWeek([], "2026-08-17", 5);
    assert.equal(weeks.length, 5);
    assert.equal(weeks[0]?.weekStart, "2026-07-20");
    assert.equal(weeks[4]?.weekStart, "2026-08-17");
  });
});

describe("repsByDay", () => {
  it("returns Monday through Sunday of the week that contains today", () => {
    const days = repsByDay([], "2026-08-18");
    assert.equal(days.length, 7);
    assert.equal(days[0]?.day, "2026-08-17");
    assert.equal(days[6]?.day, "2026-08-23");
    assert.ok(days.every((day) => day.count === 0));
  });

  it("counts completions on each calendar day and ignores other weeks", () => {
    const days = repsByDay(
      ["2026-08-16", "2026-08-17", "2026-08-18", "2026-08-18"],
      "2026-08-18"
    );
    assert.equal(days[0]?.count, 1);
    assert.equal(days[1]?.count, 2);
    assert.equal(days[2]?.count, 0);
  });
});
