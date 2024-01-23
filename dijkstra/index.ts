class PriorityQueue {
  values: { node: string; priority: number }[];

  constructor() {
    this.values = [];
  }

  enqueue(node: string, priority: number) {
    this.values.push({ node, priority });
    // not optimal, but simple
    this.sort();
  }

  dequeue() {
    return this.values.shift();
  }

  sort() {
    this.values.sort((a, b) => a.priority - b.priority);
  }
}

class WeightedGraph {
  adjacencyList: { [key: string]: { node: string; weight: number }[] };

  constructor() {
    this.adjacencyList = {};
  }

  addVertex(vertex: string) {
    if (!this.adjacencyList[vertex]) {
      this.adjacencyList[vertex] = [];
    }
  }

  addEdge(vertex1: string, vertex2: string, weight: number) {
    this.adjacencyList[vertex1].push({ node: vertex2, weight });
    this.adjacencyList[vertex2].push({ node: vertex1, weight });
  }

  dijkstra(startVertex: string) {
    const distances: { [key: string]: number } = {};
    const previous: { [key: string]: string | null } = {};
    const priorityQueue = new PriorityQueue();

    for (const vertex in this.adjacencyList) {
      if (vertex === startVertex) {
        distances[vertex] = 0;
        priorityQueue.enqueue(vertex, 0);
      } else {
        distances[vertex] = Infinity;
        priorityQueue.enqueue(vertex, Infinity);
      }
      previous[vertex] = null;
    }

    while (priorityQueue.values.length > 0) {
      const currentVertex = priorityQueue.dequeue()!.node;

      if (currentVertex === null) break;

      for (const neighbor of this.adjacencyList[currentVertex]) {
        const potentialDistance = distances[currentVertex] + neighbor.weight;

        if (potentialDistance < distances[neighbor.node]) {
          distances[neighbor.node] = potentialDistance;
          previous[neighbor.node] = currentVertex;
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
