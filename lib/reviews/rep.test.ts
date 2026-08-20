import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  canRevealRecall,
  canStartRep,
  journalHasContent,
} from "./rep.ts";
import type { Journal } from "../journals/types.ts";

function notes(
  overrides: Partial<
    Pick<
      Journal,
      | "approach"
      | "key_insight"
      | "why_it_works"
      | "time_complexity"
      | "space_complexity"
      | "struggles"
      | "additional_notes"
      | "solution_code"
    >
  > = {}
) {
  return {
    approach: null,
    key_insight: null,
    why_it_works: null,
    time_complexity: null,
    space_complexity: null,
    struggles: null,
    additional_notes: null,
    solution_code: null,
    ...overrides,
  };
}

describe("canStartRep", () => {
  it("allows due and overdue tasks", () => {
    assert.equal(canStartRep("due"), true);
    assert.equal(canStartRep("overdue"), true);
  });

  it("blocks upcoming and done tasks", () => {
    assert.equal(canStartRep("upcoming"), false);
    assert.equal(canStartRep("done"), false);
  });
});

describe("canRevealRecall", () => {
  it("allows reveal when the recall text has non-whitespace content", () => {
    assert.equal(canRevealRecall("hash map"), true);
  });

  it("blocks reveal for empty or whitespace-only text", () => {
    assert.equal(canRevealRecall(""), false);
    assert.equal(canRevealRecall("   \n\t"), false);
  });
});

describe("journalHasContent", () => {
  it("is false when every journal field is empty", () => {
    assert.equal(journalHasContent(notes()), false);
    assert.equal(journalHasContent(notes({ approach: "  " })), false);
  });

  it("is true when any journal field has content", () => {
    assert.equal(journalHasContent(notes({ approach: "two pointers" })), true);
    assert.equal(journalHasContent(notes({ key_insight: "seen set" })), true);
    assert.equal(journalHasContent(notes({ time_complexity: "O(n)" })), true);
    assert.equal(
      journalHasContent(notes({ solution_code: "def twoSum():\n    pass\n" })),
      true
    );
  });
});
