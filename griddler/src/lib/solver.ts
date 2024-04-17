import type { Color, CellState, GuideItem, Griddler } from ".";
import { ReadonlyArray } from "effect";
import assert from "node:assert";

export function findAllRowCombinations(
  length: number,
  hints: readonly GuideItem[]
): CellState[][] {
  return findAllRowCombinationsInner(
    length,
    new Array(length).fill("unentered"),
    0,
    hints
  );
}

function findAllRowCombinationsInner(
  length: number,
  lastArray: ReadonlyArray<CellState>,
  // points to either start or index after mandatory 1 block spacer
  nextStartIndex: number,
  remainingHints: ReadonlyArray<GuideItem>
): CellState[][] {
  console.log(arguments);
  assert(nextStartIndex < length);
  // no more hints so no more combinations
  if (remainingHints.length === 0) {
    return [];
  }

  const nextHint = remainingHints[0];
  // not enough space to fit the next hint so no combonations
  if (nextStartIndex + nextHint.n > length) {
    return [];
  }

  const numOfNextBlockPossibilities =
    length - (nextStartIndex + 1) - nextHint.n + 1;

  const finalArray: CellState[][] = [];

  for (let i = 0; i < numOfNextBlockPossibilities; i++) {
    //TODO
  }

  return finalArray;
}
