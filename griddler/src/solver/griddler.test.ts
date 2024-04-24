import { describe, it, expect } from "bun:test";
import { GriddlerImpl } from ".";

describe("griddler impl", () => {
  it("generates series hints 1", () => {
    expect(GriddlerImpl.generateGuide([0, 0, 0, 2, 0, 0, 2, 0, 0, 0])).toEqual([
      { n: 1, color: 2 },
      { n: 1, color: 2 },
    ]);

    expect(GriddlerImpl.generateGuide([0, 0, 0, 0, 0, 0, 0, 0, 0, 0])).toEqual(
      []
    );
  });
  it("correctly parses from json", () => {
    const json = `[[0, 0, 0, 2, 0, 0, 2, 0, 0, 0], [0, 0, 0, 2, 0, 0, 2, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 2, 0, 0, 0, 0, 2, 0, 0], [0, 0, 2, 2, 2, 2, 2, 2, 0, 0]]`;
    const griddler = GriddlerImpl.fromJSON(json);

    expect(griddler.width).toBe(10);
    expect(griddler.height).toBe(5);
    expect(griddler.solutionGrid).toEqual([
      [0, 0, 0, 2, 0, 0, 2, 0, 0, 0],
      [0, 0, 0, 2, 0, 0, 2, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 2, 0, 0, 0, 0, 2, 0, 0],
      [0, 0, 2, 2, 2, 2, 2, 2, 0, 0],
    ]);
    expect(griddler.guides.left).toEqual([
      [
        { n: 1, color: 2 },
        { n: 1, color: 2 },
      ],
      [
        { n: 1, color: 2 },
        { n: 1, color: 2 },
      ],
      [],
      [
        { n: 1, color: 2 },
        { n: 1, color: 2 },
      ],
      [{ n: 6, color: 2 }],
    ]);
    expect(griddler.guides.top).toEqual([
      [],
      [],
      [{ n: 2, color: 2 }],
      [
        { n: 2, color: 2 },
        { n: 1, color: 2 },
      ],
      [{ n: 1, color: 2 }],
      [{ n: 1, color: 2 }],
      [
        { n: 2, color: 2 },
        { n: 1, color: 2 },
      ],
      [{ n: 2, color: 2 }],
      [],
      [],
    ]);
  });
});
