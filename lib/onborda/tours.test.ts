import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { tours } from "./tours.ts";

describe("welcome tour hops", () => {
  const welcome = tours.find((tour) => tour.tour === "welcome");
  const steps = welcome?.steps ?? [];

  it("includes a welcome tour", () => {
    assert.ok(welcome);
  });

  it("leaves the dashboard for problems, then progress", () => {
    const addProblem = steps.find((step) => step.selector === "#onborda-add-problem");
    const problems = steps.find((step) => step.selector === "#onborda-problems");
    const progress = steps.find((step) => step.selector === "#onborda-progress");

    assert.equal(addProblem?.nextRoute, "/problems");
    assert.equal(problems?.nextRoute, "/progress");
    assert.equal(problems?.prevRoute, "/dashboard");
    assert.equal(progress?.prevRoute, "/problems");
    assert.equal(progress?.nextRoute, undefined);
  });
});
