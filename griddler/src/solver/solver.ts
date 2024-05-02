import {
  Color,
  Griddler,
  GuideItem,
  Readonly2DArray,
  transposeMatrix,
} from ".";
import assert from "node:assert";
import { Array } from "effect";

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
): Set<Color[]> {
  if (hints.length === 0) {
    return new Set();
  }

  const hasExistingInfo = hints.every((x) => x.color === -1);
  if (hasExistingInfo) {
    throw new Error("Not implemented");
  }

  const permutations: Set<Color[]> = new Set();
  if (hints.length > 1) {
    throw new Error("Not implemented");
  }

  const hint = hints[0];
  // the number of spaces
  const num = row.length - hint.n + 1;
  for (let i = 0; i < num; i++) {
    const newArray: Color[] = Array.copy(row);
    for (let j = i; j < i + hint.n; j++) {
      newArray[j] = hint.color;
    }
    permutations.add(newArray);
  }
  return permutations;
}

/** null means no intersection, anything is else is an intersection */
export function findIntersections(
  rows: Set<Color[]>
): ReadonlyArray<Color | null> {
  const rowArr = Array.fromIterable(rows.values());

  // assert all rows are the same length
  const length = rowArr[0].length;
  for (let i = 1; i < rowArr.length; i++) {
    assert(rowArr[i].length === length);
  }

  const arr: Array<Color | null> = [];

  const switched = transposeMatrix(rowArr);
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
