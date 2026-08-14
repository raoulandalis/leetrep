import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { firstName, greetingPeriod } from "./greeting.ts";

describe("greetingPeriod", () => {
  it("returns morning for hours 0 through 11", () => {
    assert.equal(greetingPeriod(0), "morning");
    assert.equal(greetingPeriod(11), "morning");
  });

  it("returns afternoon for hours 12 through 16", () => {
    assert.equal(greetingPeriod(12), "afternoon");
    assert.equal(greetingPeriod(16), "afternoon");
  });

  it("returns evening for hours 17 through 23", () => {
    assert.equal(greetingPeriod(17), "evening");
    assert.equal(greetingPeriod(23), "evening");
  });
});

describe("firstName", () => {
  it("returns the first token of a display name", () => {
    assert.equal(firstName("Raoul Andalis"), "Raoul");
  });

  it("falls back to Athlete for empty or whitespace names", () => {
    assert.equal(firstName(""), "Athlete");
    assert.equal(firstName("  "), "Athlete");
  });
});
