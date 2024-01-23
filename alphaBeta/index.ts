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

export class BTree {
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
      alpha: number,
      beta: number,
      player1: boolean
    ): number {
      // Base case (leaf node)
      if (node.left === null && node.right === null) {
        const data = node.data;
        if (data === null) throw new Error("Leaf data is null");
        return player1 ? data : -data;
      }

      let bestVal = Number.NEGATIVE_INFINITY;
      let currentAlpha = alpha;

      // Traverse left child
      bestVal = node.left
        ? // swap alpha + beta and inverse both
          Math.max(
            bestVal,
            -alphaBeta(node.left, -beta, -currentAlpha, !player1)
          )
        : bestVal;
      currentAlpha = Math.max(currentAlpha, bestVal);

      // Prune if beta <= alpha
      if (beta <= currentAlpha) {
        console.log("PRUNING: ", node.right);
        return bestVal;
      }

      // Traverse right child
      bestVal = node.right
        ? // swap alpha + beta and inverse both
          Math.max(
            bestVal,
            -alphaBeta(node.right, -beta, -currentAlpha, !player1)
          )
        : bestVal;

      return bestVal;
    }

    if (this.root === null) {
      throw new Error("Tree is empty");
    }

    const result = alphaBeta(
      this.root,
      Number.NEGATIVE_INFINITY,
      Number.POSITIVE_INFINITY,
      true
    );

    return result;
  }
}

function randomFromRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
