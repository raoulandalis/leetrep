import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseProfileForm } from "./validation.ts";

function form(values: Record<string, string>) {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) {
    data.set(key, value);
  }
  return data;
}

describe("parseProfileForm", () => {
  it("requires a first name", () => {
    const result = parseProfileForm(form({ first_name: "  ", last_name: "Andalis" }));
    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.equal(result.fieldErrors.first_name, "Enter your first name.");
    }
  });

  it("requires a last name", () => {
    const result = parseProfileForm(form({ first_name: "Raoul", last_name: "" }));
    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.equal(result.fieldErrors.last_name, "Enter your last name.");
    }
  });

  it("rejects names longer than 80 characters", () => {
    const long = "a".repeat(81);
    const result = parseProfileForm(form({ first_name: long, last_name: long }));
    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.equal(result.fieldErrors.first_name, "Keep this to 80 characters.");
      assert.equal(result.fieldErrors.last_name, "Keep this to 80 characters.");
    }
  });

  it("trims a valid first and last name", () => {
    const result = parseProfileForm(
      form({ first_name: "  Raoul  ", last_name: " Andalis " })
    );
    assert.deepEqual(result, {
      ok: true,
      value: { first_name: "Raoul", last_name: "Andalis" },
    });
  });
});
