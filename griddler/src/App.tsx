import { cn } from "./lib/utils";
import { CellState, Griddler, GriddlerGameState, LED } from "./lib";
import { create, useStore } from "zustand";
import { createContext, useContext, useRef } from "react";

type Actions = {
  changeColorAt(x: number, y: number, color: CellState): void;
  undo(): void;
  redo(): void;
  reset(): void;
};

const createGriddlerStore = (griddler: Griddler) =>
  create<GriddlerGameState & Actions>((set) => ({
    timeStarted: Date.now(),
    griddler: LED,
    liveGrid: new Array(griddler.height).fill(
      new Array(griddler.width).fill("empty")
    ),
    pastStates: [],
    currentSelectedColor: "black",
    changeColorAt: (x, y, color) =>
      set((state) => ({
        ...state,
        liveGrid: state.liveGrid.map((row, y2) =>
          row.map((cell, x2) => (x === x2 && y === y2 ? color : cell))
        ),
      })),
    undo: () =>
      set((state) => ({
        ...state,
        liveGrid: state.pastStates.pop()!,
        pastStates: state.pastStates,
      })),
    redo: () =>
      set((state) => ({
        ...state,
        pastStates: [...state.pastStates, state.liveGrid],
      })),
    reset: () =>
      set((state) => ({
        ...state,
        liveGrid: new Array(griddler.height).fill(
          new Array(griddler.width).fill("empty")
        ),
        pastStates: [],
      })),
  }));

type GriddlerStore = ReturnType<typeof createGriddlerStore>;

const GriddlerContext = createContext<GriddlerStore | null>(null);

type GriddlerProviderProps = React.PropsWithChildren<{
  griddler: Griddler;
}>;

function GriddlerProvider({ children, ...props }: GriddlerProviderProps) {
  const storeRef = useRef<GriddlerStore>();
  if (!storeRef.current) {
    storeRef.current = createGriddlerStore(props.griddler);
  }
  return (
    <GriddlerContext.Provider value={storeRef.current}>
      {children}
    </GriddlerContext.Provider>
  );
}

function useGriddlerContext<T>(
  selector: (state: GriddlerGameState & Actions) => T
): T {
  const store = useContext(GriddlerContext);
  if (!store) throw new Error("Missing GriddlerContext.Provider in the tree");
  return useStore(store, selector);
}

const ColorMap: Record<string, string> = {
  black: "bg-black",
  red: "bg-red-500",
  empty: "bg-white",
  unentered: "bg-gray-300",
};

function Cell({ color }: { color: string }) {
  return (
    <div className={cn("h-10 w-10 border border-black", ColorMap[color])}></div>
  );
}

function GameInner() {
  const state = useGriddlerContext((state) => state);
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="grid grid-cols-5 grid-rows-5 gap-1">
        {state.liveGrid.map((row, y) =>
          row.map((cell, x) => <Cell key={`${x},${y}`} color={cell} />)
        )}
      </div>
    </div>
  );
}

function Game({ griddler }: { griddler: Griddler }) {
  return (
    <GriddlerProvider griddler={griddler}>
      <GameInner />
    </GriddlerProvider>
  );
}

function App() {
  return (
    <>
      <div className="h-screen w-screen flex items-center justify-center">
        <Game griddler={LED} />
      </div>
    </>
  );
}

export default App;
