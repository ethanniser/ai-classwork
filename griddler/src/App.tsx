import { useState } from "react";
import { cn } from "./lib/utils";
import * as Game from "./lib";

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

function App() {
  const cells = Game.LED.solutionGrid;

  return (
    <>
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="grid grid-cols-5 grid-rows-5 gap-1">
          {cells.map((row, y) =>
            row.map((cell, x) => <Cell key={`${x},${y}`} color={cell} />)
          )}
        </div>
      </div>
    </>
  );
}

export default App;
