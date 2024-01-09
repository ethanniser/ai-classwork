import util from "util";

class BTreeNode {
  public data: number | null;
  public left: BTreeNode | null;
  public right: BTreeNode | null;

  constructor(data?: number) {
    this.data = data ?? null;
    this.left = null;
    this.right = null;
  }
}

class BTree {
  public root: BTreeNode | null;

  constructor(root?: BTreeNode) {
    this.root = root ?? null;
  }

  static createSetLeaves(depth: number, leaveValues: number[]) {
    const root = new BTreeNode();

    function buildTree(node: BTreeNode, depth: number, leaveValues: number[]) {
      if (depth === 0) {
        node.data = leaveValues.shift() ?? null;
        return;
      }
      node.left = new BTreeNode();
      node.right = new BTreeNode();
      buildTree(node.left, depth - 1, leaveValues);
      buildTree(node.right, depth - 1, leaveValues);
    }

    buildTree(root, depth - 1, leaveValues);
    return new BTree(root);
  }

  static createRandomLeaves(depth: number) {
    const root = new BTreeNode();

    function buildTree(node: BTreeNode, depth: number) {
      if (depth === 0) {
        node.data = randomFromRange(-10, 10);
        return;
      }
      node.left = new BTreeNode();
      node.right = new BTreeNode();
      buildTree(node.left, depth - 1);
      buildTree(node.right, depth - 1);
    }

    buildTree(root, depth - 1);
    return new BTree(root);
  }

  public depth(): number {
    function depthHelper(node: BTreeNode | null): number {
      if (node === null) return 0;
      return Math.max(depthHelper(node.left), depthHelper(node.right)) + 1;
    }
    return depthHelper(this.root);
  }

  public alphaBetaSearch(): number {
    function alphaBeta(
      node: BTreeNode,
      isMaximizingPlayer: boolean,
      alpha: number,
      beta: number
    ): number {
      // Base case (leaf node)
      if (node.left === null && node.right === null) {
        return node.data!;
      }

      if (isMaximizingPlayer) {
        let bestVal = Number.NEGATIVE_INFINITY;
        let currentAlpha = alpha;

        // Traverse left child
        bestVal = node.left
          ? Math.max(bestVal, alphaBeta(node.left, false, currentAlpha, beta))
          : bestVal;
        currentAlpha = Math.max(currentAlpha, bestVal);

        // Prune if beta <= alpha
        if (beta <= currentAlpha) {
          console.log("PRUNING: ", node.right);
          return bestVal;
        }

        // Traverse right child
        bestVal = node.right
          ? Math.max(bestVal, alphaBeta(node.right, false, currentAlpha, beta))
          : bestVal;

        return bestVal;
      } else {
        let bestVal = Number.POSITIVE_INFINITY;
        let currentBeta = beta;

        // Traverse left child
        bestVal = node.left
          ? Math.min(bestVal, alphaBeta(node.left, true, alpha, currentBeta))
          : bestVal;
        currentBeta = Math.min(currentBeta, bestVal);

        // Prune if beta <= alpha
        if (currentBeta <= alpha) {
          console.log("PRUNING: ", node.left);
          return bestVal;
        }

        // Traverse right child
        bestVal = node.right
          ? Math.min(bestVal, alphaBeta(node.right, true, alpha, currentBeta))
          : bestVal;

        return bestVal;
      }
    }

    if (this.root === null) {
      throw new Error("Tree is empty");
    }

    const result = alphaBeta(
      this.root,
      true,
      Number.NEGATIVE_INFINITY,
      Number.POSITIVE_INFINITY
    );

    return result;
  }
}

function randomFromRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const tree = BTree.createSetLeaves(4, [-16, -14, 2, -20, -6, 2, 4, -8]);

// console.log(
//   util.inspect(tree, {
//     showHidden: false,
//     depth: null,
//     colors: true,
//   })
// );

console.log(tree.alphaBetaSearch());
console.log("is it 2?");
