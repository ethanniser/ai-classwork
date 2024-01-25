import { describe, test, expect } from "bun:test";
import { PriorityQueue } from ".";

describe("PriorityQueue", () => {
  test("enqueue and size", () => {
    const pq = new PriorityQueue();
    pq.enqueue("node1", 1);
    pq.enqueue("node2", 2);
    expect(pq.size()).toBe(2);
  });

  test("dequeue and size", () => {
    const pq = new PriorityQueue();
    pq.enqueue("node1", 1);
    pq.enqueue("node2", 2);
    pq.dequeue();
    expect(pq.size()).toBe(1);
  });

  test("order of elements", () => {
    const pq = new PriorityQueue();
    pq.enqueue("node1", 5);
    pq.enqueue("node2", 1);
    pq.enqueue("node3", 3);
    expect(pq.dequeue()).toEqual({ node: "node2", priority: 1 });
    expect(pq.dequeue()).toEqual({ node: "node3", priority: 3 });
    expect(pq.dequeue()).toEqual({ node: "node1", priority: 5 });
  });

  test("dequeue on empty queue", () => {
    const pq = new PriorityQueue();
    expect(pq.dequeue()).toBeUndefined();
  });

  test("dequeue until empty", () => {
    const pq = new PriorityQueue();
    pq.enqueue("node1", 1);
    pq.dequeue();
    expect(pq.dequeue()).toBeUndefined();
  });

  test("enqueue duplicate priorities", () => {
    const pq = new PriorityQueue();
    pq.enqueue("node1", 1);
    pq.enqueue("node2", 1);
    expect(pq.dequeue()).toEqual({ node: "node1", priority: 1 });
    expect(pq.dequeue()).toEqual({ node: "node2", priority: 1 });
  });

  test("large number of elements", () => {
    const pq = new PriorityQueue();
    for (let i = 0; i < 1000; i++) {
      pq.enqueue(`node${i}`, i);
    }
    expect(pq.size()).toBe(1000);
    for (let i = 0; i < 1000; i++) {
      expect(pq.dequeue()).toEqual({ node: `node${i}`, priority: i });
    }
  });
});

// Example usage:
// const graph = new WeightedGraph();

// graph.addVertex("A");
// graph.addVertex("B");
// graph.addVertex("C");
// graph.addVertex("D");
// graph.addVertex("E");
// graph.addVertex("F");

// graph.addEdge("A", "B", 4);
// graph.addEdge("A", "C", 2);
// graph.addEdge("B", "E", 3);
// graph.addEdge("C", "D", 2);
// graph.addEdge("C", "F", 4);
// graph.addEdge("D", "E", 3);
// graph.addEdge("D", "F", 1);
// graph.addEdge("E", "F", 1);

// const result = graph.dijkstra("A");
// console.log("Distances:", result.distances);
// console.log("Previous:", result.previous);

// !TODO
describe("dikstras", () => {
  test("dijkstra", () => {
    expect(true).toBe(true);
  });
});
