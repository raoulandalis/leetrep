import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { shouldStartTour } from "./should-start-tour.ts";

describe("shouldStartTour", () => {
  it("starts on the dashboard when the tour is not completed", () => {
    assert.equal(shouldStartTour(null, "/dashboard"), true);
  });

  it("does not start when the tour is already completed", () => {
    assert.equal(shouldStartTour("2026-08-18T18:00:00.000Z", "/dashboard"), false);
  });

  it("does not start off the dashboard even if the tour is not completed", () => {
    assert.equal(shouldStartTour(null, "/problems"), false);
    assert.equal(shouldStartTour(null, "/progress"), false);
  });
});
