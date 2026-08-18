import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { nextQueueAction, wantsReviewQueue } from "./queue.ts";

describe("wantsReviewQueue", () => {
  it("treats Needs work, Keep practicing, and null as in-queue", () => {
    assert.equal(wantsReviewQueue("Needs work"), true);
    assert.equal(wantsReviewQueue("Keep practicing"), true);
    assert.equal(wantsReviewQueue(null), true);
  });

  it("treats Confident as out of the queue", () => {
    assert.equal(wantsReviewQueue("Confident"), false);
  });
});

describe("nextQueueAction", () => {
  it("enqueues a new Needs work problem with no tasks", () => {
    assert.equal(
      nextQueueAction({
        previous: null,
        next: "Needs work",
        incompleteCount: 0,
        totalCount: 0,
        restartCycle: false,
      }),
      "enqueue"
    );
  });

  it("enqueues a new Keep practicing problem with no tasks", () => {
    assert.equal(
      nextQueueAction({
        previous: null,
        next: "Keep practicing",
        incompleteCount: 0,
        totalCount: 0,
        restartCycle: false,
      }),
      "enqueue"
    );
  });

  it("does not enqueue a new Confident problem with no tasks", () => {
    assert.equal(
      nextQueueAction({
        previous: null,
        next: "Confident",
        incompleteCount: 0,
        totalCount: 0,
        restartCycle: false,
      }),
      "noop"
    );
  });

  it("dequeues leftover tasks when moving to Confident", () => {
    assert.equal(
      nextQueueAction({
        previous: "Needs work",
        next: "Confident",
        incompleteCount: 3,
        totalCount: 5,
        restartCycle: false,
      }),
      "dequeue"
    );
  });

  it("enqueues when leaving Confident with only completed tasks", () => {
    assert.equal(
      nextQueueAction({
        previous: "Confident",
        next: "Needs work",
        incompleteCount: 0,
        totalCount: 2,
        restartCycle: false,
      }),
      "enqueue"
    );
  });

  it("does not restart a finished cycle when staying on Needs work", () => {
    assert.equal(
      nextQueueAction({
        previous: "Needs work",
        next: "Needs work",
        incompleteCount: 0,
        totalCount: 5,
        restartCycle: false,
      }),
      "noop"
    );
  });

  it("restarts a finished cycle when restartCycle is set", () => {
    assert.equal(
      nextQueueAction({
        previous: "Needs work",
        next: "Keep practicing",
        incompleteCount: 0,
        totalCount: 5,
        restartCycle: true,
      }),
      "enqueue"
    );
  });

  it("stays out when the after-cycle pick is Confident", () => {
    assert.equal(
      nextQueueAction({
        previous: "Needs work",
        next: "Confident",
        incompleteCount: 0,
        totalCount: 5,
        restartCycle: true,
      }),
      "noop"
    );
  });

  it("does not change the queue when switching queued ratings with leftover tasks", () => {
    assert.equal(
      nextQueueAction({
        previous: "Needs work",
        next: "Keep practicing",
        incompleteCount: 3,
        totalCount: 5,
        restartCycle: false,
      }),
      "noop"
    );
  });

  it("enqueues a legacy unrated problem with no tasks", () => {
    assert.equal(
      nextQueueAction({
        previous: null,
        next: "Needs work",
        incompleteCount: 0,
        totalCount: 0,
        restartCycle: false,
      }),
      "enqueue"
    );
  });

  it("dequeues when an unrated problem with leftover tasks is marked Confident", () => {
    assert.equal(
      nextQueueAction({
        previous: null,
        next: "Confident",
        incompleteCount: 4,
        totalCount: 5,
        restartCycle: false,
      }),
      "dequeue"
    );
  });
});
