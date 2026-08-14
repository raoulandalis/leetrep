import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { greetingPeriod } from "./greeting.ts";

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
