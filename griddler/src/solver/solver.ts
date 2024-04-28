import { Color, Griddler, GuideItem, Readonly2DArray } from ".";
import assert from "node:assert";

// griddler should be passed with empty solution grid
function solve(griddler: Griddler): Griddler {
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

function allPermutations(
  row: ReadonlyArray<Color>,
  hints: ReadonlyArray<GuideItem>
): Readonly2DArray<Color> {
  throw new Error("Not implemented");
}

function findIntersections(
  rows: Readonly2DArray<Color>
): Readonly2DArray<Color> {
  throw new Error("Not implemented");
}
