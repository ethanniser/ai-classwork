import { describe, it, expect } from "bun:test";
import { findAllRowCombinations } from "./solver";

describe("findAllRowCombinations", () => {
  it("1 hint short", () => {
    const result = findAllRowCombinations(3, [{ color: "black", n: 1 }]);
    expect(result).toEqual([
      ["black", "empty", "empty"],
      ["empty", "black", "empty"],
      ["empty", "empty", "black"],
    ]);
  });
  it("1 hint long", () => {
    const result = findAllRowCombinations(5, [{ color: "black", n: 3 }]);
    expect(result).toEqual([
      ["black", "black", "black", "empty", "empty"],
      ["empty", "black", "black", "black", "empty"],
      ["empty", "empty", "black", "black", "black"],
      ["black", "empty", "empty", "black", "black"],
      ["black", "black", "empty", "empty", "black"],
    ]);
  });
  it("2 hints short", () => {
    const result = findAllRowCombinations(5, [
      { color: "black", n: 1 },
      { color: "black", n: 2 },
    ]);
    expect(result).toEqual([
      ["black", "empty", "black", "black", "empty"],
      ["black", "empty", "empty", "black", "black"],
      ["empty", "black", "empty", "black", "black"],
    ]);
  });
});
