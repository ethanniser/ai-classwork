import * as S from "@effect/schema/Schema";
import assert from "node:assert";

type Color = number;
// -1 = unentered
// 0 = empty
// integer = color up to client

type Readonly2DArray<T> = ReadonlyArray<ReadonlyArray<T>>;

interface GuideItem {
  n: number;
  color: Color;
}

interface Griddler {
  readonly width: number;
  readonly height: number;
  readonly solutionGrid: Readonly2DArray<Color>;
  readonly guides: {
    // left to right, then top to bottom
    readonly top: Readonly2DArray<GuideItem>;
    // top to bottom, then right to left
    readonly left: Readonly2DArray<GuideItem>;
  };
}

export class GriddlerImpl implements Griddler {
  public readonly width: number;
  public readonly height: number;
  public readonly solutionGrid: Readonly2DArray<Color>;
  public readonly guides: {
    // left to right, then top to bottom
    readonly top: Readonly2DArray<GuideItem>;
    // top to bottom, then right to left
    readonly left: Readonly2DArray<GuideItem>;
  };

  constructor(solutionGrid: Readonly2DArray<Color>) {
    this.solutionGrid = solutionGrid;
    this.width = solutionGrid[0].length;
    this.height = solutionGrid.length;
    this.guides = {
      left: solutionGrid.map((row) => GriddlerImpl.generateGuide(row)),
      top: transposeMatrix(solutionGrid).map((row) =>
        GriddlerImpl.generateGuide(row)
      ),
    };
  }

  static fromJSON(json: string): GriddlerImpl {
    const schema = S.Number.pipe(
      S.filter((x) => x >= 0 && x < 100),
      S.Array,
      S.Array,
      (_) => S.parseJson(_)
    );

    const result = S.decodeSync(schema)(json);
    return new GriddlerImpl(result);
  }

  public getRow(row: number): ReadonlyArray<Color> {
    return this.solutionGrid[row];
  }

  public getCol(column: number): ReadonlyArray<Color> {
    return this.solutionGrid.map((row) => row[column]);
  }

  static generateGuide(series: ReadonlyArray<Color>): ReadonlyArray<GuideItem> {
    const result: GuideItem[] = [];
    for (let i = 0; i < series.length; i++) {
      const color = series[i];
      if (color !== 0) {
        // not empty
        let count = 1;
        while (i + count < series.length && series[i + count] === color) {
          count++;
        }
        i += count - 1;
        result.push({ n: count, color });
      }
    }
    return result;
  }

  public toJSON(): string {
    return JSON.stringify(this.solutionGrid);
  }
}

export function transposeMatrix<T>(
  array: Readonly2DArray<T>
): Readonly2DArray<T> {
  assert(array.length > 0);
  const result: T[][] = [];
  for (let i = 0; i < array[0].length; i++) {
    const row: T[] = [];
    for (let j = 0; j < array.length; j++) {
      row.push(array[j][i]);
    }
    result.push(row);
  }
  return result;
}
