import { describe, it, expect } from "bun:test";
import { solve, findIntersections, allPermutations } from "./solver";

describe("allPermutations", () => {
  it("basic non existing info", () => {
    const row = [-1, -1, -1, -1, -1];
    const hints = [{ n: 2, color: 2 }];
    expect(allPermutations(row, hints)).toEqual(
      new Set([
        [2, 2, -1, -1, -1],
        [-1, 2, 2, -1, -1],
        [-1, -1, 2, 2, -1],
        [-1, -1, -1, 2, 2],
      ])
    );
  });
  it("basic existing info", () => {});
  it("multi color non existing info", () => {});
  it("multi color existing info", () => {});
});

describe("findIntersections", () => {
  it("no intersection", () => {
    const permutations = new Set([
      [2, -1],
      [-1, 2],
    ]);
    expect(findIntersections(permutations)).toEqual([null, null]);
  });
  it("basic intersection 1", () => {
    const permutations = new Set([
      [2, 2, -1],
      [-1, 2, 2],
    ]);
    expect(findIntersections(permutations)).toEqual([null, 2, null]);
  });
  it("basic intersection 2", () => {
    const permutations = new Set([
      [2, 2, -1],
      [-1, 2, 2],
    ]);
    expect(findIntersections(permutations)).toEqual([null, 2, null]);
  });
  it("multi color intersection", () => {
    // hints = [{ n: 3, color: 2 }, { n: 1, color: 3 }]
    // length = 6
    const permutations = new Set([
      [2, 2, 2, -1, 3, -1],
      [2, 2, 2, -1, -1, 3],
      [-1, 2, 2, 2, -1, 3],
    ]);
    expect(findIntersections(permutations)).toEqual([
      null,
      2,
      2,
      null,
      null,
      null,
    ]);
  });
});

describe("solve", () => {
  it("solves a griddler", () => {});
});
