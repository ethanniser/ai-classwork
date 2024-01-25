import { describe, test, expect } from "bun:test";
import { PriorityQueue, WeightedGraph } from ".";

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

// from: https://www.cs.usfca.edu/~galles/visualization/Dijkstra.html
describe("dikstras", () => {
  test("simple", () => {
    const graph = new WeightedGraph();

    graph.addVertex("0");
    graph.addVertex("1");
    graph.addVertex("2");
    graph.addVertex("3");
    graph.addVertex("4");
    graph.addVertex("5");
    graph.addVertex("6");
    graph.addVertex("7");

    graph.addEdge("0", "2", 2);
    graph.addEdge("0", "3", 9);
    graph.addEdge("1", "2", 6);
    graph.addEdge("1", "5", 3);
    graph.addEdge("1", "6", 1);
    graph.addEdge("2", "0", 2);
    graph.addEdge("2", "1", 6);
    graph.addEdge("2", "5", 5);
    graph.addEdge("2", "6", 4);
    graph.addEdge("3", "0", 9);
    graph.addEdge("4", "6", 2);
    graph.addEdge("4", "7", 6);
    graph.addEdge("5", "1", 3);
    graph.addEdge("5", "2", 5);
    graph.addEdge("5", "6", 4);
    graph.addEdge("5", "7", 7);
    graph.addEdge("6", "1", 1);
    graph.addEdge("6", "2", 4);
    graph.addEdge("6", "4", 2);
    graph.addEdge("6", "5", 4);
    graph.addEdge("7", "4", 6);
    graph.addEdge("7", "5", 7);

    const result = graph.dijkstra("0");
    expect(result.distances).toEqual(
      new Map(
        Object.entries({
          ["0"]: 0,
          ["1"]: 7,
          ["2"]: 2,
          ["3"]: 9,
          ["4"]: 8,
          ["5"]: 7,
          ["6"]: 6,
          ["7"]: 14,
        })
      )
    );

    expect(result.previous).toEqual(
      new Map(
        Object.entries({
          ["0"]: null,
          ["1"]: "6",
          ["2"]: "0",
          ["3"]: "0",
          ["4"]: "6",
          ["5"]: "2",
          ["6"]: "2",
          ["7"]: "5",
        })
      )
    );
  });
});
