export class PriorityQueue {
  backing: { node: string; priority: number }[];

  constructor() {
    this.backing = [];
  }

  public size() {
    return this.backing.length;
  }

  public enqueue(node: string, priority: number) {
    this.backing.push({ node, priority });
    let index = this.backing.length - 1;
    this.percolateUp(index);
  }

  public dequeue(): { node: string; priority: number } | undefined {
    if (this.backing.length === 0) {
      return undefined;
    } else if (this.backing.length === 1) {
      return this.backing.pop();
    }
    const result = this.backing[0];
    this.backing[0] = this.backing.pop()!;
    this.percolateDown(0);
    return result;
  }

  private percolateUp(index: number) {
    while (index > 0) {
      const parentIndex = this.getParentIndex(index);
      if (this.backing[parentIndex].priority <= this.backing[index].priority) {
        break;
      }
      const temp = this.backing[parentIndex];
      this.backing[parentIndex] = this.backing[index];
      this.backing[index] = temp;
      index = parentIndex;
    }
  }

  private percolateDown(index: number) {
    while (this.getLeftChildIndex(index) < this.backing.length) {
      let smallerChildIndex = this.getLeftChildIndex(index);
      if (
        this.getRightChildIndex(index) < this.backing.length &&
        this.backing[this.getRightChildIndex(index)].priority <
          this.backing[smallerChildIndex].priority
      ) {
        smallerChildIndex = this.getRightChildIndex(index);
      }

      if (
        this.backing[index].priority <= this.backing[smallerChildIndex].priority
      ) {
        break;
      }

      const temp = this.backing[index];
      this.backing[index] = this.backing[smallerChildIndex];
      this.backing[smallerChildIndex] = temp;
      index = smallerChildIndex;
    }
  }

  private getParentIndex(index: number) {
    return Math.floor((index - 1) / 2);
  }

  private getLeftChildIndex(index: number) {
    return 2 * index + 1;
  }

  private getRightChildIndex(index: number) {
    return 2 * index + 2;
  }
}

class WeightedGraph {
  adjacencyList: Map<string, { node: string; weight: number }[]>;

  constructor() {
    this.adjacencyList = new Map();
  }

  addVertex(vertex: string) {
    if (!this.adjacencyList.has(vertex)) {
      this.adjacencyList.set(vertex, []);
    }
  }

  addEdge(vertex1: string, vertex2: string, weight: number) {
    this.adjacencyList.get(vertex1)?.push({ node: vertex2, weight });
    this.adjacencyList.get(vertex2)?.push({ node: vertex1, weight });
  }

  dijkstra(startVertex: string) {
    const distances = new Map<string, number>();
    const previous = new Map<string, string | null>();
    const priorityQueue = new PriorityQueue();

    for (const vertex of this.adjacencyList.keys()) {
      if (vertex === startVertex) {
        distances.set(vertex, 0);
        priorityQueue.enqueue(vertex, 0);
      } else {
        distances.set(vertex, Infinity);
        priorityQueue.enqueue(vertex, Infinity);
      }
      previous.set(vertex, null);
    }

    while (priorityQueue.size() > 0) {
      const currentVertex = priorityQueue.dequeue()!.node;

      for (const neighbor of this.adjacencyList.get(currentVertex) || []) {
        const potentialDistance =
          distances.get(currentVertex)! + neighbor.weight;

        if (potentialDistance < (distances.get(neighbor.node) || Infinity)) {
          distances.set(neighbor.node, potentialDistance);
          previous.set(neighbor.node, currentVertex);
          priorityQueue.enqueue(neighbor.node, potentialDistance);
        }
      }
    }

    return { distances, previous };
  }
}
