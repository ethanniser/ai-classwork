import { test, describe, expect } from "bun:test";

/* 
edges: an adjacency dictionary
values: the list of numbers, that represents a complete binary tree (just like for the code you wrote)
node: the node number you are evaluating (root node is 0)
is_max: true for the maximizing player, false for the minimizing player
bounds: a list with two numbers, the lower and upper bounds for the possible values of the game (this should be started with [-Infinity, Infinity])
*/
export function alphabeta_eval(
  edges: Record<number, number[]>,
  values: number[],
  node: number,
  is_max: boolean,
  bounds: [number, number]
): number {
  return 0;
}
