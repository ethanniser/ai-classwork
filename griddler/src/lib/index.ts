type Color = "black" | "red";
type CellState = Color | "unentered" | "empty";

interface GuideItem {
  n: number;
  color: Color;
}

interface Griddler {
  colors: Color[];
  width: number;
  height: number;
  solutionGrid: ReadonlyArray<ReadonlyArray<CellState>>;
  guides: {
    // left to right, then bottom to top
    top: GuideItem[][][];
    // top to bottom, then right to left
    left: GuideItem[][][];
  };
}

interface GriddlerGameState {
  timeStarted: number;
  griddler: Griddler;
  liveGrid: CellState[][];
  pastStates: CellState[][][];
  currentSelectedColor: Color;
}

// https://www.griddlers.net/nonogram/-/g/i01?p_p_lifecycle=2&p_p_resource_id=griddlerHtml&p_p_cacheability=cacheLevelPage&_gpuzzles_WAR_puzzles_touchMode=false&_gpuzzles_WAR_puzzles_id=72526&_gpuzzles_WAR_puzzles_id=72526&_gpuzzles_WAR_puzzles_view=detail
const LED: Griddler = {
  colors: ["black", "red"],
  width: 5,
  height: 5,
  solutionGrid: [
    ["empty", "empty", "red", "empty", "empty"],
    ["empty", "red", "red", "red", "empty"],
    ["empty", "red", "red", "red", "empty"],
    ["empty", "black", "empty", "black", "empty"],
    ["empty", "black", "empty", "empty", "empty"],
  ],
  guides: {
    top: [
      [
        [],
        [
          { n: 2, color: "black" },
          { n: 2, color: "red" },
        ],
        [{ n: 3, color: "red" }],
        [
          { n: 1, color: "black" },
          { n: 2, color: "red" },
        ],
      ],
    ],
    left: [
      [
        [{ n: 1, color: "red" }],
        [{ n: 3, color: "red" }],
        [{ n: 3, color: "red" }],
        [
          { n: 1, color: "black" },
          { n: 1, color: "black" },
        ],
        [{ n: 1, color: "black" }],
      ],
    ],
  },
};
