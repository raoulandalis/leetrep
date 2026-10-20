import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { modelIsReady, readModelNames } from "./status.ts";

describe("readModelNames", () => {
  it("reads model names from an Ollama tags payload", () => {
    assert.deepEqual(
      readModelNames({ models: [{ name: "llama3.2:latest" }, { name: "qwen2.5:7b" }] }),
      ["llama3.2:latest", "qwen2.5:7b"]
    );
  });

  it("returns an empty list when the payload has no models", () => {
    assert.deepEqual(readModelNames({}), []);
    assert.deepEqual(readModelNames({ models: "nope" }), []);
  });
});

describe("modelIsReady", () => {
  it("matches the configured name or its tag", () => {
    assert.equal(modelIsReady(["llama3.2:latest"], "llama3.2"), true);
    assert.equal(modelIsReady(["llama3.2"], "llama3.2"), true);
    assert.equal(modelIsReady(["qwen2.5:7b"], "llama3.2"), false);
  });
});
