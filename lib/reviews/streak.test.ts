import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { dayStreak } from "./streak.ts";

describe("dayStreak", () => {
  it("returns 0 when there are no completions", () => {
    assert.equal(dayStreak([], "2026-08-14"), 0);
  });

  it("counts consecutive days ending today", () => {
    assert.equal(
      dayStreak(["2026-08-14", "2026-08-13", "2026-08-11"], "2026-08-14"),
      2
    );
  });

  it("grants a one-day grace when today is empty but yesterday is complete", () => {
    assert.equal(dayStreak(["2026-08-13"], "2026-08-14"), 1);
  });

  it("counts a streak that starts today", () => {
    assert.equal(dayStreak(["2026-08-14"], "2026-08-14"), 1);
  });

  it("returns 0 when today and yesterday are both empty", () => {
    assert.equal(dayStreak(["2026-08-12"], "2026-08-14"), 0);
  });

  it("counts duplicate completions on one day once", () => {
    assert.equal(
      dayStreak(["2026-08-14", "2026-08-14", "2026-08-13"], "2026-08-14"),
      2
    );
  });
});
