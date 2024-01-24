class PriorityQueue {
  backing: { node: string; priority: number }[];

  constructor() {
    this.backing = [];
  }

  enqueue(node: string, priority: number) {
    // TODO
  }

  dequeue(): { node: string; priority: number } | undefined {
    return this.backing[0];
  }

  size() {
    return this.backing.length;
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

// Example usage:

const graph = new WeightedGraph();

graph.addVertex("A");
graph.addVertex("B");
graph.addVertex("C");
graph.addVertex("D");
graph.addVertex("E");
graph.addVertex("F");

graph.addEdge("A", "B", 4);
graph.addEdge("A", "C", 2);
graph.addEdge("B", "E", 3);
graph.addEdge("C", "D", 2);
graph.addEdge("C", "F", 4);
graph.addEdge("D", "E", 3);
graph.addEdge("D", "F", 1);
graph.addEdge("E", "F", 1);

const result = graph.dijkstra("A");
console.log("Distances:", result.distances);
console.log("Previous:", result.previous);
