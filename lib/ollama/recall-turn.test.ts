import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  lookupInstruction,
  nextRecallStep,
  parseRecallTurn,
  recallInstruction,
  toolNameFromText,
} from "./recall-turn.ts";

const JOURNAL_APPROACH = "Store each number's complement in a hash map.";

describe("parseRecallTurn", () => {
  it("stays put for a side question", () => {
    assert.deepEqual(
      parseRecallTurn(
        '{"advance":false,"message":"Good question. You get an array and a target. Walk through how you would solve this."}'
      ),
      {
        advance: false,
        message:
          "Good question. You get an array and a target. Walk through how you would solve this.",
      }
    );
  });

  it("advances for a real answer", () => {
    assert.deepEqual(
      parseRecallTurn('{"advance":true,"message":"That walkthrough is enough."}'),
      { advance: true, message: "That walkthrough is enough." }
    );
  });

  it("stays put when the reply is not JSON", () => {
    assert.deepEqual(parseRecallTurn("I lost the format."), {
      advance: false,
      message: "I lost the format.",
    });
  });
});

describe("recallInstruction", () => {
  it("names the current prompt and leaves out journal text", () => {
    const instruction = recallInstruction("Walk through how you would solve this.");

    assert.match(instruction, /helpful teacher would say out loud/);
    assert.match(instruction, /Walk through how you would solve this/);
    assert.match(instruction, /2-3 sentences/);
    assert.match(instruction, /Reveal a solution only when they explicitly ask/);
    assert.match(instruction, /Do not write a tool call/);
    assert.equal(instruction.includes(JOURNAL_APPROACH), false);
  });

  it("treats a walkthrough as an answer and a request as a question", () => {
    const instruction = recallInstruction("Walk through how you would solve this.");

    assert.match(instruction, /Decide from the user's latest message only/);
    assert.match(instruction, /An incomplete answer still counts/);
    assert.match(instruction, /A question asks you for the problem/);
    assert.match(instruction, /Do not reuse an example/);
    assert.equal(instruction.includes("Good question"), false);
    assert.equal(instruction.includes("array of numbers and a target"), false);
  });
});

describe("toolNameFromText", () => {
  it("reads a tool note typed as the reply", () => {
    assert.equal(
      toolNameFromText('{"name":"load_scraped_problem","parameters":{}}'),
      "load_scraped_problem"
    );
    assert.equal(
      toolNameFromText(
        '{"type":"function","function":"load_scraped_problem","parameters":{}}'
      ),
      "load_scraped_problem"
    );
    assert.equal(
      toolNameFromText(
        '{"advance":false,"message":"{\\"name\\":\\"load_scraped_problem\\",\\"parameters\\":{}}"}'
      ),
      "load_scraped_problem"
    );
  });

  it("ignores a normal coach reply", () => {
    assert.equal(
      toolNameFromText(
        '{"advance":false,"message":"You get an array and a target."}'
      ),
      null
    );
  });
});

describe("lookupInstruction", () => {
  it("asks for the lookup and not the user-facing reply", () => {
    assert.match(lookupInstruction(), /load_scraped_problem/);
    assert.match(lookupInstruction(), /Do not answer the user/);
  });
});

describe("nextRecallStep", () => {
  it("moves one prompt ahead only when the turn advances", () => {
    assert.equal(nextRecallStep(0, 3, false), 0);
    assert.equal(nextRecallStep(0, 3, true), 1);
    assert.equal(nextRecallStep(3, 3, true), 3);
  });
});
