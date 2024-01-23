/* 
edges: an adjacency dictionary
values: the list of numbers, that represents a complete binary tree (just like for the code you wrote)
node: the node number you are evaluating (root node is 0)
is_max: true for the maximizing player, false for the minimizing player
bounds: a list with two numbers, the lower and upper bounds for the possible values of the game (this should be started with [-Infinity, Infinity])

output: the number of leaf nodes used. 
*/

export function alphabeta_eval(
  edges: Record<number, number[]>,
  values: number[],
  node: number,
  is_max: boolean,
  bounds: [number, number]
): number {
  const [_, leaf_count] = alphabeta_eval_inner(
    edges,
    values,
    node,
    is_max,
    bounds
  );
  return leaf_count;
}

function alphabeta_eval_inner(
  edges: Record<number, number[]>,
  values: number[],
  node: number,
  is_max: boolean,
  bounds: [number, number]
): [child_value: number, leaf_count: number] {
  const children = edges[node];

  // Base case: no children (leaf node)
  if (children.length === 0) {
    return [values[node], 1];
  }

  // Recursive case: children exist
  const [lower_bound, upper_bound] = bounds;

  if (is_max) {
    let best_value = -Infinity;
    let new_lower_bound = lower_bound;
    let leafCount = 0;

    for (const child of children) {
      const [childValue, childLeafCount] = alphabeta_eval_inner(
        edges,
        values,
        child,
        false,
        [new_lower_bound, upper_bound]
      );

      best_value = Math.max(best_value, childValue);
      new_lower_bound = Math.max(new_lower_bound, best_value);
      leafCount += childLeafCount; // Accumulate leaf counts

      if (best_value >= upper_bound) {
        break;
      }
    }

    values[node] = best_value;
    return [best_value, leafCount];
  } else {
    let best_value = Infinity;
    let new_upper_bound = upper_bound;
    let leafCount = 0;

    for (const child of children) {
      const [childValue, childLeafCount] = alphabeta_eval_inner(
        edges,
        values,
        child,
        true,
        [lower_bound, new_upper_bound]
      );

      best_value = Math.min(best_value, childValue);
      new_upper_bound = Math.min(new_upper_bound, best_value);
      leafCount += childLeafCount; // Accumulate leaf counts

      if (best_value <= lower_bound) {
        break;
      }
    }

    values[node] = best_value;
    return [best_value, leafCount];
  }
}
