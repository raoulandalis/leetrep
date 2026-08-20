import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { patternPieSlices } from "./pattern-pie.ts";

describe("patternPieSlices", () => {
  it("returns no slices when there are no tags", () => {
    assert.deepEqual(patternPieSlices([]), { total: 0, slices: [] });
  });

  it("keeps every pattern when there are at most seven", () => {
    const result = patternPieSlices([
      { name: "Arrays", count: 3 },
      { name: "Hash Map", count: 1 },
    ]);

    assert.equal(result.total, 4);
    assert.deepEqual(
      result.slices.map((slice) => ({
        name: slice.name,
        count: slice.count,
        start: slice.start,
        end: slice.end,
      })),
      [
        { name: "Arrays", count: 3, start: 0, end: 0.75 },
        { name: "Hash Map", count: 1, start: 0.75, end: 1 },
      ]
    );
  });

  it("folds overflow into Other after seven patterns", () => {
    const patterns = [
      { name: "A", count: 8 },
      { name: "B", count: 7 },
      { name: "C", count: 6 },
      { name: "D", count: 5 },
      { name: "E", count: 4 },
      { name: "F", count: 3 },
      { name: "G", count: 2 },
      { name: "H", count: 1 },
      { name: "I", count: 1 },
    ];

    const result = patternPieSlices(patterns);

    assert.equal(result.total, 37);
    assert.equal(result.slices.length, 8);
    assert.deepEqual(
      result.slices.map((slice) => slice.name),
      ["A", "B", "C", "D", "E", "F", "G", "Other"]
    );
    assert.equal(result.slices[7]?.count, 2);
    assert.equal(result.slices[0]?.start, 0);
    assert.equal(result.slices[7]?.end, 1);
  });
});
