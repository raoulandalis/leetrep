import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Journal } from "../journals/types.ts";
import type { Problem } from "../problems/types.ts";
import type { ReviewTask } from "../reviews/types.ts";
import { shapeProblemRecord } from "./record.ts";

function problem(): Problem {
  return {
    id: "problem-1",
    user_id: "user-1",
    leetcode_url: "https://leetcode.com/problems/two-sum/",
    title: "Two Sum",
    difficulty: "Easy",
    patterns: ["Hash Map"],
    date_completed: "2026-10-01",
    confidence: "Keep practicing",
    created_at: "2026-10-01T00:00:00.000Z",
    updated_at: "2026-10-01T00:00:00.000Z",
  };
}

function journal(): Journal {
  return {
    id: "journal-1",
    problem_id: "problem-1",
    user_id: "user-1",
    approach: "Use a hash map.",
    key_insight: "Store the complement.",
    why_it_works: "Each value is seen once.",
    time_complexity: "O(n)",
    space_complexity: "O(n)",
    struggles: "Off-by-one on the index.",
    additional_notes: null,
    solution_code: "def twoSum():\n    pass\n",
    created_at: "2026-10-01T00:00:00.000Z",
    updated_at: "2026-10-01T00:00:00.000Z",
  };
}

function task(overrides: Partial<ReviewTask> = {}): ReviewTask {
  return {
    id: "task-1",
    user_id: "user-1",
    problem_id: "problem-1",
    review_type: "Recall",
    scheduled_for: "2026-10-20",
    completed_at: null,
    created_at: "2026-10-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("shapeProblemRecord", () => {
  it("returns the saved record and review status", () => {
    const record = shapeProblemRecord({
      problem: problem(),
      journal: journal(),
      tasks: [
        task(),
        task({
          id: "task-2",
          review_type: "Re-solve",
          scheduled_for: "2026-10-18",
          completed_at: "2026-10-18T12:00:00.000Z",
        }),
      ],
      today: "2026-10-20",
    });

    assert.equal(record.title, "Two Sum");
    assert.deepEqual(record.patterns, ["Hash Map"]);
    assert.equal(record.confidence, "Keep practicing");
    assert.equal(record.journal?.approach, "Use a hash map.");
    assert.equal(record.journal?.solution_code, "def twoSum():\n    pass\n");
    assert.deepEqual(record.reviews, [
      {
        review_type: "Recall",
        scheduled_for: "2026-10-20",
        status: "due",
      },
      {
        review_type: "Re-solve",
        scheduled_for: "2026-10-18",
        status: "done",
      },
    ]);
    assert.equal("user_id" in record, false);
  });

  it("returns a null journal when the user has not written one", () => {
    const record = shapeProblemRecord({
      problem: problem(),
      journal: null,
      tasks: [],
      today: "2026-10-20",
    });

    assert.equal(record.journal, null);
    assert.deepEqual(record.reviews, []);
  });
});
