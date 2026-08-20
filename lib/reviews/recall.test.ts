import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Journal } from "../journals/types.ts";
import {
  canCommitComplexity,
  fieldHasContent,
  recallCodaFields,
  recallPromptSteps,
} from "./recall.ts";

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

describe("fieldHasContent", () => {
  it("is true for non-whitespace strings", () => {
    assert.equal(fieldHasContent("hash map"), true);
  });

  it("is false for empty, whitespace, null, and undefined", () => {
    assert.equal(fieldHasContent(""), false);
    assert.equal(fieldHasContent("   \n\t"), false);
    assert.equal(fieldHasContent(null), false);
    assert.equal(fieldHasContent(undefined), false);
  });
});

describe("recallPromptSteps", () => {
  it("returns four steps in order for a full journal", () => {
    const steps = recallPromptSteps(
      notes({
        approach: "two pointers",
        key_insight: "seen set",
        why_it_works: "each pair once",
        time_complexity: "O(n)",
        space_complexity: "O(1)",
      })
    );

    assert.equal(steps.length, 4);
    assert.deepEqual(steps[0], {
      kind: "text",
      field: "approach",
      prompt: "Walk through how you would solve this.",
    });
    assert.deepEqual(steps[1], {
      kind: "text",
      field: "key_insight",
      prompt: "What idea made it click?",
    });
    assert.deepEqual(steps[2], {
      kind: "text",
      field: "why_it_works",
      prompt: "Why is this correct?",
    });
    assert.deepEqual(steps[3], {
      kind: "complexity",
      fields: ["time_complexity", "space_complexity"],
      prompt: "What are the time and space bounds?",
    });
  });

  it("omits a text step when that journal field is empty", () => {
    const steps = recallPromptSteps(
      notes({
        approach: "two pointers",
        why_it_works: "each pair once",
      })
    );

    assert.deepEqual(
      steps.map((step) => (step.kind === "text" ? step.field : step.kind)),
      ["approach", "why_it_works"]
    );
  });

  it("asks only time complexity when space is empty", () => {
    const steps = recallPromptSteps(
      notes({
        time_complexity: "O(n)",
      })
    );

    assert.deepEqual(steps, [
      {
        kind: "complexity",
        fields: ["time_complexity"],
        prompt: "What is the time complexity?",
      },
    ]);
  });

  it("asks only space complexity when time is empty", () => {
    const steps = recallPromptSteps(
      notes({
        space_complexity: "O(1)",
      })
    );

    assert.deepEqual(steps, [
      {
        kind: "complexity",
        fields: ["space_complexity"],
        prompt: "What is the space complexity?",
      },
    ]);
  });

  it("omits the complexity step when both bounds are empty", () => {
    const steps = recallPromptSteps(
      notes({
        approach: "two pointers",
      })
    );

    assert.equal(steps.some((step) => step.kind === "complexity"), false);
  });

  it("returns no prompt steps when only coda fields are filled", () => {
    assert.deepEqual(
      recallPromptSteps(notes({ struggles: "off-by-one" })),
      []
    );
  });

  it("does not quiz on pasted solution code", () => {
    assert.deepEqual(
      recallPromptSteps(notes({ solution_code: "def twoSum():\n    pass\n" })),
      []
    );
  });
});

describe("recallCodaFields", () => {
  it("returns struggles when that field is the only content", () => {
    assert.deepEqual(recallCodaFields(notes({ struggles: "off-by-one" })), [
      "struggles",
    ]);
  });

  it("returns both coda fields when both have content", () => {
    assert.deepEqual(
      recallCodaFields(
        notes({
          struggles: "off-by-one",
          additional_notes: "empty array",
        })
      ),
      ["struggles", "additional_notes"]
    );
  });

  it("includes solution code in coda when present", () => {
    assert.deepEqual(
      recallCodaFields(notes({ solution_code: "def twoSum():\n    pass\n" })),
      ["solution_code"]
    );
  });

  it("omits empty coda fields", () => {
    assert.deepEqual(recallCodaFields(notes({ approach: "two pointers" })), []);
  });
});

describe("canCommitComplexity", () => {
  it("requires every shown field to have a complexity option", () => {
    assert.equal(
      canCommitComplexity(["time_complexity", "space_complexity"], {
        time_complexity: "O(n)",
      }),
      false
    );
    assert.equal(
      canCommitComplexity(["time_complexity", "space_complexity"], {
        time_complexity: "O(n)",
        space_complexity: "O(1)",
      }),
      true
    );
  });

  it("rejects values that are not complexity options", () => {
    assert.equal(
      canCommitComplexity(["time_complexity"], { time_complexity: "nope" }),
      false
    );
  });
});
