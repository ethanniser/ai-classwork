import {
  Color,
  Griddler,
  GuideItem,
  Readonly2DArray,
  transposeMatrix,
} from ".";
import assert from "node:assert";

// griddler should be passed with empty solution grid
export function solve(griddler: Griddler): Griddler {
  let stuck = false;

  while (!stuck || !griddler.satisfiesGuides()) {
    for (let i = 0; i < griddler.width; i++) {
      const row = griddler.getRow(i);
      const permutations = allPermutations(row, griddler.guides.left[i]);
      const intersections = findIntersections(permutations);
    }
  }
  return griddler;
}

/** Row may contain existing information, or be fully unentered */
export function allPermutations(
  row: ReadonlyArray<Color>,
  hints: ReadonlyArray<GuideItem>
): Readonly2DArray<Color> {
  const hasExistingInfo = hints.every((x) => x.color === -1);
  if (hasExistingInfo) {
    throw new Error("Not implemented");
  }

  const permutations: Readonly2DArray<Color> = [];
  throw new Error("idk");
}

/** null means no intersection, anything is else is an intersection */
export function findIntersections(
  rows: Readonly2DArray<Color>
): ReadonlyArray<Color | null> {
  // assert all rows are the same length
  const length = rows[0].length;
  for (let i = 1; i < rows.length; i++) {
    assert(rows[i].length === length);
  }

  const arr: Array<Color | null> = [];

  const switched = transposeMatrix(rows);
  for (const col of switched) {
    const first = col[0];
    const allSame = col.every((x) => x === first);
    if (allSame) {
      arr.push(first);
    } else {
      arr.push(null);
    }
  }

  return arr;
}
