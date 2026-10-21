import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  problemSlug,
  resolveStatement,
  statementFromGraphql,
  stripHtml,
} from "./statement.ts";

describe("problemSlug", () => {
  it("reads the slug from a problem URL", () => {
    assert.equal(
      problemSlug("https://leetcode.com/problems/two-sum/description/"),
      "two-sum"
    );
    assert.equal(
      problemSlug("https://leetcode.com/problems/two-sum/"),
      "two-sum"
    );
  });

  it("returns null when the URL has no problem slug", () => {
    assert.equal(problemSlug("https://leetcode.com/problems/"), null);
    assert.equal(problemSlug("not a url"), null);
  });
});

describe("stripHtml", () => {
  it("keeps the statement text and drops tags", () => {
    const text = stripHtml(
      "<p>You are given an array of integers <code>nums</code>.</p><pre>\nInput: nums = [2,7]\n</pre>"
    );

    assert.match(text, /You are given an array of integers nums/);
    assert.match(text, /Input: nums = \[2,7\]/);
    assert.equal(text.includes("<"), false);
  });
});

describe("statementFromGraphql", () => {
  it("returns stripped content", () => {
    assert.equal(
      statementFromGraphql({
        data: { question: { content: "<p>Add two numbers.</p>" } },
      }),
      "Add two numbers."
    );
  });

  it("returns null when content is missing", () => {
    assert.equal(statementFromGraphql({ data: { question: { content: null } } }), null);
    assert.equal(statementFromGraphql({}), null);
  });
});

describe("resolveStatement", () => {
  it("reuses a stored statement and does not replace it", () => {
    assert.deepEqual(resolveStatement("Saved statement.", "Fresh statement."), {
      statement: "Saved statement.",
      source: "cache",
    });
  });

  it("uses the fetched statement when nothing is stored", () => {
    assert.deepEqual(resolveStatement("  ", "Fresh statement."), {
      statement: "Fresh statement.",
      source: "fetch",
    });
  });

  it("returns null when both are empty", () => {
    assert.deepEqual(resolveStatement(null, null), { statement: null });
  });
});
