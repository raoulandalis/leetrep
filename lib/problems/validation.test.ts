import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseProblemForm } from "./validation.ts";

function form(values: Record<string, string>) {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) {
    data.set(key, value);
  }
  return data;
}

const valid = {
  title: "Two Sum",
  leetcode_url: "https://leetcode.com/problems/two-sum/",
  difficulty: "Easy",
  patterns: "Hash Map",
  date_completed: "2026-08-18",
  confidence: "Needs work",
};

describe("parseProblemForm", () => {
  it("requires a confidence rating", () => {
    const result = parseProblemForm(
      form({
        title: valid.title,
        leetcode_url: valid.leetcode_url,
        difficulty: valid.difficulty,
        patterns: valid.patterns,
        date_completed: valid.date_completed,
      })
    );
    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.equal(result.fieldErrors.confidence, "Choose how this problem feels.");
    }
  });

  it("rejects an unknown confidence value", () => {
    const result = parseProblemForm(form({ ...valid, confidence: "Pretty sure" }));
    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.equal(result.fieldErrors.confidence, "Choose how this problem feels.");
    }
  });

  it("accepts a valid confidence rating", () => {
    const result = parseProblemForm(form(valid));
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.equal(result.value.confidence, "Needs work");
    }
  });
});
