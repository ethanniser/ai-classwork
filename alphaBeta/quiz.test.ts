import { test, describe, expect } from "bun:test";
import { alphabeta_eval } from "./quiz";

describe("alphabeta_eval", () => {
  test("one", () => {
    const edges = {
      0: [1, 2],
      1: [3, 4],
      2: [5, 6],
      3: [],
      4: [],
      5: [],
      6: [],
    };
    const values = [0, 0, 0, 12, -7, -17, -15];

    const count = alphabeta_eval(edges, values, 0, true, [-Infinity, Infinity]);
    expect(count).toBe(3);
    expect(values).toEqual([-7, -7, -17, 12, -7, -17, -15]);
  });

  test("two", () => {
    const edges = {
      0: [1, 2],
      1: [3, 4],
      2: [5, 6],
      3: [7, 8],
      4: [9, 10],
      5: [11, 12],
      6: [13, 14],
      7: [],
      8: [],
      9: [],
      10: [],
      11: [],
      12: [],
      13: [],
      14: [],
    };
    const values = [0, 0, 0, 0, 0, 0, 0, -7, -13, -9, -4, -18, -14, 15, 7];

    const count = alphabeta_eval(edges, values, 0, true, [-Infinity, Infinity]);
    expect(count).toBe(6);
    expect(values).toEqual([
      -7, -7, -14, -7, -4, -14, 0, -7, -13, -9, -4, -18, -14, 15, 7,
    ]);
  });

  test("three", () => {
    const edges = {
      0: [1, 2],
      1: [3, 4],
      2: [5, 6],
      3: [7, 8],
      4: [9, 10],
      5: [11, 12],
      6: [13, 14],
      7: [],
      8: [],
      9: [],
      10: [],
      11: [],
      12: [],
      13: [],
      14: [],
    };
    const values = [0, 0, 0, 0, 0, 0, 0, -13, -7, 3, -14, -15, -13, -20, 18];

    const count = alphabeta_eval(edges, values, 0, true, [-Infinity, Infinity]);
    expect(count).toBe(5);
    expect(values).toEqual([
      -7, -7, -13, -7, 3, -13, 0, -13, -7, 3, -14, -15, -13, -20, 18,
    ]);
  });

  test("four", () => {
    const edges = {
      0: [1, 2],
      1: [3, 4],
      2: [5, 6],
      3: [7, 8],
      4: [9, 10],
      5: [11, 12],
      6: [13, 14],
      7: [15, 16],
      8: [17, 18],
      9: [19, 20],
      10: [21, 22],
      11: [23, 24],
      12: [25, 26],
      13: [27, 28],
      14: [29, 30],
      15: [],
      16: [],
      17: [],
      18: [],
      19: [],
      20: [],
      21: [],
      22: [],
      23: [],
      24: [],
      25: [],
      26: [],
      27: [],
      28: [],
      29: [],
      30: [],
    };
    const values = [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, -13, 18, -15, -2, -7, -6,
      1, 8, 17, -15, 13, -8, -2, -9, 5,
    ];

    const count = alphabeta_eval(edges, values, 0, true, [-Infinity, Infinity]);
    expect(count).toBe(12);
    expect(values).toEqual([
      -8, -13, -8, -13, -7, 8, -8, -13, -15, -7, 0, 8, -15, -8, -9, 5, -13, 18,
      -15, -2, -7, -6, 1, 8, 17, -15, 13, -8, -2, -9, 5,
    ]);
  });
});
