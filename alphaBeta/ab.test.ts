import { describe, it, expect } from "bun:test";
import { BTree } from ".";
import { inspect } from "bun";

describe("alpha beta pruning", () => {
  it("depth 4", () => {
    const tree = BTree.createSetLeaves(4, [-16, -14, 2, -20, -6, 2, 4, -8]);
    expect(tree.alphaBetaSearch()).toBe(2);
  });

  it("depth 5", () => {
    const tree = BTree.createSetLeaves(
      5,
      [-13, 14, 11, -5, 20, 10, 10, -16, -17, 20, 14, 0, -13, -1, -17, -17]
    );
    console.log(inspect(tree, { depth: 10, colors: true }));
    expect(tree.alphaBetaSearch()).toBe(-5);
  });
});
