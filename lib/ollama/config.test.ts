import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isOllamaEnabled, ollamaHost, ollamaModel } from "./config.ts";

describe("isOllamaEnabled", () => {
  it("is off by default", () => {
    assert.equal(isOllamaEnabled({}), false);
  });

  it("is off when the flag is true on Vercel", () => {
    assert.equal(isOllamaEnabled({ OLLAMA_ENABLED: "true", VERCEL: "1" }), false);
  });

  it("is off when the flag is anything other than true", () => {
    assert.equal(isOllamaEnabled({ OLLAMA_ENABLED: "false" }), false);
  });

  it("is on only when the flag is true and VERCEL is unset", () => {
    assert.equal(isOllamaEnabled({ OLLAMA_ENABLED: "true" }), true);
  });
});

describe("ollamaHost", () => {
  it("defaults to the local daemon", () => {
    assert.equal(ollamaHost({}), "http://127.0.0.1:11434");
  });

  it("uses OLLAMA_HOST without a trailing slash", () => {
    assert.equal(
      ollamaHost({ OLLAMA_HOST: "http://127.0.0.1:11435/" }),
      "http://127.0.0.1:11435"
    );
  });
});

describe("ollamaModel", () => {
  it("defaults to llama3.2", () => {
    assert.equal(ollamaModel({}), "llama3.2");
  });

  it("uses OLLAMA_MODEL when it is set", () => {
    assert.equal(ollamaModel({ OLLAMA_MODEL: "qwen2.5" }), "qwen2.5");
  });
});
