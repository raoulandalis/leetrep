import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildReviewSchedule,
  taskStatus,
  todayYmd,
} from "./schedule.ts";

describe("buildReviewSchedule", () => {
  it("creates five Recall/Re-solve rows at day 1, 3, 7, 14, and 30", () => {
    assert.deepEqual(buildReviewSchedule("2026-08-14"), [
      { review_type: "Recall", scheduled_for: "2026-08-15" },
      { review_type: "Re-solve", scheduled_for: "2026-08-17" },
      { review_type: "Recall", scheduled_for: "2026-08-21" },
      { review_type: "Re-solve", scheduled_for: "2026-08-28" },
      { review_type: "Recall", scheduled_for: "2026-09-13" },
    ]);
  });

  it("rolls across month and year boundaries", () => {
    const schedule = buildReviewSchedule("2025-12-20");
    assert.equal(schedule[0]?.scheduled_for, "2025-12-21");
    assert.equal(schedule[4]?.scheduled_for, "2026-01-19");
  });
});

describe("taskStatus", () => {
  it("marks a completed task as done even if the date is today", () => {
    assert.equal(
      taskStatus("2026-08-14", "2026-08-14T12:00:00.000Z", "2026-08-14"),
      "done"
    );
  });

  it("marks an incomplete task scheduled for today as due", () => {
    assert.equal(taskStatus("2026-08-14", null, "2026-08-14"), "due");
  });

  it("marks an incomplete past task as overdue", () => {
    assert.equal(taskStatus("2026-08-10", null, "2026-08-14"), "overdue");
  });

  it("marks an incomplete future task as upcoming", () => {
    assert.equal(taskStatus("2026-08-21", null, "2026-08-14"), "upcoming");
  });
});

describe("todayYmd", () => {
  it("returns the UTC calendar date as YYYY-MM-DD", () => {
    assert.equal(todayYmd(new Date("2026-08-14T23:30:00.000Z")), "2026-08-14");
  });
});
