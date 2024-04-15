import type { Color, CellState, GuideItem, Griddler } from ".";
import { ReadonlyArray } from "effect";
import assert from "node:assert";

function findAllRowCombinations(
  length: number,
  hints: readonly GuideItem[]
): CellState[][] {
  return findAllRowCombinationsInner(length, [], hints);
}

function findAllRowCombinationsInner(
  length: number,
  // always contains mandatory 1 block spacer as last item, unless empty
  startingArray: ReadonlyArray<CellState>,
  remainingHints: ReadonlyArray<GuideItem>
): CellState[][] {
  console.log(arguments);
  assert(startingArray.length <= length);
  // no more hints so no more combinations
  if (remainingHints.length === 0) {
    return [];
  }

  const nextHint = remainingHints[0];
  // not enough space to fit the next hint so no combonations
  if (startingArray.length + nextHint.n > length) {
    return [];
  }

  const numOfNextBlockPossibilities =
    length - startingArray.length - nextHint.n + 1;
  console.log(numOfNextBlockPossibilities);

  return new Array({ length: numOfNextBlockPossibilities }).flatMap((_, i) => {
    const spacer: CellState[] =
      i === 0 ? [] : ReadonlyArray.makeBy(i, () => "empty");
    const nextBlock: CellState[] = ReadonlyArray.makeBy(
      nextHint.n,
      () => nextHint.color
    );
    const nextArray: CellState[] = ReadonlyArray.appendAll(
      startingArray,
      ReadonlyArray.flatten([spacer, nextBlock])
    );
    console.log({
      i,
      spacer,
      nextBlock,
      nextArray,
    });
    return findAllRowCombinationsInner(
      length,
      nextArray,
      remainingHints.slice(1)
    );
  });
}

console.log(findAllRowCombinations(5, [{ color: "black", n: 3 }]));
