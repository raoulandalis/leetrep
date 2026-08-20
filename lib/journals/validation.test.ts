import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseJournalForm } from "./validation.ts";

function form(values: Record<string, string>) {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) {
    data.set(key, value);
  }
  return data;
}

const base = {
  problem_id: "11111111-1111-1111-1111-111111111111",
};

describe("parseJournalForm", () => {
  it("stores pasted solution code", () => {
    const result = parseJournalForm(
      form({
        ...base,
        solution_code: "def twoSum(nums, target):\n    return []\n",
      })
    );

    assert.equal(result.ok, true);
    if (result.ok) {
      assert.equal(
        result.value.solution_code,
        "def twoSum(nums, target):\n    return []\n"
      );
    }
  });

  it("treats missing or whitespace-only solution code as empty", () => {
    const missing = parseJournalForm(form(base));
    const blank = parseJournalForm(form({ ...base, solution_code: "  \n\t" }));

    assert.equal(missing.ok, true);
    assert.equal(blank.ok, true);
    if (missing.ok) {
      assert.equal(missing.value.solution_code, null);
    }
    if (blank.ok) {
      assert.equal(blank.value.solution_code, null);
    }
  });

  it("keeps leading indentation on the first line of solution code", () => {
    const result = parseJournalForm(
      form({ ...base, solution_code: "    return nums[i]" })
    );

    assert.equal(result.ok, true);
    if (result.ok) {
      assert.equal(result.value.solution_code, "    return nums[i]");
    }
  });

  it("rejects solution code that is too long", () => {
    const result = parseJournalForm(
      form({
        ...base,
        solution_code: "x".repeat(32001),
      })
    );

    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.equal(
        result.error,
        "Solution code is too long. Keep it under 32,000 characters."
      );
    }
  });
});
